import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {CLOSE_DETAIL, NAVIGATE_TO_FOUNTAIN, CLOSE_SIDEBARS, TOGGLE_PREVIEW} from '../actions';
import {IAppState} from '../store';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import {DataService} from '../data.service';
import {Feature} from 'geojson';
import {DEFAULT_FOUNTAINS} from '../../assets/defaultData';
import {ImageGuideComponent, GuideSelectorComponent, GalleryGuideComponent} from '../guide/guide.component';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  title = 'This is the detail of fountain ';
  @select('fountainSelected') fountain;
  @select() mode;
  @select() lang;
  @select('userLocation') userLocation$;
  @Output() closeDetails = new EventEmitter<boolean>();
  galleryOptions: NgxGalleryOptions[];
  @Output() toggleGalleryPreview: EventEmitter<string> = new EventEmitter<string>();
  tableProperties = [
    "name",
    "name_de",
    "name_en",
    "name_fr",
    "construction_date",
    "coords",
    "description_short_en",
    "description_short_de",
    "directions",
    "access_wheelchair",
    "access_bottle",
    "access_pet",
    "potable",
    "water_flow",
    "water_type",
    "operator_name",
    "id_operator",
    "id_osm",
    "id_wikidata",
    "wiki_commons_name",
    "wikipedia_de_url",
    "wikipedia_en_url",
    "wikipedia_de_summary",
    "wikipedia_en_summary"
  ];

  // deselectFountain(){
  //   this.ngRedux.dispatch({type: DESELECT_FOUNTAIN})
  // }

  closeDetailsEvent(){
    this.closeDetails.emit();
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
}
