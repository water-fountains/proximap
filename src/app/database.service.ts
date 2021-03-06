/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';

export function replaceFountain(fountains, fountain) {
  //    function updates local browser database with fountain

  // try to match with datblue id
  const index = fountains.features
    .map(f => {
      return f.properties.id;
    })
    .indexOf(fountain.properties.id);
  if (index >= 0) {
    //replace fountain
    fountains.features[index] = fountain;
    return fountains;
  } else {
    // fountain was not found; just add it to the Collection
    fountains.features.push(fountain);
    return fountains;
  }
}

export function getImageUrl(pageTitle, imageSize = 640, type) {
  if (null == type || 'ext-fullImgUrl' == type || 'wm' != type) {
    return pageTitle;
  }
  const pTit = pageTitle.replace(/ /g, '_');
  const imgName = sanitizeTitle(pTit);
  const h = Md5.hashStr(pTit) + ' ';
  let url = `https://upload.wikimedia.org/wikipedia/commons/thumb/${h[0]}/${h.substring(0, 2)}/${imgName}`;
  if (0 < imageSize) {
    url += `/${imageSize}px-${imgName}`;
  }
  return url;
}

export function sanitizeTitle(title) {
  // this doesn't cover all situations, but the following doesn't work either
  // return encodeURI(title.replace(/ /g, '_'));
  return (
    title
      .replace(/,/g, '%2C')
      // .replace(/ü/g, '%C3%BC')
      .replace(/&/g, '%26')
  );
}

export function getId(fountain) {
  let id = 'nullFtn';
  if (null != fountain) {
    id = 'nullProps';
    const fPr = fountain.properties;
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
  console.log('prepImg: ' + new Date().toISOString() + ' ' + dbg);
  if (null != imgs) {
    console.log('images: ' + imgs.length);
    let i = 0;
    _.forEach(imgs, img => {
      i++;
      // console.log(i+" p "+img.big);
      if (null == img.big) {
        const pTit = img.pgTit.replace(/ /g, '_');
        img.big = this.getImageUrl(pTit, 1200, i + ' n', img.t);
        img.medium = this.getImageUrl(pTit, 512, i, img.t);
        img.small = this.getImageUrl(pTit, 120, i, img.t);
      }
    });
  }
  return imgs;
}

export function essenceOf(fountain, propMeta) {
  const essentialPropNames = _.map(propMeta, (p, p_name) => {
    if (Object.prototype.hasOwnProperty.call(p, 'essential') || p.essential) {
      return p_name;
    }
  });
  console.log(fountain.properties.id + ' essenceOf ' + new Date().toISOString());
  let props = _.pick(fountain.properties, essentialPropNames);
  props = _.mapValues(props, obj => {
    return obj.value;
  });
  // add id manually, since it does not have the standard property structure
  props.id = fountain.properties.id;
  console.log(props.id + ' ');
  let photoS = '';
  const gal = props.gallery;
  if (null != gal) {
    if (!gal.comments) {
      //we don't want google defaults
      console.log(props.id + ' ');
      const gv = gal.value;
      if (null != gv && 0 < gv.length && null != gv[0] && null != gv[0].small) {
        prepImg(gv, props.id);
        const gvs = gv[0].small;
        if (0 < gvs.trim().length) {
          photoS = gvs.replace(/"/g, '%22'); //double quote - not used
        }
      } else {
        console.log('Problem with gal.value ' + gv + ' ' + new Date().toISOString());
      }
    } else {
      console.log(props.id + ' ' + gal.comments + ' ' + new Date().toISOString());
    }
  } else {
    console.log(props.id + ' no gal " ' + new Date().toISOString());
  }
  props.photo = photoS;

  // create feature
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: fountain.geometry.coordinates,
    },
    properties: props,
  };
}
