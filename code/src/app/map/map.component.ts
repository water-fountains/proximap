import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';
import {DataService} from '../data.service';
import {MapConfig} from './map.config';

const tileLayerUrl: string = 'https://api.mapbox.com/styles/v1/water-fountains/cjdfuslg5ftqo2squxk76q8pl/tiles/256/{z}/{x}/{y}?access_token=' + environment.mapboxApiKey;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  public tileLayerUrl: string = tileLayerUrl;
  // public maxBounds: number = ;

  public fountains;

  constructor(private dataService: DataService, private mc: MapConfig) {

  }



  ngOnInit() {
  }

}
