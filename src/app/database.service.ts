
import _ from 'lodash';
import haversine from 'haversine';
import {PropertyMetadataCollection} from './types';
import {DataService} from './data.service';


export function replaceFountain(fountains, fountain) {
  //    function updates local browser database with fountain


  // try to match with datblue id
  let index = fountains.features.map(f=>{return f.properties.id}).indexOf(fountain.properties.id);
  if(index>=0){
    //replace fountain
    fountains.features[index] = fountain;
    return fountains;
  }else{
    // fountain was not found; just add it to the Collection
    fountains.features.push(fountain);
    return fountains;
  }

}

function is_match(f1, f2):any {
  // returns true if match, otherwise returns distance
  _.forEach(['id_wikidata', 'id_operator', 'id_osm'], id_name=>{
    if(f1.properties[id_name] === f2.properties[id_name]){
      return true;
    }
    // compute distances
    return haversine(f1.geometry.coordinates, f2.geometry.coordinates, {
      unit: 'meter',
      format: '[lon,lat]'
    })
  })
}

export function essenceOf(fountain, propMeta) {

  let essentialPropNames = _.map(propMeta, (p, p_name)=>{if (p.hasOwnProperty('essential') || p.essential) {return p_name} });

    let props = _.pick(fountain.properties, essentialPropNames);
    props = _.mapValues(props, (obj)=>{
      return obj.value
    });
    // add id manually, since it does not have the standard property structure
    props.id = fountain.properties.id;

    // create feature
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: fountain.geometry.coordinates
      },
      properties: props
    }
}
