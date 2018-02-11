import {Injectable} from '@angular/core';
import {Point} from 'leaflet';

@Injectable()
export class MapConfig {
  public map = {
      initialZoom:  15,
      initialLat:  47.3769,
      initialLng:  8.5417,
      minMapZoom:  13,
      maxMapZoom:  18,
      tileLayerUrl: 'https://api.mapbox.com/styles/v1/water-fountains/cjdfuslg5ftqo2squxk76q8pl/tiles/256/{z}/{x}/{y}?access_token={apikey}'
  };

  public fountainMarker = {
    iconUrl: "../../assets/fountainIcon.png",
    iconSize: new Point(8,24),
    iconAnchor: new Point(4,24),
    shadowUrl: "../../assets/fountainIconShadow.png",
    shadowSize: new Point(21,29),
    shadowAnchor: new Point(9,22)
  };

}
