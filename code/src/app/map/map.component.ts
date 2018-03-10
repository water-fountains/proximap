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
  private highlight;
  private userMarker;
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
    this.highlight = new M.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 10
    });
    // this.highlight.getElement().style.pointerEvents='none';

    this.userMarker = new M.Marker()
      .setLngLat(this.ngRedux.getState().userLocation)
      .addTo(this.map)
  }

  ngOnInit() {
    this.initializeMap();

    // When the app changes mode, change behaviour
    this.mode.subscribe(m =>{
      // adjust map shape because of details panel
      setTimeout(()=>this.map.resize(), 100);
      switch (m){
        case 'map': {this.zoomOut();}
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
    })
  }

  highlightFountainOnMap(fountain:Feature<any>){
    // check if null
    if(!fountain){
      // hide popup, not right away
      setTimeout(()=>{this.highlight.remove();}, 300)
    }else{
      // move to location
      this.highlight.setLngLat(fountain.geometry.coordinates);
      //set popup content
      this.highlight.setHTML('<h3>'+(fountain.properties.bezeichnung ? fountain.properties.bezeichnung : 'unnamed fountain')+'</h3>');
      // adjust size
      // this.highlight.getElement().style.width = this.map.getZoom();
      this.highlight.addTo(this.map);
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
      this.map.on('mousemove', 'fountains',e=>{
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
