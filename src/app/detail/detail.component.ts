/*
 * @license
 * (c) Copyright 2019 - 2020 | MY-D Foundation | Created by Matthew Moy de Vitry, Ralf Hauser
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {CLOSE_DETAIL, NAVIGATE_TO_FOUNTAIN, CLOSE_SIDEBARS, TOGGLE_PREVIEW} from '../actions';
import {IAppState} from '../store';
import {DataService} from '../data.service';
import _ from 'lodash';
import {Feature} from 'geojson';
import { MatDialog, MatTableDataSource} from '@angular/material';
import {PropertyMetadata, PropertyMetadataCollection, QuickLink} from '../types';
import {NgxGalleryOptions, NgxGalleryComponent} from 'ngx-gallery';
import {ImagesGuideComponent} from '../guide/guide.component';
import {DomSanitizer} from '@angular/platform-browser';
import { galleryOptions } from './detail.gallery.options'
import {environment} from '../../environments/environment';
const consts = require('../constants');
const wm_cat_url_root = 'https://commons.wikimedia.org/wiki/Category:';


const maxCaptionPartLgth = consts.maxWikiCiteLgth; // 150; 

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})

export class DetailComponent implements OnInit {
  showImageCallToAction: boolean = true;
  fountain;
  public isMetadataLoaded: boolean = false;
  public propMeta: PropertyMetadataCollection = null;
  @select('fountainSelected') fountain$;
  @select() mode;
  @select() city$;
  @select() lang$;
  lang: string = 'de';
  @select('userLocation') userLocation$;
  @Output() closeDetails = new EventEmitter<boolean>();
  showindefinite:boolean = true;
  propertyCount:number = 0;
  filteredPropertyCount:number = 0;
  @Output() toggleGalleryPreview: EventEmitter<string> = new EventEmitter<string>();
  tableProperties:MatTableDataSource<PropertyMetadata> = new MatTableDataSource([]);
  quickLinks:QuickLink[] = [];
  galleryOptions: NgxGalleryOptions[] = galleryOptions;
  @ViewChild('gallery') galleryElement: NgxGalleryComponent;
  nearestStations = [];
  videoUrls: any = [];
  issue_api_img_url: '';
  issue_api_url: '';
  constas = consts;
  imageCaptionData: any = {
    caption: '',
    catExtract: '',
    catL: '',
    links:[],
    id: ''
  }

  closeDetailsEvent(){
    this.closeDetails.emit();
  }

  filterTable(){
    this.tableProperties.filter = this.showindefinite?'yes':'no';
  }

  public navigateToFountain(){
    this.dataService.getDirections();
  }

  public returnToMap(){
    this.ngRedux.dispatch({type: CLOSE_DETAIL});
  }

  public forceRefresh(id:string){
    console.log('refreshing '+id + ' ' + new Date().toISOString());
    this.dataService.forceRefresh();
  }

  constructor(
    private sanitizer: DomSanitizer,
    private ngRedux: NgRedux<IAppState>,
    private dataService: DataService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
	  try {
		  console.log('ngOnInit');
		  // when property metadata is loaded, change state
		  this.dataService.fetchPropertyMetadata().then((metadata)=>{
			  this.propMeta = metadata;
			  this.isMetadataLoaded = true;
		  }).catch(
                    err => {
                      console.log(`Fetch property metadata error: ${err} - ${new Date().toISOString()}`);
                    }
                  );

		  // customize filter
		  this.tableProperties.filterPredicate = function (p:PropertyMetadata, showindefinite:string) {return showindefinite === 'yes' || p.value !== null;};

		  // update fountain
		  this.fountain$.subscribe(f =>{
			  try {
				  if(f!==null){
					  this.fountain = f;
  			          // determine which properties should be displayed in table
			          const fProps = f.properties;
			          let firstImg = null;
			          let cats = null;
			          let id = null;
			          let descShortTrLc = '';
			          let nameTrLc = '';
	                  if (null != fProps) {
		                 const gal = fProps.gallery;
                         if (null != gal) {
	                       const galV = gal.value;
                           if (null != galV && 0 < galV.length) {
	                          firstImg = galV[0];
                           }
                         }
                         const catArr = fProps.wiki_commons_name;
                         if (null != catArr) {
                             cats = catArr.value;
                         }
                         if (fProps.id_wikidata !== null && fProps.id_wikidata !== 'null' && null != fProps.id_wikidata.value) {
                            id = fProps.id_wikidata.value;
                         } else if (fProps.id_osm !== null && fProps.id_osm !== 'null' && null != fProps.id_osm.value) {
                            id = fProps.id_osm.value;
                         }
                         const dscShort = fProps[`description_short_${this.lang}`];
                         if (null != dscShort && null != dscShort.value && 0 < dscShort.value.trim().length) {
                            descShortTrLc = dscShort.value.trim().toLowerCase(); 
                         }
                         const namShort = fProps[`name_${this.lang}`];
                         if (null != namShort && null != namShort.value && 0 < namShort.value.trim().length) {
                            nameTrLc = namShort.value.trim().toLowerCase(); 
                         }
                      }
					  this.onImageChange(null, firstImg, cats, id, descShortTrLc, nameTrLc);
                      let list = _.filter(_.toArray(fProps), (p)=>p.hasOwnProperty('id'));
					  this.tableProperties.data = list;
					  this.propertyCount = list.length;
					  this.filteredPropertyCount = _.filter(list, p=>p.value !== null).length;
					  this.filterTable();
					  // clear nearest public transportation stops #142
					  this.nearestStations = [];
					  // reset image call to action #136
					  this.showImageCallToAction = true;
					  // create quick links array
					  this.createQuicklinks(f);
					  // sanitize YouTube Urls
					  this.videoUrls = [];
					  if (fProps.youtube_video_id.value){
						  for(let id of fProps.youtube_video_id.value){
							  this.videoUrls.push(this.getYoutubeEmbedUrl(id))
						  }
					  } else {
  						  console.log('no videoUrls ' + new Date().toISOString());
					  }
					  // update issue api
					  let cityMetadata = this.dataService.currentLocationInfo;
					  if(cityMetadata.issue_api.operator !== null && cityMetadata.issue_api.operator === fProps.operator_name.value){
  						  console.log('cityMetadata.issue_api.operator !== null ' + new Date().toISOString());
						  this.issue_api_img_url = cityMetadata.issue_api.thumbnail_url;
						  this.issue_api_url = _.template(cityMetadata.issue_api.url_template)({
							  lat: f.geometry.coordinates[1],
							  lon: f.geometry.coordinates[0]
						  });
					  }else{
  						  console.log('setting to null: issue_api_img_url, issue_api_url ' + new Date().toISOString());
						  this.issue_api_img_url = null;
						  this.issue_api_url = null;
					  }

					  // // check if there is only one image in gallery, then hide thumbnails
					  // // does not work until
					  // https://github.com/lukasz-galka/ngx-gallery/issues/208 is fixed
					  // if(f.properties.gallery.value.length < 2){
					  // this.galleryOptions[0].thumbnailsRows = 0;
					  // this.galleryOptions[0].imagePercent = 100;
					  // this.galleryOptions[0].thumbnailsPercent = 0;
					  // }else{
					  // this.galleryOptions[0].thumbnailsRows = 1;
					  // this.galleryOptions[0].imagePercent = 80;
					  // this.galleryOptions[0].thumbnailsPercent = 20;
					  // }
				  }
			  } catch (err) {
				  console.trace('fountain update: '+err.stack);
			  }
		  }, err => {
                        console.log(`fountain update: ${err} - ${new Date().toISOString()}`);
                  });

		  this.mode.subscribe(mode => {
			  if (mode == 'map'){
				  this.closeDetails.emit();
			  }
		  });

		  this.lang$.subscribe(l =>{
			  if(l!==null){this.lang = l;}
		  });
	  } catch (err) {
		  console.trace(err);
	  }
  }

  getNearestStations(){
    // Function to request nearest public transport station data and display it. created for #142
    // only perform request if it hasn't been done yet
    if(this.nearestStations.length == 0){
      this.dataService.getNearestStations(this.fountain.geometry.coordinates)
        .then(data =>{this.nearestStations = data.slice(1, 4);}) // Omit first which has null id
        .catch(error=>{alert(error);});
    }
  }

  getYoutubeEmbedUrl(id){
    return(this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${id}`));
  }


  setPreviewState(s: String, dbg) {
    console.log('setPreviewState '+s+' '+dbg+' ' + new Date().toISOString());
    this.ngRedux.dispatch({type: TOGGLE_PREVIEW, payload: s});
  }

  openImagesGuide(){
    this.dialog.open(ImagesGuideComponent, consts.DialogConfig);
  }
  
  addCaption(wmd: any, dbg: string, descShortTrLc: string, nameTrLc: string, desc: string) {
          if (null != desc && 0 < desc.trim().length) {
                const iDesc = desc.trim();
                const idLc = iDesc.toLowerCase().trim();
                if ("water fountain"!= idLc && (''==descShortTrLc || descShortTrLc != idLc) && (''==nameTrLc || nameTrLc != idLc)) {
                   let iDsc = iDesc;
                   if (-1 == iDsc.toLowerCase().indexOf('target') && -1 != iDsc.toLowerCase().indexOf('href')) {//'target="_'  // but this could also be 'target = "_'
                      iDsc = iDsc.replace('href', 'target="_blank" href');
                   }
                   const maxCaptLgth = 300; //600
                   if (maxCaptLgth > wmd.caption.length) { //maxCaptLgth
                     if (0 < wmd.caption.length) {
                        if (-1 != wmd.caption.indexOf(iDsc)) {
                            console.log('onImageChange iDsc already contained in caption '+dbg+' ' + new Date().toISOString());
                            return false;
                        }
                        wmd.caption += '<hr />';
                     }
                     if (maxCaptionPartLgth < iDsc.length) {
                        const dropped = iDsc.substring(maxCaptionPartLgth);
                        iDsc = iDsc.substring(0,maxCaptionPartLgth)+'...';
                        console.log('onImageChange dropped from iDsc "'+dropped+'" '+dbg+' ' + new Date().toISOString());                     
                     }
                     maxCaptionPartLgth
                     wmd.caption += iDsc;
                     console.log('onImageChange added iDsc '+dbg+' ' + new Date().toISOString());                     
                     return true;
                   } else {
                     console.log('onImageChange not adding to caption > '+maxCaptLgth+' long .  '+dbg+' ' + new Date().toISOString());
                   }
                }
             }  else {
                console.log('onImageChange img '//+img
                   +' no desc '+dbg+' ' + new Date().toISOString());
             }
  }
  
  setCaption(img: any, wmd: any, dbg: string, descShortTrLc: string, nameTrLc: string) {
    //https://github.com/water-fountains/proximap/issues/285
    let imgLinkAdded = false;
    const claimFldNam = 'claim_'+this.lang;
    if (img.hasOwnProperty(claimFldNam)) {
      const claim = img[claimFldNam];
      if (null != claim) {
        imgLinkAdded = this.addCaption(wmd, dbg, descShortTrLc, nameTrLc, claim);
      }
    }
    const iMeta = img.metadata; 
    if (null != iMeta) {
             const imDesc = iMeta.description;
             const imgLinkAddedMeta = this.addCaption(wmd, dbg, descShortTrLc, nameTrLc, imDesc);
             if (imgLinkAddedMeta) {
               imgLinkAdded = true;
             }
    } else {
             wmd.caption = '';
             console.log('onImageChange firstImage '+img+' no iMeta '+dbg+' ' + new Date().toISOString());
    }
    return imgLinkAdded;
  }

  onImageChange(e: any, firstImage?: any, cats?: any, id?: string, descShortTrLc?: string, nameTrLc?: string) {
    //https://github.com/water-fountains/proximap/issues/285
    const wmd = this.imageCaptionData;
    wmd.caption ='';
    wmd.links = [];
    if (null != wmd.catExtract && '' != wmd.catExtract.trim() && null == id) {
       wmd.caption = wmd.catExtract.trim();
       if (null != wmd.catL && 0 < wmd.catL.trim().length) {
          wmd.links.push(wmd.catL);
       }
    }
    if (null != cats) {
      if (0 < cats.length) {
         for(let i = 0;i < cats.length; i++) {
            const cat = cats[i];
            if (null != cat) {
               if (null != cat.e) {
                  const extr = cat.e;
                  if (null != extr) {
                     let extTr = extr.trim();
                     const extTrLc = extTr.toLowerCase();
                     if (5 < extTr.length && (''==descShortTrLc || descShortTrLc != extTrLc) && (''==nameTrLc || nameTrLc != extTrLc)) {
                       //TODO possibly even strip whitespaces and connectors like "_" or "-" to have 'brunnen dufour' and 'BrunnenDufour' and 'brunnen-dufour' and 'brunnen_Dufour' all be considered equivalent
                        if (maxCaptionPartLgth < extTr.length) {
                           const dropped = extTr.substring(maxCaptionPartLgth);
                           extTr = extTr.substring(0,maxCaptionPartLgth)+'...';
                           console.log('onImageChange dropped from extTr "'+dropped+'" '+id+' ' + new Date().toISOString());                     
                        }
                        if (-1 == extTr.toLowerCase().indexOf('target') && -1 != extTr.toLowerCase().indexOf('href')) {//'target="_'  // but this could also be 'target = "_'
                           extTr = extTr.replace('href', 'target="_blank" href');
                        }
                        wmd.catExtract = extTr;
                        wmd.caption = extTr;
                        const catLi = wm_cat_url_root+cat.c;
                        wmd.catL = catLi;
                        wmd.links.push(catLi);
                        wmd.id = id;
                        console.log('onImageChange catExtract '+id+' ' + new Date().toISOString());
                     }
                  }
               }
            }
         }
      }
    }
    if (e !== null) {
      console.log('onImageChange '+e+' '+''+' ' + new Date().toISOString());
      if (null == e.image) {
          console.log('onImageChange null == e.image ' + new Date().toISOString());
      } else {
        const added = this.setCaption(e.image, wmd, 'e',descShortTrLc, nameTrLc);
        if (added) {
            let eiUrl = e.image.url;
            if (null != eiUrl && 0 < eiUrl.trim().length) {
              eiUrl = eiUrl.trim();
              let filePos = eiUrl.indexOf("File:");
              if (-1 != filePos) {
                 eiUrl = eiUrl.substring(filePos+5);
              }
              wmd.links.push(`https://commons.wikimedia.org/wiki/File:${eiUrl}`);
            }
        }
      }
    } else {
	    if (null != firstImage) {
          console.log('onImageChange firstImage '+firstImage+' '+''+' ' + new Date().toISOString());
          const added = this.setCaption(firstImage, wmd,'firstImage '+id, descShortTrLc, nameTrLc);
          if (added) {
             wmd.links.push(firstImage.url);
          }
      } else {
//           wmd.caption ='';
//           wmd.links = [];
	      console.log('onImageChange e and firstImage are both null ' + new Date().toISOString());
      }
    }
  }

  private createQuicklinks(f: Feature) {
//  takes a fountain and creates quick links out of a selection of properties
    let propArr = [
      {
        id: 'id_wikidata',
        url_root: 'https://www.wikidata.org/wiki/'
      },
      {
        id: 'id_osm',
        url_root: 'https://www.openstreetmap.org/'
      },
      {
        id: 'wikipedia_en_url',
        url_root: ''
      },
      {
        id: 'wikipedia_fr_url',
        url_root: ''
      },
      {
        id: 'wikipedia_de_url',
        url_root: ''
      },
      {
        id: 'wiki_commons_name',
        url_root: wm_cat_url_root
      }
    ];
    this.quickLinks = [];
    propArr.forEach(p=>{
	  const fProps = f.properties;
      if(fProps[p.id].value !== null){
	    let val = fProps[p.id].value;
        const stylClass = 'mat-menu-item ng-star-inserted';
		if ('wiki_commons_name' == p.id) {
		   const catsL = val.length;
           const maxCats = 20;
		   if (catsL > maxCats) {
			  console.log(maxCats+' is the max - but found '+catsL+' for fountain '+fProps.name.value + ' '+fProps.id_wikidata);
		   }
           for(let i = 0;i< catsL && i < maxCats;i++) {
		   	 let cat = val[i];
             if(cat.value !== null){
	            let valC = 'Category \''+cat.c;
	            let stylClHere = stylClass;
	            if (null != cat.l) {
		            if (20 <= cat.l) {
		            	//align the 20 with datablue:wikimedia.service.js:imgsPerCat
		            	valC += '\' - check: it may contain more than the shown '+cat.l+' images!';     
		            	stylClHere += ' catWithMoreImg'; 
		            } else {
			            if (cat.l > 1) {
			            	valC += '\' ('+cat.l+' imgs)';     		            	
			            } else {
		                	valC += '\'';
			            }
		            }
                } else {
                	valC += '\'';
                }
                this.quickLinks.push({
                   id: p.id,
                   title: valC,
                   value: p.url_root + cat.c,
                   styleClass: stylClHere
                });
             }
           }
		} else {
           this.quickLinks.push({
               id: p.id,
               title: val,
               value: p.url_root + val,
               styleClass:stylClass
           });
        }
      }
    });
  }

  // Created for #142 to generate href for station departures
  getStationDepartureUrl(id:number) {
    return `http://fahrplan.sbb.ch/bin/stboard.exe/dn?ld=std5.a&input=${id}&boardType=dep&time=now&selectDate=today&maxJourneys=5&productsFilter=1111111111&showAdvancedProductMode=yes&start=yes`;
  }
  // https://github.com/water-fountains/proximap/issues/137 to generate href for wikidata
  getWikiDataUrl(id:string) {
    window.open(`https://www.wikidata.org/wiki/${id}`, "_blank");
  }

  // Created for #136 March Sprint
  hideImageCallToAction() {
    this.showImageCallToAction = false;
  }
}