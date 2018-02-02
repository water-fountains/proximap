import { Component, OnInit } from '@angular/core';
import {latLng, tileLayer} from 'leaflet';
import { OSM_TILE_LAYER_URL }   from '@yaga/leaflet-ng2';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  public tileLayerUrl: string = OSM_TILE_LAYER_URL;


  constructor() {


  }



  ngOnInit() {
  }

}
