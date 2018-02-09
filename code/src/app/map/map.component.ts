import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';

const tileLayerUrl: string = 'https://api.mapbox.com/styles/v1/water-fountains/cjdfuslg5ftqo2squxk76q8pl/tiles/256/{z}/{x}/{y}?access_token=' + environment.mapboxApiKey;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  public tileLayerUrl: string = tileLayerUrl;
  public initialZoom: number = 13;
  public initialLat: number = 47.3769;
  public initialLng: number = 8.5417;
  public minMapZoom: number = 10;
  public maxMapZoom: number = 18;
  // public maxBounds: number = ;


  constructor() {


  }



  ngOnInit() {
  }

}
