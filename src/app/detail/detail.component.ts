import {ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {CLOSE_DETAIL, NAVIGATE_TO_FOUNTAIN, CLOSE_SIDEBARS, TOGGLE_PREVIEW} from '../actions';
import {IAppState} from '../store';
import {DataService} from '../data.service';
import _ from 'lodash';
import {Feature} from 'geojson';
import {MatTableDataSource} from '@angular/material';
import {PropertyMetadata, QuickLink} from '../types';
import { GalleryItem, ImageItem} from '@ngx-gallery/core';
import {MediaMatcher} from '@angular/cdk/layout';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  title = 'This is the detail of fountain ';
  fountain;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  @select('fountainSelected') fountain$;
  @select() mode;
  @select() lang;
  @select('userLocation') userLocation$;
  @Output() closeDetails = new EventEmitter<boolean>();
  showindefinite:boolean = false;
  propertyCount:number = 0;
  filteredPropertyCount:number = 0;
  @Output() toggleGalleryPreview: EventEmitter<string> = new EventEmitter<string>();
  tableProperties:MatTableDataSource<PropertyMetadata> = new MatTableDataSource([]);
  quickLinks:QuickLink[] = [];
  images: GalleryItem[];


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
    private dataService: DataService,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 900px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

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
        this.images = _.map(f.properties.gallery.value, i=>{
          return new ImageItem({
            src: i.big,
            thumb: i.small,
            title: i.description
          });
        });
      }
    });

    this.mode.subscribe(mode => {
      if (mode == 'map'){
        this.closeDetails.emit();
      }
    });
  }


  setPreviewState(s: String) {
    console.log('sdaf');
    this.ngRedux.dispatch({type: TOGGLE_PREVIEW, payload: s})
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
