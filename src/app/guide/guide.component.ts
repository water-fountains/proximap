import { Component, OnInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';
import {select} from '@angular-redux/store';
// import {GuideSelectorComponent} from '../guide-selector/guide-selector.component';

// @Component({
//   selector: 'app-guide',
//   styleUrls: ['./guide.component.css'],
//   template: ''
// })
// export class GuideComponent extends GuideSelectorComponent implements OnInit {
//   @select('fountainSelected') fountain;
//
//   constructor( ) { }
//
//   ngOnInit() {
//   }
//   //
//   // openGuide(guideName):void{
//   //   switch(guideName){
//   //     case 'image': this.bottomSheet.open(ImageGuideComponent);
//   //     case 'gallery': this.bottomSheet.open(GalleryGuideComponent);
//   //   }
//   //
//   // }
//
// }


@Component({
  selector: 'app-guide-selector',
  styleUrls: ['./guide-selector.component.css'],
  templateUrl: './guide-selector.component.html'
})
export class GuideSelectorComponent implements OnInit {
  @select('fountainSelected') fountain;

  constructor( private guidRef: MatBottomSheetRef<GuideSelectorComponent>,
               private bottomSheet: MatBottomSheet) { }

  ngOnInit() {

  }

  openGuide(guideName):void{
    switch(guideName){
      case 'image': {this.bottomSheet.open(ImageGuideComponent); break;}
      case 'gallery': {this.bottomSheet.open(GalleryGuideComponent); break;}
    }

  }
}


@Component({
  selector: 'app-image-guide',
  templateUrl: './image.guide.component.html',
})
export class ImageGuideComponent extends GuideSelectorComponent {}



@Component({
  selector: 'app-gallery-guide',
  templateUrl: './gallery.guide.component.html',
})
export class GalleryGuideComponent extends GuideSelectorComponent {}
