import {Injectable} from '@angular/core';
import {Point} from 'leaflet';

@Injectable()
export class MapConfig {
  public map = {
    zoom:  15,
    pitch: 0,
    center: [8.5417,47.3769],
    minZoom:  12,
    maxZoom:  18,
    style: 'mapbox://styles/water-fountains/cjdfuslg5ftqo2squxk76q8pl',
    hash: false,
    pitchWithRotate: true,
  };

  public fountainMarker = {
    iconUrl: "../../assets/fountainIcon.png",
    iconSize: new Point(8,24),
    iconAnchor: new Point(4,24),
    shadowUrl: "../../assets/fountainIconShadow.png",
    shadowSize: new Point(21,29),
    shadowAnchor: new Point(9,22),
  };

}
