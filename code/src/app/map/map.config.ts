import {Injectable} from '@angular/core';
import * as M from 'mapbox-gl/dist/mapbox-gl.js';
// import {Point} from 'leaflet';

@Injectable()
export class MapConfig {
  public map = {
    zoom:  14,
    pitch: 0,
    center: [8.5417,47.3769],
    minZoom:  11,
    maxZoom:  18,
    style: 'mapbox://styles/water-fountains/cjdfuslg5ftqo2squxk76q8pl',
    hash: false,
    pitchWithRotate: true,
  };

  public fountainMarker = {
    iconUrl: "../../assets/fountainIcon.png",
    iconSize: new M.Point(8,24),
    iconAnchor: new M.Point(4,24),
    shadowUrl: "../../assets/fountainIconShadow.png",
    shadowSize: new M.Point(21,29),
    shadowAnchor: new M.Point(9,22),
  };

}
