import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';
import {DataService} from '../data.service';
import {MapConfig} from './map.config';
import {NgRedux, select} from 'ng2-redux';
import {IAppState} from '../store';
import {DESELECT_FOUNTAIN, HIGHLIGHT_FOUNTAIN, SELECT_FOUNTAIN, SET_USER_LOCATION} from '../actions';
import * as M from 'mapbox-gl/dist/mapbox-gl.js';
import {Feature, FeatureCollection} from 'geojson';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private map;
  private fountains = [];
  private highlightPopup;
  private selectPopup;  // popup displayed on currently selected fountain
  private userMarker;
  @select() showList;
  @select() mode;
  @select() fountainId;
  @select() fountainSelected;
  @select() fountainHighlighted;
  @select() userLocation;

  constructor(private dataService: DataService, private mc: MapConfig, private ngRedux: NgRedux<IAppState>) {
  }

  selectFountain(fountain){
    this.ngRedux.dispatch({type:SELECT_FOUNTAIN, payload: fountain})
  }

  setUserLocation(coordinates){
    this.ngRedux.dispatch({type:SET_USER_LOCATION, payload: coordinates})
  }


  highlightFountain(fountain){
    this.ngRedux.dispatch({type:HIGHLIGHT_FOUNTAIN, payload: fountain})
  }

  deselectFountain(){
    this.ngRedux.dispatch({type: DESELECT_FOUNTAIN})
  }

  zoomToFountain(f){
    this.map.flyTo({
      center: [
        f['geometry']['coordinates'][0],
        f['geometry']['coordinates'][1],
        ],
      zoom: this.mc.map.maxZoom,
      pitch: 55,
      bearing: 40,
      maxDuration: 2500
    } )
  }

  zoomOut(){
    this.map.flyTo({
      zoom: this.mc.map.zoom,
      pitch: this.mc.map.pitch,
      bearing: 0,
      maxDuration: 2500
    });
  }

  initializeMap(){
    // Create map
    M.accessToken = environment.mapboxApiKey;
    this.map = new M.Map(Object.assign(
      this.mc.map,
      {
        container: 'map'
      }
      ))
      // .on('click',()=>this.deselectFountain())  // is it necessary to disable event bubbling on markers?
      .on('load',()=>{
        // load fountains if available
        let fountains = this.dataService.fountainsAll;
        if(fountains){
          this.loadData(fountains);
        }
      });
    // highlight popup
    this.highlightPopup = new M.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 10
    });
    // this.highlight.getElement().style.pointerEvents='none';

    this.selectPopup = new M.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 10
    });

    // user marker
    var el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = 'url(/assets/user_icon.png)';
    el.style.backgroundSize= 'cover';
    el.style.backgroundPosition= 'center';
    el.style.backgroundRepeat= 'no-repeat';
    el.style.width = '30px';
    el.style.height = '37px';
    this.userMarker = new M.Marker(el)
      .setLngLat(this.ngRedux.getState().userLocation)
      .addTo(this.map)
  }

  resizeMap(){

  }

  ngOnInit() {
    this.initializeMap();

    // When the app changes mode, change behaviour
    this.mode.subscribe(m =>{
      // adjust map shape because of details panel
      setTimeout(()=>this.map.resize(), 200);
      switch (m){
        case 'map': {
          this.selectPopup.remove();
          this.zoomOut();
        }
      }
    });

    // When app loads or city changes, update fountains
    this.dataService.fountainsLoadedSuccess.subscribe( (fountains:FeatureCollection<any>) => {
        if(this.map.isStyleLoaded()){
        //  add data to map
          this.loadData(fountains);
        }
    });

    // When a fountain is selected, zoom to it
    this.fountainSelected.subscribe((f:Feature<any>) =>{
      if(this.map.isStyleLoaded()) {
        this.zoomToFountain(f);
        this.showSelectedPopupOnMap(f);
      }
    });

    // When fountains are filtered, filter the fountains
    this.dataService.fountainsFilteredSuccess.subscribe((fountainList:Array<Feature<any>>) => {
      if(this.map.isStyleLoaded()) {
        this.filterMappedFountains(fountainList);
      }
    });

    // When a fountain is hovered in list, highlight
    this.fountainHighlighted.subscribe((f:Feature<any>) =>{
      if(this.map.isStyleLoaded()) {
        this.highlightFountainOnMap(f);
      }
    });

    // when user location changes, update map
    this.userLocation.subscribe(location =>{
      this.userMarker.setLngLat(location);
      this.map.flyTo({
        center: location,
        maxDuration: 1500
      });
    });
  }

  highlightFountainOnMap(fountain:Feature<any>){
    // check if null and if fountain not already selected
    if(!fountain){
      // hide popup, not right away
      setTimeout(()=>{this.highlightPopup.remove();}, 100)
    }else{
      // move to location
      this.highlightPopup.setLngLat(fountain.geometry.coordinates);
      //set popup content
      this.highlightPopup.setHTML('<h3>'+fountain.properties.bezeichnung+'</h3>');
      // adjust size
      // this.highlight.getElement().style.width = this.map.getZoom();
      this.highlightPopup.addTo(this.map);
    }
  }

showSelectedPopupOnMap(fountain:Feature<any>){
    // show persistent popup over selected fountain
    if(!fountain){
      // if no fountain selected, hide popup
      this.selectPopup.remove();
    }else{
      // move to location
      this.selectPopup.setLngLat(fountain.geometry.coordinates);
      //set popup content
      this.selectPopup.setHTML(
        '<h3>'+ fountain.properties.bezeichnung +'</h3>' +
        '<p>~' + (fountain.properties.distanceFromUser*1000).toLocaleString() + 'm away <br><span class=" water-type ' + fountain.properties.wasserart_txt + '">' + fountain.properties.wasserart_txt + '</span><br/>Baujahr: ' + fountain.properties.historisches_baujahr + '</p>'
      );
      this.selectPopup.addTo(this.map);
    }
  }

  // filter fountains using array
  filterMappedFountains(fountainList){
    this.map.setFilter('fountains', ['match', ['get', 'nummer'], fountainList.map(function(feature) {
      return feature.properties.nummer;
    }), true, false]);
    this.highlightFountainOnMap(fountainList[0]);
  }

  //  Try loading data into map
  loadData(data){
      // create data source
      this.map.addSource('fountains-src', {
        "type": "geojson",
        "data": data
      });

      // create circle data source
      this.map.addLayer({
        "id": "fountains",
        "type": "circle",
        "source": "fountains-src",
        "paint": {
          // Size circle radius by zoom level
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            12, 2, 16, 10, 18, 60
          ],
          "circle-pitch-alignment": 'map',
          "circle-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            16, 1, 18, 0.6
          ],
          "circle-color": [
            'match',
            ['get', 'wasserart_txt'] ,
            'Quellwasser', "#017eac",
            'Verteilnetz', "#014b62",
            '#1b1b1b' //other
          ],
          "circle-stroke-color": "white",
          "circle-stroke-width": 1,
        }
      });

      // create circle data source
      this.map.addLayer({
        "id": "fountain-icons",
        "source": "fountains-src",
        "type": "symbol",
        "layout": {
          "icon-image": "drinking-water-15",
          "icon-padding": 0,
          "icon-allow-overlap":true
        },
        "paint":{
          "icon-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            16, 0, 17, 1
          ]
        }
      });

      // When click occurs, select fountain
      this.map.on('click', 'fountains',(e)=>{
        this.selectFountain(e.features[0]);
        e.originalEvent.stopPropagation();
      });
      // When hover occurs, highlight fountain
      this.map.on('mouseenter', 'fountains',e=>{
        this.highlightFountain(e.features[0]);
      });
      this.map.on('mouseleave', 'fountains',()=>{
        this.highlightFountain(null);
      });
      // Change the cursor to a pointer when the mouse is over the places layer.
      this.map.on('mouseenter', 'fountains', () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });
      this.map.on('mouseleave', 'fountains', () => {
        this.map.getCanvas().style.cursor = '';
      });
      this.map.on('dblclick', (e)=>{
        this.setUserLocation([e.lngLat.lng,e.lngLat.lat]);
      });
      this.map.on('click', ()=>{
        if(!this.map.isMoving()){
          this.deselectFountain();
        }
      })
  }
}
