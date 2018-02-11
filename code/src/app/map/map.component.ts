import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';
import {DataService} from '../data.service';
import {MapConfig} from './map.config';
import {NgRedux, select} from 'ng2-redux';
import {IAppState} from '../store';
import {SELECT_FOUNTAIN} from '../actions';
import * as L from 'leaflet';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private map;
  private fountainLayer;
  private fountains = [];
  @select() mode;
  @select() fountainId;
  lat: number = this.mc.map.initialLat;
  lng: number = this.mc.map.initialLng;
  zoom: number = this.mc.map.initialZoom;

  constructor(private dataService: DataService, private mc: MapConfig, private ngRedux: NgRedux<IAppState>) {
  }

  selectFountain(fountainId){
    this.ngRedux.dispatch({type:SELECT_FOUNTAIN, fountainId: fountainId})
  }

  // deselectFountain(){
  //   this.ngRedux.dispatch({type: DESELECT_FOUNTAIN})
  // }

  zoomToFountain(f){
    this.map.flyTo([
      f['geometry']['coordinates'][1],
      f['geometry']['coordinates'][0]
    ], this.mc.map.maxMapZoom )
  }

  zoomOut(){
    this.map.setZoom(this.mc.map.initialZoom);
  }

  initializeMap(){
    // Create map
    this.map = new L.Map('map',
      {
        center: [this.lat, this.lng], // starting position [lng, lat]
        zoom: this.zoom // starting zoom
      });
    // Add background
    L.tileLayer(this.mc.map.tileLayerUrl, {apikey: environment.mapboxApiKey, zIndex: 2}).addTo(this.map);
    // Add layer to contain fountains
    this.fountainLayer = new L.LayerGroup().addTo(this.map)
  }


  ngOnInit() {

    this.initializeMap();

    // When the app changes mode, change behaviour
    this.mode.subscribe(m =>{
      // adjust map shape because of details panel
      setTimeout(()=>this.map.invalidateSize(), 100);
      switch (m){
        case 'map': {this.zoomOut();}
      }
    });

    // When app loads or city changes, update fountains
    this.dataService.fountains.subscribe( (fountains:Array<any>) =>{
      this.fountains = [];
      fountains.forEach(f=>{
        let markerLayer = L.marker([
          f['geometry']['coordinates'][1],
          f['geometry']['coordinates'][0]],
          {
            icon: L.icon({
              iconUrl: this.mc.fountainMarker.iconUrl,
              shadowUrl: this.mc.fountainMarker.shadowUrl,
              iconSize: this.mc.fountainMarker.iconSize,
              shadowSize: this.mc.fountainMarker.shadowSize,
              iconAnchor: this.mc.fountainMarker.iconAnchor,
              shadowAnchor: this.mc.fountainMarker.shadowAnchor,
            })
        });
        markerLayer['id'] = f['properties']['nummer'];
        markerLayer.on('click', ()=>this.selectFountain(markerLayer['id']));
        this.fountains.push(markerLayer)
      })
    }
    );

    // When fountains are filtered, update map
    this.dataService.filteredFountains.subscribe((fountains:Array<any>) => {
      let ids = fountains.map(f=>{return f['properties']['nummer']});
      this.fountains.forEach(l => {
        if (ids.indexOf(l['id']) > -1){
          //  add to map if in list
          l.addTo(this.fountainLayer);
        }else{
          l.remove();
        }
      })
    });

    // When a fountain is selected, zoom to it
    this.fountainId.subscribe(id =>{
      if (id){
        let f = this.dataService.getFountain(id);
        this.zoomToFountain(f);
      }
    })
  }

}
