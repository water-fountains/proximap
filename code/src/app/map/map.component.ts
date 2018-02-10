import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';
import {DataService} from '../data.service';
import {MapConfig} from './map.config';
import {NgRedux, select} from 'ng2-redux';
import {IAppState} from '../store';
import {DESELECT_FOUNTAIN, SELECT_FOUNTAIN} from '../actions';

const tileLayerUrl: string = 'https://api.mapbox.com/styles/v1/water-fountains/cjdfuslg5ftqo2squxk76q8pl/tiles/256/{z}/{x}/{y}?access_token=' + environment.mapboxApiKey;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  public tileLayerUrl: string = tileLayerUrl;
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

  deselectFountain(){
    this.ngRedux.dispatch({type: DESELECT_FOUNTAIN})
  }

  zoomToFountain(f){
    this.lat = f['geometry']['coordinates'][1];
    this.lng = f['geometry']['coordinates'][0];
    this.zoom = 18;
    console.log('yo')
  }

  zoomOut(){
    this.zoom = 16;
  }


  ngOnInit() {

    this.mode.subscribe(m =>{
      switch (m){
        case 'map': {this.zoomOut()}
      }

    })
  }

}
