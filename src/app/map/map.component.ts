/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import {Component, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {DataService} from '../data.service';
import {ListComponent} from '../list/list.component';
import {MapConfig} from './map.config';
import {NgRedux, select} from '@angular-redux/store';
import {IAppState} from '../store';
import {SET_USER_LOCATION} from '../actions';
import * as M from 'mapbox-gl/dist/mapbox-gl.js';
import {Feature, FeatureCollection} from 'geojson';
import {EMPTY_LINESTRING} from '../../assets/defaultData';
import {TranslateService} from '@ngx-translate/core';
import {bounds} from 'leaflet';
import {DeviceMode} from '../types';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})


export class MapComponent implements OnInit {
  private map;
  private _mode = 'map';
  private _selectedFountain = null;
  private fountains = [];
  private highlightPopup;
  private selectPopup;  // popup displayed on currently selected fountain
  private directions;
  private userMarker;
  private geolocator;
  private navControl;
  private basemapControl;
  private lastZoomLocation: Array<number> = [];
  private navigationLine;
  private directionsGeoJson = EMPTY_LINESTRING;
  private satelliteShown = false;
  @select() showList;
  @select() mode$;
  @select() lang$;
  @select() city$;
  @select() device$;
  device: BehaviorSubject<DeviceMode> = new BehaviorSubject<DeviceMode>('mobile');
  @select() fountainId;
  @select() fountainSelected;
  @select() userLocation;
  @select('directions') stateDirections;

  constructor(private dataService: DataService,
              private listComponent: ListComponent,
              private mc: MapConfig,
              private translate: TranslateService,
              private ngRedux: NgRedux<IAppState>) {
  }

  setUserLocation(coordinates) {
    this.ngRedux.dispatch({type: SET_USER_LOCATION, payload: coordinates});
  }

  zoomToFountain() {
    if (this._selectedFountain !== null) {
      this.map.flyTo({
        center: this._selectedFountain.geometry.coordinates,
        zoom: this.mc.map.maxZoom,
        pitch: 55,
        bearing: 40,
        maxDuration: 2500,
        offset: [0, -180]
      });
    }
  }

  // Zoom to city bounds (only if current map bounds are outside of new city's bounds)
  zoomToCity(city:string):void {
    let options = {
      maxDuration: 500,
      pitch: 0,
      bearing: 0,
    };

    this.dataService.getLocationBounds(city)
      .then(bounds=>{
        const waiting = () => {
          if (!this.map.isStyleLoaded()) {
            setTimeout(waiting, 200);
          } else {
            if(this._mode === 'map')
              // only refit city bounds if not zoomed into a fountain
              this.map.fitBounds(bounds, options);
          }
        };
          waiting();
      })
      .catch(err=>console.log(err));
  }

  zoomOut() {
    this.map.flyTo({
      zoom: this.mc.map.zoomAfterDetail,
      pitch: this.mc.map.pitch,
      bearing: 0,
      maxDuration: 2500
    });
  }

  initializeMap() {
    // Create map
    M.accessToken = environment.mapboxApiKey;
    this.map = new M.Map(Object.assign(
      this.mc.map,
      {
        container: 'map'
      }
    ))

      .on('load', () => {
        // zoom to city
        // this.zoomToCity(this.ngRedux.getState().city);
      });

    // Add navigation control to map
    this.navControl = new M.NavigationControl({
      showCompass: true
    });
    this.map.addControl(this.navControl, 'top-left');

    // Add geolocate control to the map.
    this.geolocator = new M.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      fitBoundsOptions: {
        maxZoom: this.mc.map.maxZoom
      },
      trackUserLocation: false
    });
    this.map.addControl(this.geolocator);

    this.geolocator.on('geolocate', (position) => {
      this.setUserLocation([position.coords.longitude, position.coords.latitude]);
    });

    // highlight popup
    this.highlightPopup = new M.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 10
    });

    // popup for selected fountain
    this.selectPopup = new M.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 10
    });

    // // directions control
    // this.directions = new MapboxDirections({
    //   accessToken: environment.mapboxApiKey,
    //   unit: 'metric',
    //   profile: 'mapbox/walking',
    //   interactive: false,
    //   controls: {
    //     inputs: false
    //   }
    // });

    // user marker
    let el = document.createElement('div');
    el.className = 'userMarker';
    el.style.backgroundImage = 'url(/assets/user_icon.png)';
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.boxShadow = 'box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);';
    el.style.width = '30px';
    el.style.height = '37px';
    el.style.top = '-15px';
    this.userMarker = new M.Marker(el);
  }

  ngOnInit() {
    this.initializeMap();

    // When the app changes mode, change behaviour
    this.mode$.subscribe(m => {
      // adjust map shape because of details panel
      setTimeout(() => this.map.resize(), 200);
      this._mode = m;
      this.adjustToMode();
    });

    //if device is desktop, enable mouseover
    this.device$.subscribe(d=>{
      this.device = d;
    });

    // When app loads or city changes, update fountains
    this.dataService.fountainsLoadedSuccess.subscribe((fountains: FeatureCollection<any>) => {
      // const waiting = () => {
      //   if (!this.map.isStyleLoaded()) {
      //     setTimeout(waiting, 200);
      //   } else {
      //     this.loadData(fountains);
      //   }
      // };
      // waiting();
    });

    // when the language is changed, update popups
    this.lang$.subscribe(() => {
      if (this._mode !== 'map') {
        this.showSelectedPopupOnMap();
      }
    });

    // when the city is changed, update map bounds
    this.city$.subscribe(city => {
      if(city !== null) this.zoomToCity(city);
    });

    // When directions are loaded, display on map
    this.stateDirections.subscribe(data => {
      if (data !== null) {
        // create valid linestring
        let newLine = EMPTY_LINESTRING;
        newLine.features[0].geometry = data.routes[0].geometry;
        this.map.getSource('navigation-line').setData(newLine);

        let coordinates = newLine.features[0].geometry.coordinates;

        let bounds = coordinates.reduce(function (bounds, coord) {
          return bounds.extend(coord);
        }, new M.LngLatBounds(coordinates[0], coordinates[0]));

        this.map.fitBounds(bounds, {
          padding: 100
        });
      }
    });

    // When a fountain is selected, zoom to it
    this.fountainSelected.subscribe((f: Feature<any>) => {
      this.setCurrentFountain(f);
    });

    // When fountains are filtered, show the fountains in the map
    this.dataService.fountainsFilteredSuccess.subscribe((fountainList: Array<Feature<any>>) => {
      // if (this.map.isStyleLoaded()) {
      //   this.filterMappedFountains(fountainList);
      // }
      if(fountainList !== null){
        let fountains = {
          features: fountainList,
          type: 'FeatureCollection'
        };
        const waiting = () => {
          if (!this.map.isStyleLoaded()) {
            setTimeout(waiting, 200);
          } else {
            this.loadData(fountains);
          }
        };
        waiting();
      }
    });

    // When a fountain is hovered in list, highlight
    this.dataService.fountainHighlightedEvent.subscribe((f: Feature<any>) => {
      if (this.map.isStyleLoaded()) {
        this.highlightFountainOnMap(f);
      }
    });
    //
    // // When a fountain is hovered in list, highlight
    // this.fountainHighlighted.subscribe((f:Feature<any>) =>{
    //   if(this.map.isStyleLoaded()) {
    //     this.highlightFountainOnMap(f);
    //   }
    // });

    // when user location changes, update map
    this.userLocation.subscribe(location => {
      if (location !== null) {
        this.userMarker
          .setLngLat(location)
          .remove()
          .addTo(this.map);

        this.map.flyTo({
          center: location,
          maxDuration: 1500,
          zoom: 16
        });
      }
    });
  }

  getId(fountain: Feature<any>) {
    const prop = fountain.properties;
    if (null != prop.id_wikidata) {
      return prop.id_wikidata;
    }
    return prop.id_osm;
  }

  highlightFountainOnMap(fountain: Feature<any>) {
    // check if null
    if (!fountain) {
      // hide popup, not right away
      setTimeout(() => {
        this.highlightPopup.remove();
      }, 100);

    }else {
      // set id
      this.highlightPopup.id = fountain.properties.id;
      // move to location
      this.highlightPopup.setLngLat(fountain.geometry.coordinates);
      //set popup content
      let name = fountain.properties['name_' + this.ngRedux.getState().lang];
      name = (!name || name == 'null') ? this.translate.instant('other.unnamed_fountain') : name;
      const phot = fountain.properties.photo;
      let popUpHtml = `<h3>${name}</h3>`;
      if (phot == null) {
        console.log('undefined photo for "'+name+'" id '+fountain.properties.id+', '+this.getId(fountain)+' '+new Date().toISOString());
      } else {
        popUpHtml+= `<img style="display: ${phot?'block':'none'}; margin-right: auto; margin-left: auto" src="${phot}">`;
      }
      this.highlightPopup.setHTML(popUpHtml);
      // adjust size
      // this.highlight.getElement().style.width = this.map.getZoom();
      this.highlightPopup.addTo(this.map);
    }
  }

  removeDirections() {
    EMPTY_LINESTRING.features[0].geometry.coordinates = [];
    if (this.map.getSource('navigation-line')) {
      this.map.getSource('navigation-line').setData(EMPTY_LINESTRING);
    }
  }

  showSelectedPopupOnMap() {
    if (this._selectedFountain !== null) {
      // hide popup
      this.selectPopup.remove();
      // show persistent popup over selected fountain
      // move to location
      this.selectPopup.setLngLat(this._selectedFountain.geometry.coordinates);
      //set popup content
      let fountainTitle = this._selectedFountain.properties['name_' + this.ngRedux.getState().lang].value || this.translate.instant('other.unnamed_fountain');
      this.selectPopup.setHTML(
        `<h3>${fountainTitle}</h3>`
      );
      this.selectPopup.addTo(this.map);
    }
  }

  // filter fountains using array
  filterMappedFountains(fountainList) {
    // if the list is empty or null, hide all fountains
    if(fountainList !== null){
      if ((fountainList.length == 0)) {
        // set filter to look for non-existent key >> return none
        this.map.setFilter('fountains', ['has', 'nt_xst']);
      } else {
        // if the list is not empty, filter the map
        this.map.setFilter('fountains', ['match', ['get', 'id'], fountainList.map(function (feature) {
          return feature.properties.id;
        }), true, false]);
      }
    }

  }

  //  Try loading data into map
  loadData(data) {
    // create data source or just change data
    if (this.map.getSource('fountains-src') === undefined) {
      this.map.addSource('fountains-src', {
        'type': 'geojson',
        'data': data
      });
      // initialize map layers if it wasn't done already
      this.createLayers();
    } else {
      this.map.getSource('fountains-src').setData(data);
    }
  }

  createLayers() {
    // create circle data source
    this.map.addLayer({
      'id': 'fountains',
      'type': 'circle',
      'source': 'fountains-src',
      'paint': {
        // Size circle radius by zoom level
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          12, 3, 18, 15, 20, 25
        ],
        'circle-pitch-alignment': 'map',
        'circle-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          16, 1, 18, 0.6
        ],
        'circle-color': [
          'match',
          ['get', 'potable'],
          // ['properties'],
          'yes', '#017eac', // dark blue
          'no', '#1b1b1b', // black  proximap issue 282
          '#7c7c7c' //other "grey"
        ],
        'circle-stroke-color': 'white',
        'circle-stroke-width': 1,
      }
    });

    // create circle data source
    this.map.addLayer({
      'id': 'fountain-icons',
      'source': 'fountains-src',
      'type': 'symbol',
      'layout': {
        'icon-image': 'drinking-water-15',
        'icon-padding': 0,
        // "icon-allow-overlap":true,
        // "text-field": ["get", "name"],
        // "text-size": 8,
        // "text-optional": true,
        // "text-offset": [0,2]
      },
      'paint': {
        'icon-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          16, 0, 17, 1
        ]
      }
    });
    // directions line
    // add the line which will be modified in the animation
    this.map.addLayer({
      'id': 'navigation-line',
      'type': 'line',
      'source': {
        'type': 'geojson',
        'data': this.directionsGeoJson
      },
      'layout': {
        'line-cap': 'round',
        'line-join': 'round'
      },
      'paint': {
        'line-color': '#9724ed',
        'line-width': 5,
        'line-opacity': .8
      }
    });

    // When click occurs, select fountain
    this.map.on('click', 'fountains', (e) => {
      this.dataService.selectFountainByFeature(e.features[0]);
      e.originalEvent.stopPropagation();
    });
    // When hover occurs, highlight fountain and change cursor
    // only register this if in desktop mode
    if(this.device.valueOf() === 'desktop'){
      this.map.on('mouseover', 'fountains', e => {
        this.highlightFountainOnMap(e.features[0]);
        this.map.getCanvas().style.cursor = 'pointer';
      });
    }
    this.map.on('mouseleave', 'fountains', () => {
      this.highlightFountainOnMap(null);
      this.map.getCanvas().style.cursor = '';
    });
    this.map.on('dblclick', (e) => {
      this.setUserLocation([e.lngLat.lng, e.lngLat.lat]);
    });
    // this.map.on('click', ()=>{
    //   if(!this.map.isMoving()){
    //     this.deselectFountain();
    //   }
    // })
  }

  toggleBasemap() {
    this.satelliteShown = !this.satelliteShown;
    if (this.satelliteShown) {
      this.map.setLayoutProperty('mapbox-satellite', 'visibility', 'visible');
    } else {
      this.map.setLayoutProperty('mapbox-satellite', 'visibility', 'none');
    }
  }

  adjustToMode() {
    switch (this._mode) {
      case 'map': {
        this.selectPopup.remove();
        this.zoomOut();
        this.removeDirections();
        break;
      }
      case 'details': {
        this.removeDirections();
        this.zoomToFountain();
        break;
      }
      case 'directions': {
        if (this.map.isStyleLoaded()) {
          // this.map.setLayoutProperty('navigation-line', 'visibility', 'visible');
        }
      }
    }
  }

  private setCurrentFountain(f: Feature<any>) {
    if (f !== null) {
      this._selectedFountain = f;
    }
    this.zoomToFountain();
    this.showSelectedPopupOnMap();
  }
}
