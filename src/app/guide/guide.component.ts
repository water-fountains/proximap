import { Component, OnInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';
import {NgRedux, select} from '@angular-redux/store';
import {IAppState} from '../store';


@Component({
  selector: 'app-guide-selector',
  styleUrls: ['./guide.component.css'],
  template: ''
})
export class GuideSelectorComponent implements OnInit {
  @select('fountainSelected') fountain;
  @select('propertySelected') property;
  guides: string[] = ['image', 'name', 'gallery'];

  constructor( private bottomSheetRef: MatBottomSheetRef<GuideSelectorComponent>,
               private bottomSheet: MatBottomSheet,
               private ngRedux: NgRedux<IAppState>
               ) { }

  ngOnInit() {

  }

  openGuide():void{
    switch(this.ngRedux.getState().propertySelected.name){
      case 'image': {this.bottomSheet.open(ImageGuideComponent); break;}
      case 'name': {this.bottomSheet.open(NameGuideComponent); break;}
      case 'gallery': {this.bottomSheet.open(GalleryGuideComponent); break;}
    }
  }

  closeGuide():void{
    this.bottomSheetRef.dismiss()
  }
}


@Component({
  selector: 'app-image-guide',
  styleUrls: ['./guide.component.css'],
  templateUrl: './image.guide.component.html',
})
export class ImageGuideComponent extends GuideSelectorComponent {}



@Component({
  selector: 'app-gallery-guide',
  styleUrls: ['./guide.component.css'],
  templateUrl: './gallery.guide.component.html',
})
export class GalleryGuideComponent extends GuideSelectorComponent {}

@Component({
  selector: 'app-name-guide',
  styleUrls: ['./guide.component.css'],
  templateUrl: './name.guide.component.html',
})
export class NameGuideComponent extends GuideSelectorComponent {}
