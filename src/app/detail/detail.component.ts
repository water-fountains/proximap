import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {CLOSE_DETAIL, NAVIGATE_TO_FOUNTAIN, CLOSE_SIDEBARS, TOGGLE_PREVIEW} from '../actions';
import {IAppState} from '../store';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import {DataService} from '../data.service';
import _ from 'lodash';
import {Feature} from 'geojson';
import {DEFAULT_FOUNTAINS} from '../../assets/defaultData';
import {ImageGuideComponent, GuideSelectorComponent, GalleryGuideComponent} from '../guide/guide.component';
import {MatTableDataSource} from '@angular/material';
import {PropertyMetadata, PropertyMetadataCollection, QuickLink} from '../types';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  title = 'This is the detail of fountain ';
  fountain;
  @select('fountainSelected') fountain$;
  @select() mode;
  @select() lang;
  @select('userLocation') userLocation$;
  @Output() closeDetails = new EventEmitter<boolean>();
  showindefinite:boolean = false;
  propertyCount:number = 0;
  filteredPropertyCount:number = 0;
  galleryOptions: NgxGalleryOptions[];
  @Output() toggleGalleryPreview: EventEmitter<string> = new EventEmitter<string>();
  tableProperties:MatTableDataSource<PropertyMetadata> = new MatTableDataSource([]);
  quickLinks:QuickLink[] = [];

  // deselectFountain(){
  //   this.ngRedux.dispatch({type: DESELECT_FOUNTAIN})
  // }

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
    private ngRedux: NgRedux<IAppState>,
    private dataService: DataService
  ) { }

  ngOnInit() {
    //customize filter
    this.tableProperties.filterPredicate = function (p:PropertyMetadata, showindefinite:string) {return showindefinite === 'yes' || p.value !== null;}
    this.fountain$.subscribe(f =>{
      if(f!==null){
        this.fountain = f;
        // determine which properties should be displayed in table
        let list = _.filter(_.toArray(f.properties), (p)=>p.hasOwnProperty('name'));
        this.tableProperties.data = list;
        this.propertyCount = list.length;
        this.filteredPropertyCount = _.filter(list, p=>p.value !== null).length;
        this.filterTable();
        // create quick links array
        this.createQuicklinks(f);
      }
    });

    this.mode.subscribe(mode => {
      if (mode == 'map'){
        this.closeDetails.emit();
      }
    });


    this.galleryOptions = [{
        width: '100%',
        height: '400px',
        thumbnailsColumns: 4,
        thumbnailsRows: 1,
        imageAnimation: NgxGalleryAnimation.Slide,
        imageDescription: true,
        imageSwipe: false,
        thumbnailsRemainingCount: false,
        imageArrowsAutoHide: true,
        preview: true,
        previewDownload: false,
        previewDescription: true,
        previewCloseOnEsc: true,
        thumbnailsMoveSize: 4,
        imageSize: 'cover',
        previewZoom: true,
        previewZoomStep: 0.3

      }];
  }

  setPreviewState(s: String) {
    console.log('sdaf');
    this.ngRedux.dispatch({type: TOGGLE_PREVIEW, payload: s})
  }

  private format(template, string) {

  }

  private createQuicklinks(f: Feature) {
//  takes a fountain and creates quick links out of a selection of properties
    let properties = [
      {
        name: 'id_wikidata',
        url_root: 'https://www.wikidata.org/wiki/'
      },
      {
        name: 'id_osm',
        url_root: 'https://www.openstreetmap.org/'
      },
      {
        name: 'wikipedia_en_url',
        url_root: ''
      },
      {
        name: 'wikipedia_fr_url',
        url_root: ''
      },
      {
        name: 'wikipedia_de_url',
        url_root: ''
      },
      {
        name: 'wiki_commons_name',
        url_root: 'https://commons.wikimedia.org/wiki/'
      }
    ];
    this.quickLinks = [];
    properties.forEach(p=>{
      if(f.properties[p.name].value !== null){
        this.quickLinks.push({
          name: p.name,
          value: p.url_root + f.properties[p.name].value
      })
      }
    });
  }
}
