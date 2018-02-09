import {Injectable} from '@angular/core';
import {Point} from 'leaflet';

@Injectable()
export class MapConfig {
  public map = {
      initialZoom:  13,
      initialLat:  47.3769,
      initialLng:  8.5417,
      minMapZoom:  10,
      maxMapZoom:  18
  };

  public fountainMarker = {
    iconUrl: "../../assets/fountainIcon.png",
    iconSize: new Point(24,24),
    iconAnchor: new Point(12,24)
  };

}
