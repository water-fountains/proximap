/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import {EventEmitter, Injectable, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgRedux, select} from '@angular-redux/store';
import {Feature, FeatureCollection, Point} from 'geojson';
import {IAppState, FountainSelector} from './store';
import {
  ADD_APP_ERROR,
  GET_DIRECTIONS_SUCCESS,
  PROCESSING_ERRORS_LOADED,
  SELECT_FOUNTAIN_SUCCESS,
  SELECT_PROPERTY
} from './actions';
import distance from 'haversine';
import {environment} from '../environments/environment';
import {essenceOf, replaceFountain,getImageUrl,getId,sanitizeTitle} from './database.service';
import {TranslateService} from '@ngx-translate/core';
import {versions as buildInfo} from '../environments/versions';
import {AppError, DataIssue, FilterData, PropertyMetadataCollection} from './types';
import {defaultFilter, propertyStatuses} from './constants';
import _ from 'lodash';
import {aliases} from './aliases';

@Injectable()
export class DataService {
  apiUrl = buildInfo.branch === 'stable' ? environment.apiUrlStable : environment.apiUrlBeta;
  private _currentFountainSelector: FountainSelector = null;
  private _fountainsAll: FeatureCollection<any> = null;
  private _fountainsFiltered: Array<any> = null;
  private _filter: FilterData = defaultFilter;
  private _city: string = null;
  private _propertyMetadataCollection: PropertyMetadataCollection = null;
  private _propertyMetadataCollectionPromise: Promise<PropertyMetadataCollection>;
  private _locationInfo: any = null;
  private _locationInfoPromise: Promise<any>;
  private _apiErrorList: AppError[] = [];
  @select() fountainId;
  @select() userLocation;
  @select() mode;
  @select('lang') lang$;
  @select('city') city$;
  @select('travelMode') travelMode$;
  @Output() fountainSelectedSuccess: EventEmitter<Feature<any>> = new EventEmitter<Feature<any>>();
  @Output() apiError: EventEmitter<AppError[]> = new EventEmitter<AppError[]>();
  @Output() fountainsLoadedSuccess: EventEmitter<FeatureCollection<any>> = new EventEmitter<FeatureCollection<any>>();
  @Output() fountainsFilteredSuccess: EventEmitter<Array<string>> = new EventEmitter<Array<string>>();
  @Output() directionsLoadedSuccess: EventEmitter<object> = new EventEmitter<object>();
  @Output() fountainHighlightedEvent: EventEmitter<Feature<any>> = new EventEmitter<Feature<any>>();
    
  // public observables used by external components
  get fountainsAll() {
    return this._fountainsAll;
  }

  get propMeta() {
    // todo: this souldn't return null if the api request is still pending
    return this._propertyMetadataCollection || this._propertyMetadataCollectionPromise;
  }

  get currentLocationInfo() {
    // todo: this souldn't return null if the api request is still pending
    return this._locationInfo[this._city];
  }
  constructor(private translate: TranslateService,
              private http: HttpClient,
              private ngRedux: NgRedux<IAppState>) {
    console.log("constuctor start "+new Date().toISOString());
    // Load metadata from server
    this._locationInfoPromise = new Promise<any>((resolve, reject)=> {
        let metadataUrl = `${this.apiUrl}api/v1/metadata/locations`;
        this.http.get(metadataUrl)
          .subscribe(
            (data: any) => {
              this._locationInfo = data;
              console.log("constuctor location info done "+new Date().toISOString());
              if (null == data) {
                console.log("data.service.js: constuctor location null "+new Date().toISOString());
              } else {
                if (null == data.gak) {
                  console.log("data.service.js: constuctor location.gak null "+new Date().toISOString());
                } else {
                  environment.gak = data.gak;
                }
              }
              resolve(data);
            },(httpResponse)=>{
              let err = 'error loading location metadata';
              console.log("constuctor: "+err +" "+new Date().toISOString());
              this.registerApiError(err, '', httpResponse, metadataUrl);
            }
          );
    });

    this._propertyMetadataCollectionPromise = new Promise<PropertyMetadataCollection>((resolve, reject)=>{
        let metadataUrl = `${this.apiUrl}api/v1/metadata/fountain_properties`;
    	console.log(metadataUrl+' '+new Date().toISOString());
    	this.http.get(metadataUrl)
    	.subscribe(
            (data: PropertyMetadataCollection) => {
                try {
                    this._propertyMetadataCollection = data;
                    console.log("constuctor fountain properties done "+new Date().toISOString());
                    resolve(data);
                } catch (err) {
                    console.trace(err+ ' '+new Date().toISOString());
                }
            }, httpResponse=>{
                // if in development mode, show a message.
                let err = 'error loading fountain properties';
                console.log("constuctor: "+err +" "+new Date().toISOString());
                this.registerApiError(err, '', httpResponse, metadataUrl);
                reject(httpResponse);
            }
    	);
    });

    // Subscribe to changes in application state
    this.userLocation.subscribe(() => {
      this.sortByProximity();
      this.filterFountains(this._filter);
    });
    this.mode.subscribe(mode => {
      if (mode === 'directions') {
        this.getDirections();
      }
    });
    this.lang$.subscribe(() => {
      if (this.ngRedux.getState().mode === 'directions') {
        this.getDirections();
      }
    });
    this.city$.subscribe(city => {
      this._city = city;
      this.loadCityData(city);
    });
    this.travelMode$.subscribe(() => {
      this.getDirections();
    });
  }

  // created for #114 display total fountains at city/location
  getTotalFountainCount(): any {
    return this._fountainsAll.features.length
  }

  getLocationBounds(city) {
      return new Promise((resolve, reject)=>{
        if(city!== null){
        const waiting = () => {
          if (this._locationInfo === null) {
            setTimeout(waiting, 200);
          } else {
            let bbox = this._locationInfo[city].bounding_box;
            resolve([[
              bbox.lngMin,
              bbox.latMin
            ], [
              bbox.lngMax,
              bbox.latMax
            ]]);
          }
        };
        waiting();
        }else{
          reject('invalid city');
        }
      });
  }

  // apiError management
  private registerApiError(error_incident, error_message='', responseData, url){
    // enhance error message if not helpful
    if(responseData.status == 0){
      error_message = 'Timeout, XHR abortion or a firewall stomped on the request. '
      console.trace('registerApiError: ' + error_message + ' ' + new Date().toISOString());
    } else {
        console.trace('registerApiError: responseData.status ' + responseData.status + ' url "'+url+'" '+error_incident+' ' + new Date().toISOString());
    }
    // make sure the url is documented
    responseData.url = url;
    responseData.timeStamp = new Date();

    this.ngRedux.dispatch({type: ADD_APP_ERROR, payload: {
      incident: error_incident,
      message: error_message,
      data: responseData
    }});
  }

  // fetch fountain property metadata or return
  fetchPropertyMetadata() {
    if (this._propertyMetadataCollection === null){
      return this._propertyMetadataCollectionPromise;
    // if data already loaded, just resolve
  } else {
    return Promise.resolve(this._propertyMetadataCollection);
  }

  }

  // fetch location metadata
  fetchLocationMetadata() {
    if (this._locationInfo === null) {
      return this._locationInfoPromise;
      // if data already loaded, just resolve
    } else {return Promise.resolve(this._locationInfo)}
  }

  // Get the initial data
  loadCityData(city, force_refresh=false) {
    if (city !== null) {
      console.log(city+" loadCityData "+new Date().toISOString())
      let fountainsUrl = `${this.apiUrl}api/v1/fountains?city=${city}&refresh=${force_refresh}`;

      // remove current fountains
      this.fountainsFilteredSuccess.emit(null);

      // get new fountains
      this.http.get(fountainsUrl)
        .subscribe(
          (data: FeatureCollection<any>) => {
            this._fountainsAll = data;
            this.fountainsLoadedSuccess.emit(this._fountainsAll);
            this.sortByProximity();
            this.filterFountains(this._filter);
            // launch reload of city processing errors
            this.loadCityProcessingErrors(city);
          }, (httpResponse)=>{
            this.registerApiError('error loading fountain data', '', httpResponse, fountainsUrl);
          }
        );
    } else {
      console.log("loadCityData: no city given "+new Date().toISOString())
    }
  }

  // Get Location processing errors for #206
  loadCityProcessingErrors(city:string) {
    if (city !== null) {
      let url = `${this.apiUrl}api/v1/processing-errors?city=${city}`;

      // get processing errors
      this.http.get(url)
        .subscribe(
          (data: DataIssue[]) => {
            this.ngRedux.dispatch({type: PROCESSING_ERRORS_LOADED, payload: data});
          }, (httpResponse) => {
            let errMsg = 'loadCityProcessingErrors: error loading fountain processing issue list';
            console.log(errMsg+" "+new Date().toISOString());
            this.registerApiError(errMsg, '', httpResponse, url);
          }
        );
    }
  }

  // Filter fountains
  // for #115 - #118 additional filtering functions
  filterFountains(filter: FilterData) {
    // copy new filter
    this._filter = filter;
    let phActive = filter.photo.active;
    let phModeWith = filter.photo.mode == 'with';
    let wpModeWith = filter.onlyNotable.mode == 'with';
    console.log("filterFountains: photo "+phActive+" "+(phActive?"'with"+(phModeWith?"'":"out'"):"")+" "+new Date().toISOString());
    // only filter if there are fountains available
    if (this._fountainsAll !== null) {
      let filterText = this.normalize(filter.text);
      // console.log("'"+filterText + "' filterFountains "+new Date().toISOString())

      let i = 1;
      this._fountainsFiltered = this._fountainsAll.features.filter(f => {
        i++;
        let fProps = f.properties;
        let name = this.normalize(`${fProps.name}_${fProps.name_en}_${fProps.name_fr}_${fProps.name_de}_${fProps.id_wikidata}_${fProps.id_operator}_${fProps.id_osm}`);
        let id = fProps.id+ " ";
        if (null == fProps.id_osm) {
          id += fProps.id_wikidata;
        } else {
          id += fProps.id_osm;
        }
        // console.log(i +" "+ id + " filterFountains "+new Date().toISOString());
        
        //TODO for efficiency check those criteria first that are most likely to get a NO

        // check text
        const text = name.indexOf(filterText) > -1;
        if (!text) {
        	return false;
        }

        // check water type
        const watTyp = !filter.waterType.active || fProps.water_type == filter.waterType.value;
        if (!watTyp) {
        	return false;
        }
        
        let hideByWP = filter.onlyNotable.active;
        if (hideByWP) {
          if (fProps.wikipedia_en_url !== null ||
                  fProps.wikipedia_de_url !== null || fProps.wikipedia_fr_url !== null) {
        	  hideByWP = filter.onlyNotable.mode == 'without';
          } else {
        	  hideByWP = filter.onlyNotable.mode == 'with';
          }
        }
        if (hideByWP) {
        	return false;
        }

        // check date
        const hasDateFilt = 
            // disregard filter if not active
            !filter.onlyOlderYoungerThan.active
            // show all if date is current date for #173
            || (filter.onlyOlderYoungerThan.date == (new Date().getFullYear() + 1) && filter.onlyOlderYoungerThan.mode == 'before')
            || (fProps.construction_date !== null
              && (filter.onlyOlderYoungerThan.mode == 'before' ?
              fProps.construction_date < filter.onlyOlderYoungerThan.date
              :fProps.construction_date > filter.onlyOlderYoungerThan.date));
        if (!hasDateFilt) {
        	return false;
        }

        // show removed fountains
        // for https://github.com/water-fountains/proximap/issues/218
        const showRemoved = 
            // if showRemoved is active, disregard filter
            filter.showRemoved ||
            (
              // if inactive, only show
              (!filter.showRemoved) &&
              (
                // if the removal date does not exist
                (fProps.removal_date === null) ||
                // or if removal_date is later than the only younger than date (if active)
                (
                  filter.onlyOlderYoungerThan.active &&
                  fProps.removal_date > filter.onlyOlderYoungerThan.date
                )
              )
            );
        if (!showRemoved) {
        	return false;
        }

        // check has swimming place
        let hideBySwimP = filter.swimmingPlace.active;
        if (hideBySwimP) {
          if (fProps.swimming_place !== null) {
        	  hideBySwimP = filter.swimmingPlace.mode == 'isNot';
          } else {
        	  hideBySwimP = filter.swimmingPlace.mode == 'is';
          }
        }
        if (hideBySwimP) {
        	return false;
        }

        // check has photo
        if (!fProps.photo) {
          if (fProps.ph && fProps.ph.pt) {
            //lazy photo url setting
            let pts = getImageUrl(fProps.ph.pt, 120, id, null);
            fProps.photo = pts.replace(/"/g, '%22'); //double quote 
          }
        }

        let dotByPhoto = !phActive;
        if (!dotByPhoto) {
          if (fProps.photo) {
            dotByPhoto = phModeWith; //filter.photo.mode == 'with';
          } else {
            dotByPhoto = !phModeWith//filter.photo.mode == 'without';
          }
        }
        if (!dotByPhoto) {
        	return false;
        }
        
        // check has curated 360 pano URL
        let hideByCuratedPano = filter.curatedPanoI228pm.active;
        if (hideByCuratedPano) {
          if ('y' == fProps.panCur) {
        	  hideByCuratedPano = filter.curatedPanoI228pm.mode == 'isNot';
          } else {
        	  hideByCuratedPano = filter.curatedPanoI228pm.mode == 'is';
          }
        }
        if (hideByCuratedPano) {
        	return false;
        }
        
        //check open data source https://github.com/water-fountains/proximap/issues/233
        if (filter.odSrcI233pm.active) {
        	if (filter.odSrcI233pm.mode == 'WikiData') {
                if (null == fProps.id_wikidata) {
                    return false;
                }
        	} else if (filter.odSrcI233pm.mode == 'OSM') {
        		if (null == fProps.id_osm) {
                    return false;
        		}
        	} else if (filter.odSrcI233pm.mode == 'both') {
        		if (null == fProps.id_osm) {
                    return false;
        		}
                if (null == fProps.id_wikidata) {
                    return false;
                }
        	} else if (filter.odSrcI233pm.mode == 'WikiData only') {
        		if (null != fProps.id_osm) {
                    return false;
        		}
        	} else if (filter.odSrcI233pm.mode == 'OSM only') {
        		if (null != fProps.id_wikidata) {
                    return false;
        		}
        	} 
        }

        // check other semiboolean criteria
        for(let p of ['potable', 'access_wheelchair', 'access_pet', 'access_bottle']){
        	const semiBool = !filter[p].active || (!filter[p].strict && fProps[p] !== 'no' || fProps[p] === 'yes');
        	if (!semiBool) {
//        		console.log(i +" "+ id + " no '+p+' "+new Date().toISOString());
        		return false;
        	}
        }
        return true;
      });
      this.fountainsFilteredSuccess.emit(this._fountainsFiltered);

      // If only one fountain is left, select it (wait a second because maybe the user is not done searching
      setTimeout(() => {
        if (this._fountainsFiltered.length === 1) {
          this.selectFountainByFeature(this._fountainsFiltered[0]);
        }
      }, 500);
    }
  }

  highlightFountain(fountain) {
    if (!environment.production) {
    	if (null == fountain) {
  	      console.log("unHighlightFountain " +new Date().toISOString());    		
    	} else {
    	      let id = getId(fountain);
    	      console.log("highlightFountain " +id + " " +new Date().toISOString());    		
    	}
    }
    this.fountainHighlightedEvent.emit(fountain);
  }

  sortByProximity() {
    let location = this.ngRedux.getState().userLocation;
    console.log("sortByProximity "+new Date().toISOString());
    if (this._fountainsAll !== null) {
      if (location !== null) {
        console.log("sortByProximity: loc "+location+" "+new Date().toISOString());
        this._fountainsAll.features.forEach(f => {
          f.properties['distanceFromUser'] = distance(f.geometry.coordinates, location, {
            format: '[lon,lat]',
            unit: 'km' // for walkers or bikers/bladers (our focus) "m" would be enough but this didn't have the desired effect (iss219)
          });
        });
        this._fountainsAll.features.sort((f1, f2) => {
          return f1.properties.distanceFromUser - f2.properties.distanceFromUser;
        });
      }else if (this._fountainsAll !== null){
        //  if no location defined, but fountains are available
        this._fountainsAll.features.sort((f1, f2) => {
          // trick to push fountains without dates to the back
          let a = f1.properties.construction_date || 3000;
          let b = f2.properties.construction_date || 3000;
          return a - b;
        });
      } else {
        console.log("sortByProximity: location == null "+new Date().toISOString());
      }
    } else {
        console.log("sortByProximity: this._fountainsAll == null "+new Date().toISOString());
    }
  }

  selectFountainByFeature(fountain: Feature<any>) {
	  try {
    let s: FountainSelector = {} as any;
    let what = null;
    const fProps = fountain.properties;
    if (fProps.id_wikidata !== null && fProps.id_wikidata !== 'null') {
      s = {
        queryType: 'byId',
        database: 'wikidata',
        idval: fProps.id_wikidata
      };
      what = "wdId-f "+fProps.id_wikidata;
    } else if (fProps.id_operator !== null && fProps.id_operator !== 'null') {
      s = {
        queryType: 'byId',
        database: 'operator',
        idval: fProps.id_operator
      };
      what = "wdId-op "+fProps.id_operator;
    } else if (fProps.id_osm !== null && fProps.id_osm !== 'null') {
      s = {
        queryType: 'byId',
        database: 'osm',
        idval: fProps.id_osm
      };
      what = "osmId "+fProps.id_osm;
    } else {
      s = {
        queryType: 'byCoords',
        lat: fountain.geometry.coordinates[1],
        lng: fountain.geometry.coordinates[0],
        radius: 50
      };
      what = "coords "+s.lat+"/"+s.lng;
    }
    if (!environment.production) {
      console.log("selectFountainByFeature: "+what+" "+this.ngRedux.getState().city+",  "+new Date().toISOString());
    }
    this.selectFountainBySelector(s);
	  } catch (err) {
		  console.trace(err);
	  }
  }

  prepGallery(imgs, dbg) {
    // console.log("prepGallery: "+new Date().toISOString()+ " "+dbg);
    if(null != imgs) {
      if (!environment.production) {
        console.log("data.services.ts prepGallery images: "+imgs.length+" "+new Date().toISOString()+ " "+dbg+" prod "+environment.production);
      }
      let i=0;
      const counterTitle=' title="See image in a new tab'; //TODO NLS  , needed because the current gallery doesn't provide it: https://github.com/lukasz-galka/ngx-gallery/issues/252
      _.forEach(imgs, img => {
        i++;
        if (!environment.production) {
          // console.log(i+" "+img.pgTit);
        }
        if (null == img.big)  {
          if (null == img.pgTit) {
            console.trace("prepGallery: null == img.pgTit "+i+". "+dbg+' '+new Date().toISOString()+ " "+dbg);
          }
          let pTit = img.pgTit.replace(/ /g, '_');
          let imgNam = sanitizeTitle(pTit).replace(/"/g, '%22'); //double quote
          let imgUrl = 'https://commons.wikimedia.org/wiki/File:'+imgNam;
          if (null == img.t || 'wm' != img.t) {
        	 imgUrl = imgNam; 
          }
          img.url=imgUrl;
          img.big = getImageUrl(img.pgTit, 1200,i+" n",img.t);
          img.medium = getImageUrl(img.pgTit, 512,i,img.t);
          img.small = getImageUrl(img.pgTit, 120,i,img.t);
          if ('flickr' == img.t) {
        	  img.big = imgUrl.replace(/_m.jpg$/, '_b.jpg');
              img.medium = imgUrl;
              img.small = imgUrl.replace(/_m.jpg$/, '_s.jpg');
              imgUrl = img.big;
          }
          // if image doesn't have a license url, just use plain text
          let license = '';
          let artist = '';
          if (null == img.metadata) {
              console.log('data.services.ts prepGallery img.metadata missing (due to datablue timeout?): '+i+'. "'+img.pgTit+'" ' +dbg+' '+new Date().toISOString()+ " "+dbg);
          } else {
             if (null != img.metadata.license_short) {
        	   license = img.metadata.license_short;
             } else {
               console.log("data.services.ts prepGallery image license_short missing: "+i+". "+img.pgTit+'' +dbg+' '+new Date().toISOString()+ " "+dbg+" prod "+environment.production);
             }
             if(img.metadata.license_url === null){
               license = license?(license+' '):"";
             }else{
               license = `<a href='${img.metadata.license_url}' target='_blank'>${img.metadata.license_short}</a>`
             }
             // if artist name is a link, then it usually isn't set to open in a
			// new page. Change that
            artist = img.metadata.artist;
            artist = artist?artist.replace('href', 'target="_blank" href'):"";
          }
          if (null == img.description) {
          	  img.description = '';
          }
          let countTit = counterTitle;
          if (null != img.c) {
        	  const cat = img.c;
              if (null != cat.n && 'wd:p18' != cat.n) {
            	  countTit += ' - (from category \''+cat.n+'\'';
                  if (null != cat.l && 20 <= cat.l) {
                	  //align the 20 with datablue:wikimedia.service.js:imgsPerCat
                	  countTit += ' - check: it may contain more than the shown '+cat.l+' images!';                	  
                  }
            	  countTit += ')';
              }
          }
          countTit +=' ; ref by \'';
          if ('wd' == img.s) {
        	  countTit +='WikiData';
          } else if ('osm' == img.s) {
        	  countTit +='OpenStreetMap';
          } else {
        	  countTit +='Unknown source';
          }
          countTit +='\'" ';
          let metaDesc = '';
          if (null != img.metadata && null != img.metadata.description) {
        	  if (140 > img.metadata.description.trim().length) { //Amazonenbrunnen is > 140 length (Q27230037)
        		  metaDesc = ' ' +img.metadata.description.trim();
        		  if (-1 == metaDesc.indexOf("target")) {
        			  metaDesc = metaDesc.replace('href', 'target="_blank" href');
        		  }
        	  } else {
        		  // rather deal with such long descriptions along with https://github.com/water-fountains/proximap/issues/285
        	  }
          }
          img.description += license+'&nbsp;'+artist+'&nbsp;<a href="'+imgUrl+'" target="_blank" '
               + countTit +' >'+i+'/'+imgs.length+'</a>'+metaDesc;
        }
      });
    }
    // return imgs;
  }

  addDefaultPanoUrls(fountain) {
	  if(fountain.pano_url.value === null){
	    fountain.pano_url.value = [
	      {url: `//instantstreetview.com/@${fountain.coords.value[1]},${fountain.coords.value[0]},0h,0p,1z`,
	      // https://github.com/water-fountains/proximap/issues/137
	      source_name: 'Google Street View' 
	    }];
	    fountain.pano_url.status = propertyStatuses.info; // PROP_STATUS_INFO;
	    fountain.pano_url.comments = 'URL for Google Street View is automatically generated from coordinates'
	  }
	}
  
  incomplete(cached: Feature, dbg: string) {
	  // proximap/issues/321
	  if (null == cached) {
          console.log('data.services.ts incomplete null == cached: ' +dbg+' '+new Date().toISOString());
		  return false;
	  }
	  const props = cached.properties;
	  if (null != props) {
		  if (null != props.wiki_commons_name && null != props.wiki_commons_name.value) {
			  let cats = props.wiki_commons_name.value;
			  let i = 0;
			  for (let cat of cats) {
				  if (0 > cat.l) {
					  console.log('data.services.ts incomplete cat '+i+' '+cat.c+'(size '+cat.l+'): ' +dbg+' '+new Date().toISOString());
					  return false;				  
				  }
				  i++;
			  }
		  }
		  if (null != props.gallery && null != props.gallery.value) {
			  let gal = props.gallery.value;
			  let i = 0;
			  for (let gv of gal) {
				  if (null == gv.metadata && 'wm' == gv.t) {
					  console.log('data.services.ts incomplete image '+i+' null == gv.metadata for '+gv.pgTit+': ' +dbg+' '+new Date().toISOString());
					  return false;				  
				  }
				  i++;
			  }
		  }
		  //validate operator into
		  //validate artist info
		  //validate wikipedia summary
	  }
	  return true;
  }

  // Select fountain
  selectFountainBySelector(selector: FountainSelector, updateDatabase: boolean = false) {
    let dataCached = false;
    // console.log("selectFountainBySelector "+new Date().toISOString());
    // only do selection if the same selection is not ongoing
    const selJSON = JSON.stringify(selector);
    try {
      if (selJSON !== JSON.stringify(this._currentFountainSelector)) {

        // Initial cached data.
        let findCached = null;

        // Find if cached data exists.
        if (this._fountainsAll) {
          for(const item of this._fountainsAll.features) {
            if (item['properties']['id_wikidata'] !== null) {
              if (item['properties']['id_wikidata'] === selector.idval) {
                findCached = item;
                break;
              }
            } else {
              if (item['properties']['id_osm'] !== null) {
                if (item['properties']['id_osm'] === selector.idval) {
                  findCached = item;
                  break;
                }
              }
            }
          }
        }
        let cached = findCached['properties']['fountain_detail'];
        // If forced reload not invoked use cached data.
        if (!updateDatabase && findCached && cached) {
          dataCached = this.incomplete(cached, selector.idval);
        }

        this._currentFountainSelector = selector;

        // From server
        // create parameter string
        let params = '';
        for (let key in selector) {
          if (selector.hasOwnProperty(key)) {
            params += `${key}=${selector[key]}&`;
          }
        }
        if (selector !== null) {
          if (environment.production) {
            console.log('selectFountainBySelector: '+params+' '+new Date().toISOString());
          }

          // If not forced reload and data cached don't call API.
          if (dataCached) {
            this.getCachedFountainDetails(cached, selector, updateDatabase);
            console.log('data.service.ts selectFountainBySelector: got fountain_detail from cache - '+selector.idval+' '+new Date().toISOString());
          } else {
              // use selector criteria to create api call
              let url = `${this.apiUrl}api/v1/fountain?${params}city=${this.ngRedux.getState().city}`;
              if (!environment.production) {
                console.log("selectFountainBySelector: "+url+" "+new Date().toISOString());
              }
            this.http.get(url)
            .subscribe((fountain: Feature<any>) => {
              try {
                if (fountain !== null) {
                  const fProps = fountain.properties;
                  const nam = fProps.name.value;
                  if (null == fProps.gallery) {
                    fProps.gallery = {};
                    if (null != fProps.featured_image_name.source) {
                      console.log('data.service.ts selectFountainBySelector: overwriting fountain.properties.featured_image_name.source "'+fProps.featured_image_name.source+'" '+new Date().toISOString());
                    }
                    fProps.featured_image_name.source = 'Google Street View';
                    fProps.gallery.comments = 'Image obtained from Google Street View Service because no other image is associated with the fountain.';
                    fProps.gallery.status = propertyStatuses.info;
                    fProps.gallery.source = 'google';
                  }
                  if (null != fProps.gallery.value && 0 < fProps.gallery.value.length) {
                    this.prepGallery(fProps.gallery.value, fProps.id_wikidata.value+' "'+nam+'"');
                  } else {
                    fProps.gallery.value = getStreetView(fountain);
                  }
                  let fGal = fProps.gallery.value;
                  this._currentFountainSelector = null;
                  this.ngRedux.dispatch({type: SELECT_FOUNTAIN_SUCCESS, payload: {fountain: fountain, selector: selector}});

                  if (updateDatabase) {
                    console.log('data.service.ts selectFountainBySelector: updateDatabase "'+nam+'" '+fProps.id_wikidata.value+' '+new Date().toISOString());
                    let fountain_simple = essenceOf(fountain, this._propertyMetadataCollection);
                    console.log('data.service.ts selectFountainBySelector: essenceOf done "'+nam+'" '+fProps.id_wikidata.value+' '+new Date().toISOString());
                    this._fountainsAll = replaceFountain(this.fountainsAll, fountain_simple);
                    console.log('data.service.ts selectFountainBySelector: replaceFountain done "'+nam+'" '+fProps.id_wikidata.value+' '+new Date().toISOString());
                    this.sortByProximity();
                    console.log('data.service.ts selectFountainBySelector: sortByProximity done "'+nam+'" '+fProps.id_wikidata.value+' '+new Date().toISOString());
                    this.filterFountains(this._filter);
                    console.log('data.service.ts selectFountainBySelector: filterFountains done "'+nam+'" '+fProps.id_wikidata.value+' '+new Date().toISOString());
                  }
                  this.addDefaultPanoUrls(fProps);

                } else {
                  this.registerApiError(
                      'error loading fountain properties',
                      'The request returned no fountains. The fountain desired might not be indexed by the server.',
                      {url: url},
                      url);
                }
              } catch (err) {
                console.trace(err);
              }
            }, (httpResponse:object)=>{
              this.registerApiError('error loading fountain properties', '', httpResponse, url);
              console.log(httpResponse)
            })
          }
        }
      }
    } catch (err) {
        console.trace('data.services.ts selectFountainBySelector: '+selJSON+'. "'+err+ ' updateDatabase '+updateDatabase+' '+new Date().toISOString());
    }
  }

  // Get fountain data from local cache.
  getCachedFountainDetails(fountainData, selectorData, checkUpdateDatabase) {
    const fountain = fountainData;
    const selector = selectorData;
    const updateDatabase = checkUpdateDatabase;
    try {
      if (fountain !== null) {
        const fProps = fountain.properties;
        const nam = fProps.name.value;
        if (null == fProps.gallery) {
          fProps.gallery = {};
          fProps.featured_image_name.source = 'Google Street View';
          fProps.gallery.comments = 'Image obtained from Google Street View Service because no other image is associated with the fountain.';
          fProps.gallery.status = propertyStatuses.info;
          fProps.gallery.source = 'google';
        }
        if (null != fProps.gallery.value && 0 < fProps.gallery.value.length) {
          this.prepGallery(fProps.gallery.value, fProps.id_wikidata.value+' "'+nam+'"');
        } else {
          fProps.gallery.value = getStreetView(fountain);
        }
        let fGal = fProps.gallery.value;
        this._currentFountainSelector = null;
        this.ngRedux.dispatch({type: SELECT_FOUNTAIN_SUCCESS, payload: {fountain: fountain, selector: selector}});

        if (updateDatabase) {
          console.log('data.service.ts selectFountainBySelector: updateDatabase "'+nam+'" '+fProps.id_wikidata.value+' '+new Date().toISOString());
          let fountain_simple = essenceOf(fountain, this._propertyMetadataCollection);
          console.log('data.service.ts selectFountainBySelector: essenceOf done "'+nam+'" '+fProps.id_wikidata.value+' '+new Date().toISOString());
          this._fountainsAll = replaceFountain(this.fountainsAll, fountain_simple);
          console.log('data.service.ts selectFountainBySelector: replaceFountain done "'+nam+'" '+fProps.id_wikidata.value+' '+new Date().toISOString());
          this.sortByProximity();
          console.log('data.service.ts selectFountainBySelector: sortByProximity done "'+nam+'" '+fProps.id_wikidata.value+' '+new Date().toISOString());
          this.filterFountains(this._filter);
          console.log('data.service.ts selectFountainBySelector: filterFountains done "'+nam+'" '+fProps.id_wikidata.value+' '+new Date().toISOString());
        }
      }
    } catch (err) {
      console.trace(err);
    }
  }

  // force Refresh of data for currently selected fountain
  forceRefresh(): any {
    console.log("forceRefresh "+new Date().toISOString());
    let coords = this.ngRedux.getState().fountainSelected.geometry.coordinates;
    let selector: FountainSelector = {
      queryType: 'byCoords',
      lat: coords[1],
      lng: coords[0],
      radius: 50
    };

    this.selectFountainBySelector(selector, true);

  }

  forceLocationRefresh():any {
    console.log("forceLocationRefresh "+new Date().toISOString());
    let city = this.ngRedux.getState().city;
    this.loadCityData(city, true);
  }

  getDirections() {
    console.log("getDirections "+new Date().toISOString());
    //  get directions for current user location, fountain, and travel profile
    let s = this.ngRedux.getState();
    if (s.fountainSelected !== null) {
      if (s.userLocation === null) {
        this.translate.get('action.navigate_tooltip')
          .subscribe(alert);
        return;
      }
      let url = `https://api.mapbox.com/directions/v5/mapbox/${s.travelMode}/${s.userLocation[0]},${s.userLocation[1]};${s.fountainSelected.geometry.coordinates[0]},${s.fountainSelected.geometry.coordinates[1]}?access_token=${environment.mapboxApiKey}&geometries=geojson&steps=true&language=${s.lang}`;


      this.http.get(url)
        .subscribe(
          (data: FeatureCollection<any>) => {
            this.ngRedux.dispatch({type: GET_DIRECTIONS_SUCCESS, payload: data});
            this.directionsLoadedSuccess.emit(data);
          });
    }

  }


  normalize(string: string) {
    if (!string) {
      return '';
    } else {
      return string.trim().toLowerCase();
    }
  }

  getNearestStations(coords:number[]):Promise<Object[]> {
    console.log("getNearestStations "+new Date().toISOString());
    //  created for #142. Fetches list of stations nearest to coordinates
    // doc of api here: https://transport.opendata.ch/docs.html
    return new Promise((resolve, reject) => {
      let url = `https://transport.opendata.ch/v1/locations?x=${coords[0]}&y=${coords[1]}&type=station`;
      this.http.get(url).subscribe(
        data => {
          resolve(data['stations']);
        },
        error => {console.log('error fetching latest data');
          reject(`error fetching data: ${error}`);}
      );
    });
  }
}

export function getStreetView(fountain){
    //was datablue google.service.js getStaticStreetView as per https://developers.google.com/maps/documentation/streetview/intro ==> need to activate static streetview api
    let GOOGLE_API_KEY=environment.gak; //process.env.GOOGLE_API_KEY // as generated in https://console.cloud.google.com/apis/credentials?project=h2olab or https://developers.google.com/maps/documentation/javascript/get-api-key
    let urlStart = '//maps.googleapis.com/maps/api/streetview?size=';
    let coords = fountain.geometry.coordinates[1]+","+fountain.geometry.coordinates[0];
    let img = { 
      big: urlStart+"1200x600&location="+coords+"&fov=120&key="+GOOGLE_API_KEY,
      medium: urlStart+"600x300&location="+coords+"&fov=120&key="+GOOGLE_API_KEY,
      small: urlStart+"120x100&location="+coords+"&fov=120&key="+GOOGLE_API_KEY,
      description: 'Google Street View and contributors',
      source_name: 'Google Street View',
      source_url: '//google.com'
    };
    let imgs = [];
    imgs.push(img);
    return(imgs);
  }

