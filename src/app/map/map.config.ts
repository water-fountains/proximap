/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { Injectable } from '@angular/core';
import mapboxgl from 'mapbox-gl';

@Injectable()
export class MapConfig {
  public map = {
    zoom: 14,
    pitch: 0,
    minZoom: 11,
    maxZoom: 20,
    zoomAfterDetail: 15,
    //TODO @ralf.hauser not used, maxZoom is used in map.component.ts -> remove zoomToFountain?
    zoomToFountain: 17,
    style: 'mapbox://styles/water-fountains/cjkspc6ad1zh22sntedr63ivh',
    style_gray: 'mapbox://styles/water-fountains/cjdfuslg5ftqo2squxk76q8pl',
    hash: false,
    pitchWithRotate: true,
  };

  public fountainMarker = {
    iconUrl: '../../assets/fountainIcon.png',
    iconSize: new mapboxgl.Point(8, 24),
    iconAnchor: new mapboxgl.Point(4, 24),
    shadowUrl: '../../assets/fountainIconShadow.png',
    shadowSize: new mapboxgl.Point(21, 29),
    shadowAnchor: new mapboxgl.Point(9, 22),
  };
}
