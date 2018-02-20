import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';
import {DataService} from '../data.service';
import {MapConfig} from './map.config';
import {NgRedux, select} from 'ng2-redux';
import {IAppState} from '../store';
import {DESELECT_FOUNTAIN, SELECT_FOUNTAIN} from '../actions';
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
  @select() mode;
  @select() fountainId;
  @select() fountainSelected;

  constructor(private dataService: DataService, private mc: MapConfig, private ngRedux: NgRedux<IAppState>) {
  }

  selectFountain(fountainId){
    this.ngRedux.dispatch({type:SELECT_FOUNTAIN, fountainId: fountainId})
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
    pitch: 45} )
  }

  zoomOut(){
    this.map.flyTo({
      zoom: this.mc.map.zoom,
      pitch: 0
    });

  }



  initializeMap(){
    // Create map
    M.accessToken = environment.mapboxApiKey;
    this.map = new M.Map(Object.assign(
      this.mc.map,
      {container: 'map', }
      ))
      // .on('click',()=>this.deselectFountain())  // is it necessary to disable event bubbling on markers?
      .on('load',()=>{
        // load fountains if available
        let fountains = this.dataService.fountainsAll;
        if(fountains){
          this.loadData(fountains);
        }
      })
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
    this.dataService.fountainsFilteredSuccess.subscribe((idList:Array<string>) => {
      if(this.map.isStyleLoaded()) {
        this.filterMappedFountains(idList);
      }
    })

  }

  // filter fountains using array
  filterMappedFountains(fountainList){
    this.map.setFilter('fountains', ['match', ['get', 'nummer'], fountainList.map(function(feature) {
      return feature.properties.nummer;
    }), true, false]);
  }

  //  Try loading data into map
  loadData(data){
      // create data source
      this.map.addSource('fountains-src', {
        "type": "geojson",
        "data": data
      });

      // create points data source
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
            12, 2, 16, 10, 18, 30
          ],
          // Color circle by earthquake magnitude
          "circle-color": "darkblue",
          "circle-stroke-color": "white",
          "circle-stroke-width": 1,
          //   // Transition from heatmap to circle layer by zoom level
          //   "circle-opacity": [
          //   "interpolate",
          //   ["linear"],
          //   ["zoom"],
          //   7, 0,
          //   8, 1
          // ]
        }
      });
      // When click occurs, select fountain
      this.map.on('click', 'fountains',e=>{
        this.selectFountain(e.features[0].properties.nummer);
      });
      // Change the cursor to a pointer when the mouse is over the places layer.
      this.map.on('mouseenter', 'fountains', () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });
      this.map.on('mouseleave', 'fountains', () => {
        this.map.getCanvas().style.cursor = '';
      });
  }

}

function normalize(string) {
  return string.trim().toLowerCase();
}
