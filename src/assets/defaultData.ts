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

export const DEFAULT_USER_LOCATION:Array<number> = [8.543359, 47.378762];

export const EMPTY_LINESTRING = // Create a GeoJSON source with an empty lineString.
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "geometry": {
      "type": "LineString",
      "coordinates": [
        // [0, 0]
      ]
    }
  }]
};
