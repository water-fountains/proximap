/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
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
import {DialogConfig} from '../constants';


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
  videoUrls: any;


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

  public forceRefresh(){
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

    // when property metadata is loaded, change state
    this.dataService.fetchPropertyMetadata().then((metadata)=>{
      this.propMeta = metadata;
      this.isMetadataLoaded = true;
    });

    //customize filter
    this.tableProperties.filterPredicate = function (p:PropertyMetadata, showindefinite:string) {return showindefinite === 'yes' || p.value !== null;};

    // update fountain
    this.fountain$.subscribe(f =>{
      if(f!==null){
        this.fountain = f;
        // determine which properties should be displayed in table
        let list = _.filter(_.toArray(f.properties), (p)=>p.hasOwnProperty('id'));
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
        if (f.properties.youtube_video_id.value){
          for(let id of f.properties.youtube_video_id.value){
            this.videoUrls.push(this.getYoutubeEmbedUrl(id))
          }
        }
        // // check if there is only one image in gallery, then hide thumbnails
        // // does not work until https://github.com/lukasz-galka/ngx-gallery/issues/208 is fixed
        // if(f.properties.gallery.value.length < 2){
        //   this.galleryOptions[0].thumbnailsRows = 0;
        //   this.galleryOptions[0].imagePercent = 100;
        //   this.galleryOptions[0].thumbnailsPercent = 0;
        // }else{
        //   this.galleryOptions[0].thumbnailsRows = 1;
        //   this.galleryOptions[0].imagePercent = 80;
        //   this.galleryOptions[0].thumbnailsPercent = 20;
        // }
      }
    });

    this.mode.subscribe(mode => {
      if (mode == 'map'){
        this.closeDetails.emit();
      }
    });

    this.lang$.subscribe(l =>{
      if(l!==null){this.lang = l;}
    });
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


  setPreviewState(s: String) {
    console.log('sdaf');
    this.ngRedux.dispatch({type: TOGGLE_PREVIEW, payload: s});
  }

  openImagesGuide(){
    this.dialog.open(ImagesGuideComponent, DialogConfig);
  }


  private createQuicklinks(f: Feature) {
//  takes a fountain and creates quick links out of a selection of properties
    let properties = [
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
        url_root: 'https://commons.wikimedia.org/wiki/Category:'
      }
    ];
    this.quickLinks = [];
    properties.forEach(p=>{
      if(f.properties[p.id].value !== null){
        this.quickLinks.push({
          id: p.id,
          value: p.url_root + f.properties[p.id].value
      });
      }
    });
  }

  // Created for #142 to generate href for station departures
  getStationDepartureUrl(id:number) {
    return `http://fahrplan.sbb.ch/bin/stboard.exe/dn?ld=std5.a&input=${id}&boardType=dep&time=now&selectDate=today&maxJourneys=5&productsFilter=1111111111&showAdvancedProductMode=yes&start=yes`;
}

  // Created for #136 March Sprint
  hideImageCallToAction() {
    this.showImageCallToAction = false;
  }
}
