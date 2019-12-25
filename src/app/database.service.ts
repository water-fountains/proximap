/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import _ from 'lodash';
import haversine from 'haversine';
import {PropertyMetadataCollection} from './types';
import {DataService} from './data.service';
import {Md5} from 'ts-md5/dist/md5';


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

export function  getImageUrl(pageTitle, imageSize=640, dbg){
  let imgName = sanitizeTitle(pageTitle);
  let h = Md5.hashStr(pageTitle)+' ';
  let url = `https://upload.wikimedia.org/wikipedia/commons/thumb/${h[0]}/${h.substring(0,2)}/${imgName}/${imageSize}px-${imgName}`;
  // console.log(dbg+" "+url+" '"+pageTitle+"'"); 
  return url;
}

export function sanitizeTitle(title){
  // this doesn't cover all situations, but the following doesn't work either
  // return encodeURI(title.replace(/ /g, '_'));
  return title
    .replace(/ /g, '_')
    .replace(/,/g, '%2C')
    // .replace(/ü/g, '%C3%BC')
    .replace(/&/g, '%26');
}

export function getId(fountain){
  let id = 'nullFtn';
  if (null != fountain) {
    id = 'nullProps';
    let fPr = fountain.properties;
    if (null != fPr) {
      id = fPr.id_wikidata;
      if (null == id) {
        id = fPr.id_osm;
      }
    }
  }
  return id;
}

function prepImg(imgs, dbg) {
  console.log("prepImg: "+new Date().toISOString()+ " "+dbg);
  if(null != imgs) {
    console.log("images: "+imgs.length);
    let i=0;
    _.forEach(imgs, img => {
      i++;
      // console.log(i+" p "+img.big);
      if (null == img.big)  {
        img.big = this.getImageUrl(img.pgTit, 1200,i+" n");
        img.medium = this.getImageUrl(img.pgTit, 512,i);
        img.small = this.getImageUrl(img.pgTit, 120,i);
      }
    });
  }
  return imgs;
}

export function essenceOf(fountain, propMeta) {

  let essentialPropNames = _.map(propMeta, (p, p_name)=>{if (p.hasOwnProperty('essential') || p.essential) {return p_name} });
    console.log(fountain.properties.id+" essenceOf "+new Date().toISOString());
    let props = _.pick(fountain.properties, essentialPropNames);
    props = _.mapValues(props, (obj)=>{
      return obj.value
    });
    // add id manually, since it does not have the standard property structure
    props.id = fountain.properties.id;
    console.log(props.id+" ");
    let photoS = '';
    if(!props.gallery.comments) {
      console.log(props.id+" ");
      //we don't want google defaults
      if (null !=  props.gallery && null !=  props.gallery.value && 0 < props.gallery.value.length) {
         prepImg(props.gallery.value, props.id);
         photoS = props.gallery.value[0].small;
      }
    } else {
      console.log(props.id+" "+props.gallery.comments);
    }
    props.photo = photoS;

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
