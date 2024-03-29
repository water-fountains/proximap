/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { HttpClient, HttpErrorResponse, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import distance from 'haversine';
import _ from 'lodash';
import { combineLatest, Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import { versions as buildInfo } from '../environments/versions';
import { fountainAliases } from './fountain-aliases';
import { defaultFilter, extImgPlaceholderI333pm, propertyStatuses } from './constants';
import { LanguageService } from './core/language.service';
import { essenceOf, getId, getImageUrl, replaceFountain, sanitizeTitle } from './database.service';
// Import data from fountain_properties.ts.
import { fountainProperties, FountainPropertiesMeta } from './fountain_properties';
import { IssueService } from './issues/issue.service';
// Import data from locations.ts.
import {
  locationsCollection,
  LocationsCollection,
  City,
  cities,
  Location,
  LNG_LAT_STRING_PRECISION,
  ROUND_FACTOR,
} from './locations';
import { UserLocationService } from './map/user-location.service';
import {
  AppError,
  BoundingBox,
  DataIssue,
  FilterData,
  Fountain,
  FountainCollection,
  FountainPropertyCollection,
  FountainSelector,
  Image,
  positionToLngLat,
  // PropertyMetadataCollection,
} from './types';
import './shared/importAllExtensions';
import { Directions, DirectionsService } from './directions/directions.service';
import { LayoutService } from './core/layout.service';
import { FountainService } from './fountain/fountain.service';
import { MapService } from './city/map.service';
import { illegalState } from './shared/illegalState';
import { catchError, debounceTime } from 'rxjs/operators';

export interface TransportLocationStations {
  id: string;
  name: string;
  score: string;
  coordinate: {
    string: string;
    x: number;
    y: number;
  };
  distance: string;
}
interface TransportLocation {
  stations: TransportLocationStations[];
}

@Injectable()
export class DataService {
  @Output() fountainSelectedSuccess: EventEmitter<Fountain> = new EventEmitter();
  @Output() apiError: EventEmitter<AppError[]> = new EventEmitter();
  @Output() fountainsLoadedSuccess: EventEmitter<FountainCollection> = new EventEmitter();
  @Output() fountainsFilteredSuccess: EventEmitter<Fountain[] | undefined> = new EventEmitter();
  @Output() directionsLoadedSuccess: EventEmitter<object> = new EventEmitter();
  @Output() fountainHighlightedEvent: EventEmitter<Fountain | undefined> = new EventEmitter();

  private apiUrl = buildInfo.branch === 'stable' ? environment.apiUrlStable : environment.apiUrlBeta;
  private _currentFountainSelector: FountainSelector | undefined = undefined;
  private _fountainsAll: FountainCollection | undefined = undefined;
  private _fountainsFiltered: Fountain[] | undefined = undefined;
  private _filter: FilterData = defaultFilter;
  private _city: City | undefined = undefined;
  private _fountainPropertiesMeta: FountainPropertiesMeta = fountainProperties;
  private _locationsCollection: LocationsCollection = locationsCollection;

  constructor(
    private translateService: TranslateService,
    private languageService: LanguageService,
    private http: HttpClient,
    private issueService: IssueService,
    private userLocationService: UserLocationService,
    private directionsService: DirectionsService,
    private layoutService: LayoutService,
    private fountainService: FountainService,
    private mapService: MapService
  ) {
    console.log('constructor start ' + new Date().toISOString());

    this.userLocationService.userLocation.subscribe((_) /* ignored as we re-fetch it in sortByProximity */ => {
      this.sortByProximity();
      this.filterFountains(this._filter);
    });

    combineLatest([this.layoutService.mode, this.languageService.langObservable]).subscribe(([mode, _]) => {
      if (mode === 'directions') {
        this.getDirections();
      }
    });

    this.mapService.city.subscribe(city => {
      this._city = city;
    });

    this.mapService.boundingBox
      // TODO cancel a previous request if necessary would be better
      .pipe(debounceTime(200))
      .switchMap(boundingBox => this.loadFountains(boundingBox))
      .subscribe(_ => undefined /* nothing to do as side effect happens in loadFountains */);

    this.directionsService.travelMode.subscribe(() => {
      this.getDirections();
    });
  }

  get fountainsAll(): FountainCollection | undefined {
    return this._fountainsAll;
  }

  //TODO @ralf.hauser, it would be good if we turn PropertyMetadataCollection into a language specific PropertyMetadataCollection
  //which provides for instance a nameTranslated field which is specific for the current language including fallback:
  get propertyMetadataCollection(): Observable<FountainPropertiesMeta> {
    return of(this._fountainPropertiesMeta);
  }

  get currentLocation(): Location | null {
    return this._city ? this._locationsCollection[this._city] : null;
  }

  // created for #114 display total fountains at city/location
  getTotalFountainCount(): number {
    return this._fountainsAll?.features?.length ?? 0;
  }

  private registerApiError(
    error_incident: string,
    error_message = '',
    httpErrorResponse: HttpResponseBase,
    url: string
  ): void {
    // enhance error message if not helpful
    if (httpErrorResponse.status == 0) {
      error_message = 'Timeout, XHR abortion or a firewall stomped on the request. ';
      console.trace('registerApiError: ' + error_message + ' url "' + url + '" ' + new Date().toISOString());
    } else {
      console.trace(
        'registerApiError: responseData.status ' +
          httpErrorResponse.status +
          ' url "' +
          url +
          '" ' +
          error_incident +
          ' ' +
          new Date().toISOString()
      );
    }

    this.issueService.appendAppError({
      incident: error_incident,
      message: error_message,
      data: httpErrorResponse,
      date: new Date(),
    });
  }

  getLocationMetadata(): [LocationsCollection, City[]] {
    return [this._locationsCollection, cities];
  }

  private loadFountains(boundingBox: BoundingBox, forceRefresh = false): Observable<FountainCollection> {
    const boundsParams = this.toRequestParams(boundingBox);
    const fountainsUrl = `${this.apiUrl}api/v1/fountains?${boundsParams}&refresh=${forceRefresh}`;
    return this.http
      .get<FountainCollection>(fountainsUrl)
      .tap((data: FountainCollection) => {
        this._fountainsAll = data;
        this.fountainsLoadedSuccess.emit(this._fountainsAll);
        this.sortByProximity();
        this.filterFountains(this._filter);
        // launch reload of processing errors
        this.loadProcessingErrors(boundingBox);
      })
      .pipe(
        catchError((httpResponse: HttpErrorResponse) => {
          this.registerApiError('error loading fountain data', '', httpResponse, fountainsUrl);
          return of(FountainCollection([]));
        })
      );
  }

  private toRequestParams(boundingBox: BoundingBox) {
    const minLat = Math.floor(boundingBox.min.lat * ROUND_FACTOR) / ROUND_FACTOR;
    const minLng = Math.floor(boundingBox.min.lng * ROUND_FACTOR) / ROUND_FACTOR;
    const maxLat = Math.ceil(boundingBox.max.lat * ROUND_FACTOR) / ROUND_FACTOR;
    const maxLng = Math.ceil(boundingBox.max.lng * ROUND_FACTOR) / ROUND_FACTOR;
    return (
      `sw=${minLat.toFixed(LNG_LAT_STRING_PRECISION)},${minLng.toFixed(LNG_LAT_STRING_PRECISION)}` +
      `&ne=${maxLat.toFixed(LNG_LAT_STRING_PRECISION)},${maxLng.toFixed(LNG_LAT_STRING_PRECISION)}`
    );
  }

  // TODO @ralf.hauser change to Observable, should not fetch data in service but pass on to component
  // share in order that we don't have to re-fetch for each subscription

  // Get the initial data
  // Get Location processing errors for #206
  private loadProcessingErrors(boundingBox: BoundingBox): void {
    const boundsParams = this.toRequestParams(boundingBox);
    const url = `${this.apiUrl}api/v1/processing-errors?${boundsParams}`;

    // get processing errors
    this.http.get<DataIssue[]>(url).subscribeOnce(
      (data: DataIssue[]) => {
        this.issueService.setDataIssues(data);
      },
      (httpResponse: HttpErrorResponse) => {
        const errMsg =
          'loadProcessingErrors: error loading fountain processing issue list for' + JSON.stringify(boundingBox);
        console.log(errMsg + ' ' + new Date().toISOString());
        this.registerApiError(errMsg, '', httpResponse, url);
      }
    );
  }

  private filterFountain(
    fountain: Fountain,
    filterText: string,
    filter: FilterData,
    phActive: boolean,
    phModeWith: boolean
  ): boolean {
    {
      const fProps = fountain.properties;
      const name = this.normalize(
        `${fProps['name']}_${fProps['name_en']}_${fProps['name_fr']}_${fProps['name_de']}_${fProps['name_it']}_${fProps['name_tr']}_${fProps['description_short_en']}_${fProps['description_short_de']}_${fProps['description_short_fr']}_${fProps['description_short_it']}_${fProps['description_short_tr']}_${fProps['id_wikidata']}_${fProps['id_operator']}_${fProps['id_osm']}`
      );

      //TODO for efficiency check those criteria first that are most likely to get a NO

      // check text
      const text = name.indexOf(filterText) > -1;
      if (!text) {
        return false;
      }

      // check water type
      const watTyp = !filter.waterType.active || fProps['water_type'] == filter.waterType.value;
      if (!watTyp) {
        return false;
      }

      let hideByWP = filter.onlyNotable.active;
      if (hideByWP) {
        if (
          fProps['wikipedia_en_url'] !== null ||
          fProps['wikipedia_de_url'] !== null ||
          fProps['wikipedia_fr_url'] !== null
        ) {
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
        !filter.onlyOlderYoungerThan.active ||
        // show all if date is current date for #173
        (filter.onlyOlderYoungerThan.date == new Date().getFullYear() + 1 &&
          filter.onlyOlderYoungerThan.mode == 'before') ||
        (fProps['construction_date'] !== null &&
          (filter.onlyOlderYoungerThan.mode == 'before'
            ? fProps['construction_date'] < filter.onlyOlderYoungerThan.date
            : fProps['construction_date'] > filter.onlyOlderYoungerThan.date));
      if (!hasDateFilt) {
        return false;
      }

      // show removed fountains
      // for https://github.com/water-fountains/proximap/issues/218
      const showRemoved =
        // if showRemoved is active, disregard filter
        filter.showRemoved ||
        // if inactive, only show
        (!filter.showRemoved &&
          // if the removal date does not exist
          (fProps['removal_date'] === null ||
            // or if removal_date is later than the only younger than date (if active)
            (filter.onlyOlderYoungerThan.active && fProps['removal_date'] > filter.onlyOlderYoungerThan.date)));
      if (!showRemoved) {
        return false;
      }

      // check has swimming place
      let hideBySwimP = filter.swimmingPlace.active;
      if (hideBySwimP) {
        if (fProps['swimming_place'] !== null) {
          hideBySwimP = filter.swimmingPlace.mode == 'isNot';
        } else {
          hideBySwimP = filter.swimmingPlace.mode == 'is';
        }
      }
      if (hideBySwimP) {
        return false;
      }

      // check has photo
      if (!fProps['photo']) {
        const ph = fProps['ph'];
        if (ph?.pt) {
          //lazy photo url setting
          if (ph.t.startsWith('ext-') && 'ext-fullImgUrl' != ph.t) {
            fProps['photo'] = extImgPlaceholderI333pm + 'small.gif';
          } else {
            const pts = getImageUrl(ph.pt, 120, ph.t);
            fProps['photo'] = pts.replace(/"/g, '%22'); //double quote
          }
        }
      }

      let dotByPhoto = !phActive;
      if (!dotByPhoto) {
        if (fProps['photo']) {
          dotByPhoto = phModeWith; //filter.photo.mode == 'with';
        } else {
          dotByPhoto = !phModeWith; //filter.photo.mode == 'without';
        }
      }
      if (!dotByPhoto) {
        return false;
      }

      // check has curated 360 pano URL
      let hideByCuratedPano = filter.curatedPanoI228pm.active;
      if (hideByCuratedPano) {
        if ('y' == fProps['panCur']) {
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
          if (null == fProps['id_wikidata']) {
            return false;
          }
        } else if (filter.odSrcI233pm.mode == 'OSM') {
          if (null == fProps['id_osm']) {
            return false;
          }
        } else if (filter.odSrcI233pm.mode == 'both') {
          if (null == fProps['id_osm']) {
            return false;
          }
          if (null == fProps['id_wikidata']) {
            return false;
          }
        } else if (filter.odSrcI233pm.mode == 'WikiData only') {
          if (null != fProps['id_osm']) {
            return false;
          }
        } else if (filter.odSrcI233pm.mode == 'OSM only') {
          if (null != fProps['id_wikidata']) {
            return false;
          }
        }
      }

      // check other semi-boolean criteria
      for (const p of ['potable', 'access_wheelchair', 'access_pet', 'access_bottle'] as const) {
        const semiBool = !filter[p].active || (!filter[p].strict && fProps[p] !== 'no') || fProps[p] === 'yes';
        if (!semiBool) {
          //        		console.log(i +" "+ id + " no '+p+' "+new Date().toISOString());
          return false;
        }
      }
      return true;
    }
  }

  // Filter fountains on the {essenceOf} fields as determined by dataBlue of "./processing.service" - all fields labeled "essential" in datablue:fountain.properties.js
  // for #115 - #118 additional filtering functions
  filterFountains(filter: FilterData): void {
    // copy new filter
    this._filter = filter;
    const phActive = filter.photo.active;
    const phModeWith = filter.photo.mode == 'with';
    let filtTxtLog = '';
    const filterText = this.normalize(filter.text);
    if (null != filterText && 0 < filterText.trim().length) {
      filtTxtLog = ' searching "' + filterText + '"';
    }
    console.log(
      'filterFountains: photo ' +
        phActive +
        ' ' +
        (phActive ? "'with" + (phModeWith ? "'" : "out'") : '') +
        filtTxtLog +
        ' ' +
        new Date().toISOString()
    );
    // only filter if there are fountains available
    if (this._fountainsAll !== undefined) {
      // console.log("'"+filterText + "' filterFountains "+new Date().toISOString())
      this._fountainsFiltered = this._fountainsAll.features.filter(fountain =>
        this.filterFountain(fountain, filterText, filter, phActive, phModeWith)
      );
      try {
        if (null == this._fountainsFiltered || 0 == this._fountainsFiltered.length) {
          if (null != filterText && 0 < filterText.length) {
            let queryString = window.location.search;
            //console.log(queryString);
            queryString = filterText;
            const urlParams = new URLSearchParams(queryString);
            const qNumb = urlParams.get('i');
            if (null != qNumb && 0 < qNumb.trim().length && qNumb.trim().length < filterText.trim().length) {
              console.log('nothing found yet, so trying with "' + qNumb + '" ' + new Date().toISOString());
              this._fountainsFiltered = this._fountainsAll.features.filter(fountain =>
                this.filterFountain(fountain, qNumb.trim(), filter, phActive, phModeWith)
              );
            } else {
              const lastSlashPos = filterText.lastIndexOf('/');
              if (0 <= lastSlashPos) {
                const shortFiltText = filterText.substring(lastSlashPos + 1).trim();
                if (null != shortFiltText && 0 < shortFiltText.length) {
                  console.log('nothing found yet, so trying with "' + shortFiltText + '" ' + new Date().toISOString());
                  this._fountainsFiltered = this._fountainsAll.features.filter(fountain =>
                    this.filterFountain(fountain, shortFiltText, filter, phActive, phModeWith)
                  );
                }
              }
            }
          }
        }
      } catch (err: unknown) {
        console.log('problem "' + err + '" ' + new Date().toISOString());
      }
      this.fountainsFilteredSuccess.emit(this._fountainsFiltered);

      // If only one fountain is left, select it (wait a second because maybe the user is not done searching
      setTimeout(() => {
        const filtered = this._fountainsFiltered;
        if (filtered !== undefined && filtered.length === 1 && filtered[0] !== undefined) {
          console.log(
            'filterFountains: opening the only photo machting: ' +
              (phActive ? "'with" + (phModeWith ? "'" : "out'") : '') +
              filtTxtLog +
              ' ' +
              new Date().toISOString()
          );
          this.selectFountainByFeature(filtered[0]);
        } else if (filtered === undefined || filtered.length === 0) {
          if (null != filterText && 0 < filterText.trim().length) {
            const alias = lookupFountainAlias(filterText);
            if (null != alias && 0 < alias.trim().length) {
              console.log(
                'filterFountains: alias "' + alias + '" appears to exist ' + filtTxtLog + ' ' + new Date().toISOString()
              );
              //TODO show a pop-up to confirm to view alias fountain outside currently visible area!
            }
          }
        }
      }, 500);
    }
  }

  highlightFountain(fountain: Fountain | undefined): void {
    if (!environment.production) {
      if (fountain) {
        const id = getId(fountain);
        console.log('highlightFountain ' + id + ' ' + new Date().toISOString());
      } else {
        console.log('unHighlightFountain ' + new Date().toISOString());
      }
    }
    this.fountainHighlightedEvent.emit(fountain);
  }

  private sortByProximity(): void {
    console.log('sortByProximity ' + new Date().toISOString());
    if (this._fountainsAll !== undefined) {
      this.userLocationService.userLocation.subscribeOnce(location => {
        if (location !== undefined) {
          console.log('sortByProximity: loc ' + location + ' ' + new Date().toISOString());
          if (this._fountainsAll) {
            this._fountainsAll.features.forEach(f => {
              f.properties['distanceFromUser'] = distance(
                f.geometry.coordinates as [number, number],
                [location.lng, location.lat],
                {
                  format: '[lon,lat]',
                  unit: 'km', // for walkers or bikers/bladers (our focus) "m" would be enough but this didn't have the desired effect (iss219)
                }
              );
            });
            this._fountainsAll.features.sort((f1, f2) => {
              return f1.properties['distanceFromUser'] - f2.properties['distanceFromUser'];
            });
          }
        } else if (this._fountainsAll !== undefined) {
          //  if no location defined, but fountains are available
          this._fountainsAll.features.sort((f1, f2) => {
            // trick to push fountains without dates to the back
            const a = f1.properties['construction_date'] || 3000;
            const b = f2.properties['construction_date'] || 3000;
            return a - b;
          });
        }
      });
    } else {
      console.log('sortByProximity: this._fountainsAll == null ' + new Date().toISOString());
    }
  }

  selectFountainByFeature(fountain: Fountain): void {
    try {
      const fProps = fountain.properties;
      const database =
        fProps['id_wikidata'] && fProps['id_wikidata'] !== 'null'
          ? 'wikidata'
          : fProps['id_osm'] && fProps['id_osm'] !== 'null'
          ? 'osm'
          : illegalState('neither id_wikidata nor id_osm on properties defined', fProps);

      this.selectFountainBySelector({
        queryType: 'byId',
        database: database,
        idval: fProps['id_' + database],
        lngLat: positionToLngLat(fountain.geometry.coordinates),
      });
    } catch (err: unknown) {
      console.trace(err);
    }
  }

  private prepGallery(imgs: Image[], dbg: string): void {
    // console.log("prepGallery: "+new Date().toISOString()+ " "+dbg);
    if (null != imgs) {
      if (!environment.production) {
        console.log(
          'data.services.ts prepGallery images: ' +
            imgs.length +
            ' ' +
            new Date().toISOString() +
            ' ' +
            dbg +
            ' prod ' +
            environment.production
        );
      }
      let i = 0;
      const counterTitle = ' title="See image in a new tab'; //TODO NLS  , needed because the current gallery doesn't provide it: https://github.com/lukasz-galka/ngx-gallery/issues/252
      for (const img of imgs) {
        i++;
        if (!environment.production) {
          // console.log(i+" "+img.pgTit);
        }
        if (null == img.big) {
          if (null == img.pgTit) {
            console.trace(
              'prepGallery: null == img.pgTit ' + i + '. ' + dbg + ' ' + new Date().toISOString() + ' ' + dbg
            );
          }
          const pTit = img.pgTit.replace(/ /g, '_');
          const imgNam = sanitizeTitle(pTit); //.replace(/"/g, '%22'); //double quote commons now translates %22 into %2522
          let imgUrl = 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(imgNam); //tr photos!
          img.url = imgUrl;
          img.big = getImageUrl(img.pgTit, 1200, img.t);
          img.medium = getImageUrl(img.pgTit, 512, img.t);
          img.small = getImageUrl(img.pgTit, 120, img.t);
          if ('flickr' == img.t) {
            //test with tr-be Q68792383 or rather node/3654842352
            imgUrl = imgNam;
            img.big = imgUrl.replace(/_m.jpg$/, '_b.jpg');
            img.medium = imgUrl;
            img.small = imgUrl.replace(/_m.jpg$/, '_s.jpg');
            imgUrl = img.big;
          } else if ('ext-fullImgUrl' == img.t) {
            imgUrl = imgNam;
            img.big = imgNam;
            img.medium = imgUrl;
            img.small = imgNam;
            imgUrl = img.big;
          } else if (img.t?.startsWith('ext-')) {
            img.big = extImgPlaceholderI333pm + 'lg.gif';
            img.medium = extImgPlaceholderI333pm + 'med.gif';
            img.small = extImgPlaceholderI333pm + 'small.gif';
            if (img.t.endsWith('-flickr')) {
              imgUrl = imgNam; //e.g. 2nd image of Q27229664
            }
          }
          // if image doesn't have a license url, just use plain text
          let license = '';
          let artist = '';
          const iMeta = img.metadata;
          if (null == iMeta) {
            console.log(
              'data.services.ts prepGallery img.metadata missing (due to datablue timeout?): ' +
                i +
                '. "' +
                img.pgTit +
                '" ' +
                dbg +
                ' ' +
                new Date().toISOString() +
                ' ' +
                dbg
            );
          } else {
            if (null != iMeta.license_short) {
              license = iMeta.license_short;
            } else {
              console.log(
                'data.services.ts prepGallery image license_short missing: ' +
                  i +
                  '. ' +
                  img.pgTit +
                  '' +
                  dbg +
                  ' ' +
                  new Date().toISOString() +
                  ' ' +
                  dbg +
                  ' prod ' +
                  environment.production
              );
            }
            if (iMeta.license_url === null) {
              license = license ? license + ' ' : '';
            } else {
              let seeTxt = 'See license details';
              const licLong = iMeta.license_long;
              if (null != licLong && 0 < licLong.trim().length) {
                seeTxt += ' of "' + licLong + '"';
              }
              license = `<a href='${iMeta.license_url}' target='_blank' title='${seeTxt}'>${iMeta.license_short}</a>`;
            }
            // if artist name is a link, then it usually isn't set to open in a
            // new page. Change that
            artist = iMeta.artist;
            artist = artist ? artist.replace('href', 'target="_blank" href') : '';
          }
          if (null == img.description) {
            img.description = '';
          }
          let countTit = counterTitle;
          if (null != img.c) {
            const cat = img.c;
            if (null != cat.n && 'wd:p18' != cat.n) {
              countTit += " - (category '" + cat.n + "'";
              //TODO possibly add more from f.wiki_commons_name.fromImgs - at least upon single refresh
              if (null != cat.l && 20 <= cat.l) {
                //align the 20 with datablue:wikimedia.service.js:imgsPerCat
                countTit += ' - check: it may contain more than the shown ' + cat.l + ' images!';
              }
              countTit += ')';
            }
          }
          countTit += " ; ref by '";
          if ('wd' == img.s) {
            countTit += 'WikiData';
          } else if ('osm' == img.s) {
            countTit += 'OpenStreetMap';
          } else {
            countTit += 'Unknown source';
          }
          countTit += '\'" ';
          let metaDesc = '';
          if (null != iMeta && null != iMeta.description) {
            let maxDescLgth = 120; //Amazonenbrunnen is > 120 length (Q27230037)
            if (null != iMeta.license_short) {
              maxDescLgth -= iMeta.license_short.length;
            }
            if (maxDescLgth > iMeta.description.trim().length) {
              metaDesc = ' ' + iMeta.description.trim();
              const metaDescLc = metaDesc.toLowerCase();
              if (-1 == metaDescLc.indexOf('target')) {
                metaDesc = metaDesc.replace('href', 'target="_blank" href');
              }
            } else {
              // rather deal with such long descriptions along with https://github.com/water-fountains/proximap/issues/285
            }
          }
          let ext = '';
          if (img.t?.startsWith('ext-')) {
            ext =
              '&nbsp;<a href="https://github.com/water-fountains/proximap/issues/333" ' +
              'title="If you can help technically, please comment here!" target="_blank"' +
              '>For external GUI</a> ==>';
          }
          img.description +=
            license +
            '&nbsp;' +
            artist +
            ext +
            '&nbsp;<a href="' +
            imgUrl +
            '" target="_blank" ' +
            countTit +
            ' >' +
            i +
            '/' +
            imgs.length +
            '</a>' +
            metaDesc;
        }
      }
    }
  }

  private addDefaultPanoUrls(fountainPropertyCollection: FountainPropertyCollection<Record<string, unknown>>): void {
	const panoUrl = fountainPropertyCollection['pano_url'];
    if (panoUrl.value === null) {
    	const coords = fountainPropertyCollection['coords'];
    	const cX = coords.value[1];
    	const cY = coords.value[0];
      panoUrl.value = [
        {
          url: '//instantstreetview.com/@'+cX+','+cY+',0h,0p,1z',
          // https://github.com/water-fountains/proximap/issues/137
          source_name: 'Google Street View',
        },
      ];
      panoUrl.status = propertyStatuses.info; // PROP_STATUS_INFO;
      panoUrl.comments =
        'URL for Google Street View is automatically generated from coordinates';
    }
  }

  //TODO @ralf.hauser this method and others all have void as return type and perfom side effects such as navigate to another page
  // Better return an Observable and perform the side effect in a component rather than in the service
  selectFountainBySelector(fountainSelector: FountainSelector, forceReload = false): void {
    const selJSON = JSON.stringify(fountainSelector);

    try {
      if (forceReload || selJSON !== JSON.stringify(this._currentFountainSelector)) {
        //TODO @ralf.hauser, this looks like a side effect, tracking the state here is smelly
        this._currentFountainSelector = fountainSelector;
        const cached = this.findCachedFountain(fountainSelector);
        // If not forced reload and data cached is complete, then don't call API but use cached fountain instead
        if (!forceReload && cached && this.isCachedDataComplete(cached, fountainSelector.idval)) {
          this.switchToCachedFountainDetail(cached, fountainSelector);
          console.log(
            'data.service.ts selectFountainBySelector: got fountain_detail from cache - ' +
              fountainSelector.idval +
              ' ' +
              new Date().toISOString()
          );
        } else {
          this.switchToServerFountainDetail(fountainSelector, forceReload);
        }
      } else {
        console.log(
          'data.services.ts selectFountainBySelector: selJSON is _currentFountainSelector ' +
            selJSON +
            '. " forceReload ' +
            forceReload +
            ' ' +
            new Date().toISOString()
        );
      }
    } catch (err: unknown) {
      console.trace(
        'data.services.ts selectFountainBySelector: ' +
          selJSON +
          '. "' +
          err +
          '" forceReload ' +
          forceReload +
          ' ' +
          new Date().toISOString()
      );
    }
  }

  private findCachedFountain(fountainSelector: FountainSelector): Fountain | undefined {
    let maybeCached = undefined;
    if (this._fountainsAll) {
      maybeCached = this._fountainsAll.features.find(item => {
        if (item['properties']['id_wikidata'] !== null) {
          return item['properties']['id_wikidata'] === fountainSelector.idval;
        } else if (item['properties']['id_osm'] !== null) {
          return item['properties']['id_osm'] === fountainSelector.idval;
        } else {
          console.error('fountain found which has neither id_wikidata nor id_osm', item);
          return false;
        }
      });
    }
    return maybeCached !== undefined ? maybeCached['properties']['fountain_detail'] : undefined;
  }

  private isCachedDataComplete(cached: Fountain, dbg: string | undefined): boolean {
    const props = cached.properties;
    if (null != props) {
      if (null != props['wiki_commons_name'] && null != props['wiki_commons_name'].value) {
        const cats = props['wiki_commons_name'].value;
        let i = 0;
        for (const cat of cats) {
          if (0 > cat.l) {
            console.log(
              'data.services.ts incomplete cat ' +
                i +
                ' ' +
                cat.c +
                '(size ' +
                cat.l +
                '): ' +
                dbg +
                ' ' +
                new Date().toISOString()
            );
            return false;
          }
          i++;
        }
      }
      if (null != props['gallery'] && null != props['gallery'].value) {
        const gal = props['gallery'].value;
        let i = 0;
        for (const gv of gal) {
          if (null == gv.metadata && 'wm' == gv.t) {
            console.log(
              'data.services.ts incomplete image ' +
                i +
                ' null == gv.metadata for ' +
                gv.pgTit +
                ': ' +
                dbg +
                ' ' +
                new Date().toISOString()
            );
            return false;
          }
          i++;
        }
      }
      // props are compelete
      return true;
      // TODO @ralf.hauser the below three lines were already here. Looks like this function lacks some checks
      //validate operator into
      //validate artist info
      //validate wikipedia summary
    } else {
      return false;
    }
  }

  private switchToServerFountainDetail(fountainSelector: FountainSelector, forceReload: boolean) {
    const params =
      `queryType=${fountainSelector.queryType}` +
      `&database=${fountainSelector.database}` +
      `&idval=${fountainSelector.idval}` +
      `&loc=${fountainSelector.lngLat.lat},${fountainSelector.lngLat.lng}` +
      `&refresh=${forceReload}`;

    const url = `${this.apiUrl}api/v1/fountain?${params}`;
    if (!environment.production) {
      console.log('selectFountainBySelector: ' + url + ' ' + new Date().toISOString());
    }
    return this.http
      .get<Fountain>(url, { observe: 'response' })
      .tap(
        (response: HttpResponse<Fountain>) => {
          const fountain = response.body;
          try {
            if (fountain !== null) { // see also switchToCachedFountainDetail
              const fProps = fountain.properties;
              const nam = fProps['name'].value;
              const idWD = fProps['id_wikidata'].value;
              let fGall = fProps['gallery'];
              if (null == fGall) {
                fGall = {};
                // currently is undefined for fountain Sardona in ch-zh: https://beta.water-fountains.org/ch-zh?l=de&i=node%2F7939978548
                if (fProps['featured_image_name'] !== undefined) {
                  if (null != fProps['featured_image_name'].source) {
                    console.log(
                      'data.service.ts selectFountainBySelector: overwriting fountain.properties.featured_image_name.source "' +
                        fProps['featured_image_name'].source +
                        '" ' +
                        new Date().toISOString()
                    );
                  }
                  fProps['featured_image_name'].source = 'Google Street View';
                }
                fGall.comments =
                  'Image obtained from Google Street View Service because no other image is associated with the fountain.';
                fGall.status = propertyStatuses.info;
                fGall.source = 'google';
              }
              const dbg = idWD + ' "' + nam + '"';
              if (null != fGall.value && 0 < fGall.value.length) {
                this.prepGallery(fGall.value, dbg);
              } else {
                fGall.value = this.getStreetView(fountain, dbg);
              }
              this._currentFountainSelector = undefined;
              this.layoutService.switchToDetail(fountain, fountainSelector);

              if (forceReload) {
                console.log(
                  'data.service.ts selectFountainBySelector: forceReload "' +
                    nam +
                    '" ' +
                    idWD +
                    ' ' +
                    new Date().toISOString()
                );
                const fountain_simple = essenceOf(fountain, this._fountainPropertiesMeta);
                console.log(
                  'data.service.ts selectFountainBySelector: essenceOf done "' +
                    nam +
                    '" ' +
                    idWD +
                    ' ' +
                    new Date().toISOString()
                );
                if (this.fountainsAll) this._fountainsAll = replaceFountain(this.fountainsAll, fountain_simple);
                console.log(
                  'data.service.ts selectFountainBySelector: replaceFountain done "' +
                    nam +
                    '" ' +
                    idWD +
                    ' ' +
                    new Date().toISOString()
                );
                this.sortByProximity();
                console.log(
                  'data.service.ts selectFountainBySelector: sortByProximity done "' +
                    nam +
                    '" ' +
                    idWD +
                    ' ' +
                    new Date().toISOString()
                );
                this.filterFountains(this._filter);
                console.log(
                  'data.service.ts selectFountainBySelector: filterFountains done "' +
                    nam +
                    '" ' +
                    idWD +
                    ' ' +
                    new Date().toISOString()
                );
              }
              this.addDefaultPanoUrls(fProps);
            } else {
              this.registerApiError(
                'error loading fountain properties',
                'The request returned no fountains. The fountain desired might not be indexed by the server.',
                response,
                url
              );
            }
          } catch (err: unknown) {
            console.trace(err);
          }
        },
        (httpResponse: HttpErrorResponse) => {
          this.registerApiError('error loading fountain properties', '', httpResponse, url);
          console.log(httpResponse);
        }
      )
      .subscribeOnce(_ => undefined /* nothing to do, side effect happens in tap*/);
  }

  // Get fountain data from local cache.
  private switchToCachedFountainDetail(fountainData: Fountain, selectorData: FountainSelector): void {
    const fountain = fountainData;
    const selector = selectorData;
    try { //TODO this code mostly a duplicate of switchToServerFountainDetail
      const fProps = fountain.properties;
      const nam = fProps['name'].value;
      let fGall = fProps['gallery'];
      const idWD = fProps['id_wikidata'].value;
      if (null == fGall) {
        fGall = {};
        // happend with Sardona in ch-zh after a bug which probably caused that gallery was not null but featured_image_name was undefined
        // Thus it makes sense to check first and create a dummy object if necessary to prevent bugs
        if (fProps['featured_image_name'] === undefined) {
          fProps['featured_image_name'] = {};
        }
        fProps['featured_image_name'].source = 'Google Street View';
        fGall.comments =
          'Image obtained from Google Street View Service because no other image is associated with the fountain.';
        fGall.status = propertyStatuses.info;
        fGall.source = 'google';
      }
      const dbg = idWD + ' "' + nam + '"';
      if (null != fGall.value && 0 < fGall.value.length) {
        this.prepGallery(fGall.value, dbg);
      } else {
        fGall.value = this.getStreetView(fountain, dbg);
      }
      this._currentFountainSelector = undefined;
      this.layoutService.switchToDetail(fountain, selector);

      console.log(
        'data.service.ts selectFountainBySelector: updateDatabase "' +
          nam +
          '" ' +
          idWD +
          ' ' +
          new Date().toISOString()
      );
      if (this._fountainPropertiesMeta) {
        const fountain_simple = essenceOf(fountain, this._fountainPropertiesMeta);
        console.log(
          'data.service.ts selectFountainBySelector: essenceOf done "' +
            nam +
            '" ' +
            idWD +
            ' ' +
            new Date().toISOString()
        );
        if (this.fountainsAll) this._fountainsAll = replaceFountain(this.fountainsAll, fountain_simple);
        console.log(
          'data.service.ts selectFountainBySelector: replaceFountain done "' +
            nam +
            '" ' +
            idWD +
            ' ' +
            new Date().toISOString()
        );
      }
      this.sortByProximity();
      console.log(
        'data.service.ts selectFountainBySelector: sortByProximity done "' +
          nam +
          '" ' +
          idWD +
          ' ' +
          new Date().toISOString()
      );
      this.filterFountains(this._filter);
      console.log(
        'data.service.ts selectFountainBySelector: filterFountains done "' +
          nam +
          '" ' +
          idWD +
          ' ' +
          new Date().toISOString()
      );
    } catch (err: unknown) {
      console.trace(err);
    }
  }

  // force Refresh of data for currently selected fountain
  forceRefreshForCurrentFountain(): void {
    this.fountainService.fountainSelector.subscribeOnce(currentFountainSelector => {
      if (currentFountainSelector !== undefined) {
        this.selectFountainBySelector(currentFountainSelector, /* forceReload= */ true);
      }
    });
  }

  forceLocationRefresh(): void {
    console.log('forceLocationRefresh ' + new Date().toISOString());
    this.mapService.boundingBox.subscribeOnce(boundingBox =>
      this.loadFountains(boundingBox, /* forceRefresh = */ true)
    );
  }

  getDirections(): void {
    console.log('getDirections ' + new Date().toISOString());
    //  get directions for current user location, fountain, and travel profile

    this.fountainService.fountain
      .switchMap(fountain => {
        if (fountain !== undefined) {
          return combineLatest([
            this.userLocationService.userLocation,
            this.languageService.langObservable,
            this.directionsService.travelMode,
          ]).switchMap(([userLocation, lang, travelMode]) => {
            if (userLocation === undefined) {
              return this.translateService.get('action.navigate_tooltip').tap(alert);
            } else {
              const url = `https://api.mapbox.com/directions/v5/mapbox/${travelMode}/${userLocation.lng},${userLocation.lat};${fountain.geometry.coordinates[0]},${fountain.geometry.coordinates[1]}?access_token=${environment.mapboxApiKey}&geometries=geojson&steps=true&language=${lang}`;

              return this.http.get<Directions>(url).tap((data: Directions) => {
                this.layoutService.setDirections(data);
                this.directionsLoadedSuccess.emit(data);
              });
            }
          });
        } else {
          return of(undefined);
        }
      })
      .subscribeOnce(
        _ =>
          //nothing to do as we have side effects with `tap`
          undefined
      );
  }

  private normalize(string: string): string {
    if (!string) {
      return '';
    } else {
      return string.trim().toLowerCase();
    }
  }

  getNearestStations(coords: number[]): Promise<TransportLocationStations[]> {
    console.log('getNearestStations ' + new Date().toISOString());
    //  created for #142. Fetches list of stations nearest to coordinates
    // doc of api here: https://transport.opendata.ch/docs.html
    return new Promise((resolve, reject) => {
      const url = `https://transport.opendata.ch/v1/locations?x=${coords[0]}&y=${coords[1]}&type=station`;
      this.http.get<TransportLocation>(url).subscribe(
        (data: TransportLocation) => {
          resolve(data.stations);
        },
        error => {
          console.log('error fetching latest data');
          reject(`error fetching data: ${error}`);
        }
      );
    });
  }

  private getStreetView(fountain: Fountain, dbg: string): Image[] {
	  // https://github.com/water-fountains/proximap/issues/510
    //was datablue google.service.js getStaticStreetView as per https://developers.google.com/maps/documentation/streetview/intro ==> need to activate static streetview api
    const GOOGLE_API_KEY = environment.gak; //process.env.GOOGLE_API_KEY // as generated in https://console.cloud.google.com/apis/credentials?project=h2olab or https://developers.google.com/maps/documentation/javascript/get-api-key
    const urlStart = '//maps.googleapis.com/maps/api/streetview?size=';
    const coords = fountain.geometry.coordinates[1] + ',' + fountain.geometry.coordinates[0];
    const img = {
      big: urlStart + '1200x600&location=' + coords + '&fov=120&key=' + GOOGLE_API_KEY,
      medium: urlStart + '600x300&location=' + coords + '&fov=120&key=' + GOOGLE_API_KEY,
      small: urlStart + '120x100&location=' + coords + '&fov=120&key=' + GOOGLE_API_KEY,
      description: 'Google Street View and contributors',
      source_name: 'Google Street View',
      source_url: '//google.com',
    } as any as Image;
    console.log(
            'data.service.ts no curated image found ==> getStreetView "' +
              dbg +
              '"' +
              ' ' +
              new Date().toISOString()
          );

    const imgs = [];
    imgs.push(img);
    return imgs;
  }
}

export function lookupFountainAlias(alias: string): string | undefined {
  const aliasLowerCase = alias.toLowerCase();
  const aliasData = fountainAliases.find(x => x.alias.toLocaleLowerCase() === aliasLowerCase);
  if (aliasData !== undefined) {
    console.log("found alias '" + aliasData.replace_alias + "' for '" + alias + "' db/i43 " + new Date().toISOString());
    return aliasData.replace_alias;
  } else {
    return undefined;
  }
}
