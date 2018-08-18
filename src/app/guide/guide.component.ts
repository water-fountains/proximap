import { Component, OnInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';
import {select} from '@angular-redux/store';


@Component({
  selector: 'app-guide-selector',
  styleUrls: ['./guide.component.css'],
  templateUrl: './guide-selector.component.html'
})
export class GuideSelectorComponent implements OnInit {
  @select('fountainSelected') fountain;

  constructor( private bottomSheetRef: MatBottomSheetRef<GuideSelectorComponent>,
               private bottomSheet: MatBottomSheet) { }

  ngOnInit() {

  }

  openGuide(guideName):void{
    switch(guideName){
      case 'image': {this.bottomSheet.open(ImageGuideComponent); break;}
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
