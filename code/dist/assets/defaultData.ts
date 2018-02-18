import {FeatureCollection} from 'geojson';

export const DEFAULT_FOUNTAINS:FeatureCollection<any> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0,0]
      },
      properties: {
        nummer: 0,
        bezeichnung: 'default fountain'
      }
    }
  ]
};
