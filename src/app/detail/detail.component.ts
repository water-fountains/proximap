import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {DESELECT_FOUNTAIN, FORCE_REFRESH, NAVIGATE_TO_FOUNTAIN, RETURN_TO_ROOT, TOGGLE_PREVIEW} from '../actions';
import {IAppState} from '../store';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import {DataService} from '../data.service';
import {Feature} from 'geojson';
import {DEFAULT_FOUNTAINS} from '../../assets/defaultData';
import {MatDialogRef} from '@angular/material';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  title = 'This is the detail of fountain ';
  @select('fountainSelected') fountain;
  @select() mode;
  @Output() closeDetails = new EventEmitter<boolean>();
  galleryOptions: NgxGalleryOptions[];
  @Output() toggleGalleryPreview: EventEmitter<string> = new EventEmitter<string>();

  // deselectFountain(){
  //   this.ngRedux.dispatch({type: DESELECT_FOUNTAIN})
  // }

  closeDetailsEvent(){
    this.closeDetails.emit();
  }


  public navigateToFountain(){
    this.ngRedux.dispatch({type: NAVIGATE_TO_FOUNTAIN});
  }

  public returnToRoot(){
    this.ngRedux.dispatch({type: RETURN_TO_ROOT});
  }

  public forceRefresh(){
    this.dataService.forceRefresh();
  }

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private dataService: DataService
    // public dialogRef: MatDialogRef<DetailComponent>
  ) { }

  ngOnInit() {
    this.mode.subscribe(mode => {
      if (mode == 'map'){
        this.closeDetails.emit();
      }
    });


    this.galleryOptions = [
      {
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

      }
    ];
  }

  setPreviewState(s: String) {
    console.log('sdaf');
    this.ngRedux.dispatch({type: TOGGLE_PREVIEW, payload: s})
  }
}
