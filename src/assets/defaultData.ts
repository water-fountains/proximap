/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { LineString } from 'geojson';
import { FountainCollection } from '../app/types';

export const EMPTY_LINESTRING: FountainCollection<LineString> =
  // Create a GeoJSON source with an empty lineString.
  {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            // [0, 0]
          ],
        },
        properties: {},
      },
    ],
  };
