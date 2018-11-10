import {Injectable} from '@angular/core';
import * as M from 'mapbox-gl/dist/mapbox-gl.js';
// import {Point} from 'leaflet';

@Injectable()
export class MapConfig {
  public map = {
    zoom:  14,
    pitch: 0,
    minZoom:  11,
    maxZoom:  18,
    zoomAfterDetail:  15,
    style: 'mapbox://styles/water-fountains/cjkspc6ad1zh22sntedr63ivh',
    style_gray: 'mapbox://styles/water-fountains/cjdfuslg5ftqo2squxk76q8pl',
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

  public locations = {
    "zurich": {
      "bounding_box": {
        "latMin": 47.3229261255644,
        "lngMin": 8.45960259979614,
        "latMax": 47.431119712250506,
        "lngMax": 8.61940272745742
      },
      "operator_qid": 'Q53629101'
    },
    "geneva": {
      "bounding_box": {
        "latMin": 46.113705723112744,
        "lngMin": 6.0129547119140625,
        "latMax": 46.29001987172955,
        "lngMax": 6.273880004882812
      },
      "operator_qid": null
    },
    "basel": {
      "bounding_box": {
        "latMin": 47.517200697839414,
        "lngMin": 7.544174194335937,
        "latMax": 47.60477416894759,
        "lngMax": 7.676696777343749
      },
      "operator_qid": 'Q53629101'
    }
  }

}
