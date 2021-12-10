/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as M from 'mapbox-gl';
import { EMPTY_LINESTRING } from '../../assets/defaultData';
import { environment } from '../../environments/environment';
import { LanguageService } from '../core/language.service';
import { LayoutService, Mode } from '../core/layout.service';
import { SubscriptionService } from '../core/subscription.service';
import { DataService } from '../data.service';
import { DirectionsService } from '../directions/directions.service';
import { FountainService } from '../fountain/fountain.service';
import { City } from '../locations';
import { Fountain, FountainCollection, LngLat } from '../types';
import { CityService } from '../city/city.service';
import { MapConfig } from './map.config';
import { UserLocationService } from './user-location.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [SubscriptionService],
})
export class MapComponent implements OnInit {
  private map!: M.Map;
  private _mode: Mode = 'map';
  private _selectedFountain: Fountain | null = null;
  private highlightPopup: M.Popup | undefined;
  private selectPopup: M.Popup | undefined; // popup displayed on currently selected fountain
  private userMarker: M.Marker | undefined;
  private geolocator: M.GeolocateControl | undefined;
  private navControl: M.NavigationControl | undefined;
  private directionsGeoJson = EMPTY_LINESTRING;
  private satelliteShown = false;

  constructor(
    private subscriptionService: SubscriptionService,
    private dataService: DataService,
    private mapConfig: MapConfig,
    private translateService: TranslateService,
    private languageService: LanguageService,
    private userLocationService: UserLocationService,
    private layoutService: LayoutService,
    private directionsService: DirectionsService,
    private fountainService: FountainService,
    private cityService: CityService
  ) {}

  ngOnInit(): void {
    this.initializeMap();

    this.subscriptionService.registerSubscriptions(
      // When the app changes mode, change behaviour
      this.layoutService.mode.subscribe(m => {
        // adjust map shape because of details panel
        setTimeout(() => this.map.resize(), 200);
        this._mode = m;
        this.adjustToMode();
      }),

      // when the language is changed, update popups
      this.languageService.langObservable.subscribe(lang => {
        console.log('lang "' + lang + '", mode ' + this._mode + ' ' + new Date().toISOString());
        if (this._mode !== 'map') {
          this.showSelectedPopupOnMap();
        }
      }),

      // when the city is changed, update map bounds
      this.cityService.city.subscribe(city => {
        if (city !== null) {
          this.zoomToCity(city);
          console.log('city "' + city + '" ' + new Date().toISOString());
        }
      }),

      // When directions are loaded, display on map
      this.directionsService.directions.subscribe(data => {
        if (data !== null) {
          // create valid linestring
          const newLine = EMPTY_LINESTRING;
          const firstFeature = newLine.features[0];
          if (firstFeature) {
            const dataGeometry = data.routes[0]?.geometry;
            if (dataGeometry !== undefined) {
              firstFeature.geometry = dataGeometry;
            }
            const coordinates = firstFeature.geometry.coordinates as [number, number][];
            const firstCoordinates = coordinates[0];
            if (firstCoordinates !== undefined) {
              const bounds = coordinates.reduce(function (bounds, coord) {
                return bounds.extend(coord);
              }, new M.LngLatBounds(firstCoordinates, firstCoordinates));
              this.map.fitBounds(bounds, {
                padding: 100,
              });
            }
          }
          (this.map.getSource('navigation-line') as M.GeoJSONSource).setData(newLine);
        }
      }),

      // When a fountain is selected, zoom to it
      this.fountainService.fountain.subscribe(f => {
        if (f) {
          this.setCurrentFountain(f);
        }
      }),

      // When fountains are filtered, show the fountains in the map
      this.dataService.fountainsFilteredSuccess.subscribe(fountainList => {
        // TODO @ralf.hauser, can the following be removed?
        // if (this.map.isStyleLoaded()) {
        //   this.filterMappedFountains(fountainList);
        // }
        if (fountainList !== null) {
          const fountains: FountainCollection = {
            features: fountainList,
            type: 'FeatureCollection',
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
      }),

      // When a fountain is hovered in list, highlight
      this.dataService.fountainHighlightedEvent.subscribe(fountain => {
        if (this.map.isStyleLoaded()) {
          this.highlightFountainOnMap(fountain);
        }
      }),

      // when user location changes, update map
      this.userLocationService.userLocation.subscribe(location => {
        if (location !== null && this.userMarker !== undefined) {
          this.userMarker.setLngLat(location).remove().addTo(this.map);

          this.map.flyTo({
            center: location,
            maxDuration: 1500,
            zoom: 16,
          });
        }
      })
    );
  }

  private setUserLocation(coordinates: LngLat): void {
    this.userLocationService.setUserLocation(coordinates);
  }

  private zoomToFountain(): void {
    if (this._selectedFountain !== null) {
      this.map.flyTo({
        // GeoJson has number[] for backward compatibility reasons but it is either [number, number] or [number, number, number]
        center: this._selectedFountain.geometry.coordinates as [number, number],
        zoom: this.mapConfig.map.maxZoom,
        pitch: 55,
        bearing: 40,
        maxDuration: 2500,
        offset: [0, -180],
      });
    }
  }

  // Zoom to city bounds (only if current map bounds are outside of new city's bounds)
  private zoomToCity(city: City): void {
    try {
      const bounds = this.dataService.getLocationBounds(city);
      const waiting = () => {
        if (!this.map.isStyleLoaded()) {
          setTimeout(waiting, 200);
        } else {
          this.cityService.city.subscribeOnce(currentCity => {
            // only refit city bounds if not zoomed into a fountain
            if (this._mode === 'map') {
              // might be the city already changed in the meantime - (after loading the map)
              // only fit the bounds if the city is still the same (to reduce map drawing operations)
              if (currentCity === city) {
                const options = {
                  maxDuration: 500,
                  pitch: 0,
                  bearing: 0,
                };
                this.map.fitBounds(bounds, options);
              }
            }
          });
        }
      };
      waiting();
    } catch (e: unknown) {
      console.error(e);
    }
  }

  private zoomOut(): void {
    this.map.flyTo({
      zoom: this.mapConfig.map.zoomAfterDetail,
      pitch: this.mapConfig.map.pitch,
      bearing: 0,
      maxDuration: 2500,
    });
  }

  private initializeMap(): void {
    // Create map
    this.map = new M.Map(
      Object.assign(this.mapConfig.map, {
        container: 'map',
        accessToken: environment.mapboxApiKey,
      })
    );

    // Add navigation control to map
    this.navControl = new M.NavigationControl({
      showCompass: true,
    });
    this.map.addControl(this.navControl, 'top-left');

    // Add geolocate control to the map.
    this.geolocator = new M.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      fitBoundsOptions: {
        maxZoom: this.mapConfig.map.maxZoom,
      },
      trackUserLocation: false,
    });
    this.map.addControl(this.geolocator);

    this.geolocator.on('geolocate', (positionO?: Object) => {
      if (positionO) {
        const position = positionO as GeolocationPosition;
        this.setUserLocation(LngLat(position.coords.longitude, position.coords.latitude));
      }
    });

    // highlight popup
    this.highlightPopup = new M.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 10,
    });

    // popup for selected fountain
    this.selectPopup = new M.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 10,
    });

    // user marker
    const el = document.createElement('div');
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

  private getId(fountain: Fountain): string {
    const prop = fountain.properties;
    if (null != prop['id_wikidata']) {
      return prop['id_wikidata'];
    }
    return prop['id_osm'];
  }

  private highlightFountainOnMap(fountain: Fountain | null): void {
    if (!fountain) {
      // hide popup, not right away
      setTimeout(() => {
        if (this.highlightPopup !== undefined) {
          this.highlightPopup.remove();
        }
      }, 1000);
    } else {
      if (this.highlightPopup !== undefined) {
        // TODO @ralf.hauser, can the following two lines be removed?
        // set id
        // this.highlightPopup.id = fountain.properties.id;
        // move to location
        this.highlightPopup.setLngLat(fountain.geometry.coordinates as [number, number]);
        //set popup content
        let name = fountain.properties['name_' + this.languageService.currentLang];
        // TODO @ralf.hauser, using instant will have the effect that it is not translated if a user changes the language
        // might be it does not matter in this specific case but could be a bug
        name = !name || name == 'null' ? this.translateService.instant('other.unnamed_fountain') : name;
        const phot = fountain.properties['photo'];
        let popUpHtml = `<h3>${name}</h3>`;
        if (phot == null) {
          console.log(
            'undefined photo for "' +
              name +
              '" id ' +
              fountain.properties['id'] +
              ', ' +
              this.getId(fountain) +
              ' ' +
              new Date().toISOString()
          );
        } else {
          popUpHtml += `<img style="display: ${
            phot ? 'block' : 'none'
          }; margin-right: auto; margin-left: auto" src="${phot}">`;
        }
        this.highlightPopup.setHTML(popUpHtml);
        // adjust size
        // this.highlight.getElement().style.width = this.map.getZoom();
        this.highlightPopup.addTo(this.map);
      }
    }
  }

  private removeDirections(): void {
    const firstFeature = EMPTY_LINESTRING.features[0];
    if (firstFeature !== undefined) {
      firstFeature.geometry.coordinates = [];
    }
    if (this.map.getSource('navigation-line')) {
      (this.map.getSource('navigation-line') as M.GeoJSONSource).setData(EMPTY_LINESTRING);
    }
  }

  private showSelectedPopupOnMap(): void {
    if (this._selectedFountain !== null && this.selectPopup !== undefined) {
      // hide popup
      this.selectPopup.remove();
      // show persistent popup over selected fountain
      // move to location
      this.selectPopup.setLngLat(this._selectedFountain.geometry.coordinates as [number, number]);
      //set popup content
      const fountainTitle =
        this._selectedFountain.properties['name_' + this.languageService.currentLang].value ||
        // TODO @ralf.hauser, using instant will have the effect that it is not translated if a user changes the language
        // might be it does not matter in this specific case but could be a bug
        this.translateService.instant('other.unnamed_fountain');
      this.selectPopup.setHTML(`<h3>${fountainTitle}</h3>`);
      this.selectPopup.addTo(this.map);
    }
  }

  // filter fountains using array
  filterMappedFountains(fountainList: Fountain[]): void {
    // if the list is empty or null, hide all fountains
    if (fountainList !== null) {
      if (fountainList.length == 0) {
        // set filter to look for non-existent key >> return none
        this.map.setFilter('fountains', ['has', 'nt_xst']);
      } else {
        // if the list is not empty, filter the map
        this.map.setFilter('fountains', [
          'match',
          ['get', 'id'],
          fountainList.map(fountain => fountain.properties['id']),
          true,
          false,
        ]);
      }
    }
  }

  //  Try loading data into map
  private loadData(data: FountainCollection): void {
    // create data source or just change data
    if (this.map.getSource('fountains-src') === undefined) {
      this.map.addSource('fountains-src', {
        type: 'geojson',
        data: data,
      });
      // initialize map layers if it wasn't done already
      this.createLayers();
    } else {
      (this.map.getSource('fountains-src') as M.GeoJSONSource).setData(data);
    }
  }

  private createLayers(): void {
    // create circle data source
    this.map.addLayer({
      id: 'fountains',
      type: 'circle',
      source: 'fountains-src',
      paint: {
        // Size circle radius by zoom level
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 12, 3, 18, 15, 20, 25],
        'circle-pitch-alignment': 'map',
        'circle-opacity': ['interpolate', ['linear'], ['zoom'], 16, 1, 18, 0.6],
        'circle-color': [
          'match',
          ['get', 'potable'],
          // ['properties'],
          'yes',
          '#017eac', // dark blue
          'no',
          '#1b1b1b', // black  proximap issue 282
          '#7c7c7c', //other "grey"
        ],
        'circle-stroke-color': 'white',
        'circle-stroke-width': 1,
      },
    });

    // create circle data source
    this.map.addLayer({
      id: 'fountain-icons',
      source: 'fountains-src',
      type: 'symbol',
      layout: {
        'icon-image': 'drinking-water-15',
        'icon-padding': 0,
        // "icon-allow-overlap":true,
        // "text-field": ["get", "name"],
        // "text-size": 8,
        // "text-optional": true,
        // "text-offset": [0,2]
      },
      paint: {
        'icon-opacity': ['interpolate', ['linear'], ['zoom'], 16, 0, 17, 1],
      },
    });
    // directions line
    // add the line which will be modified in the animation
    this.map.addLayer({
      id: 'navigation-line',
      type: 'line',
      source: {
        type: 'geojson',
        data: this.directionsGeoJson,
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#9724ed',
        'line-width': 5,
        'line-opacity': 0.8,
      },
    });

    // When click occurs, select fountain
    this.map.on('click', 'fountains', e => {
      const fountain = e?.features?.[0] as Fountain | undefined;
      if (fountain) {
        this.dataService.selectFountainByFeature(fountain);
        e.originalEvent.stopPropagation();
      }
    });

    //TODO @ralf.hauser implemented the same behaviour as before, but maybe it would make more sense to subscribe more than once?
    this.subscriptionService.registerSubscriptions(
      this.layoutService.isMobile.subscribeOnce(isMobile => {
        // When hover occurs, highlight fountain and change cursor
        // only register this if in desktop mode
        if (!isMobile) {
          this.map.on('mouseover', 'fountains', e => {
            const fountain = e?.features?.[0] as Fountain | undefined;
            if (fountain) {
              this.highlightFountainOnMap(fountain);
              this.map.getCanvas().style.cursor = 'pointer';
            }
          });
        }
      })
    );
    this.map.on('mouseleave', 'fountains', () => {
      this.highlightFountainOnMap(null);
      this.map.getCanvas().style.cursor = '';
    });
    this.map.on('dblclick', event => {
      this.setUserLocation(LngLat(event.lngLat.lng, event.lngLat.lat));
    });
    // TODO @ralf.hauser, can the following be removed?
    // this.map.on('click', ()=>{
    //   if(!this.map.isMoving()){
    //     this.deselectFountain();
    //   }
    // })
  }

  toggleBasemap(): void {
    this.satelliteShown = !this.satelliteShown;
    if (this.satelliteShown) {
      this.map.setLayoutProperty('mapbox-satellite', 'visibility', 'visible');
    } else {
      this.map.setLayoutProperty('mapbox-satellite', 'visibility', 'none');
    }
  }

  private adjustToMode(): void {
    switch (this._mode) {
      case 'map': {
        if (this.selectPopup !== undefined) {
          this.selectPopup.remove();
        }
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

  private setCurrentFountain(f: Fountain): void {
    if (f !== null) {
      this._selectedFountain = f;
    }
    this.zoomToFountain();
    this.showSelectedPopupOnMap();
  }
}
