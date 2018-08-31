
import _ from 'lodash';
import haversine from 'haversine';


export function replaceFountain(fountains, fountain) {
  //    function updates cache with fountain
  let distances = [];

  _.forEach(fountains.features, function(f, key){
    let ismatch = is_match(f, fountain);
    if(ismatch === true){
      //replace fountain
      fountains.features[key] = fountain;
      return fountains;
    }else{
      distances.push(ismatch)
    }
  });

  let min_d = _.min(distances);
  if(min_d < 15){
    let key = _.indexOf(distances, min_d);
    //replace fountain
    fountains.features[key] = fountain;
    return fountains;
  }else{
    // fountain was not found; jusst add it to the list
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

export function essenceOf(fountain) {

  let essentialPropNames = _.map(fountain.properties, (p, p_name)=>{if (p.essential) {return p_name} });

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
