import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {DESELECT_FOUNTAIN, NAVIGATE_TO_FOUNTAIN, RETURN_TO_ROOT} from '../actions';
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
  galleryImages: NgxGalleryImage[];

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

  constructor(
    private ngRedux: NgRedux<IAppState>,
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
        imageSwipe: true,
        thumbnailsRemainingCount: false,
        imageArrowsAutoHide: true,
        preview: false,
        previewDownload: false,
        previewDescription: true,
        previewCloseOnEsc: true,
        thumbnailsMoveSize: 4,
        imageSize: 'contain'
      }
    ];
  }

}
