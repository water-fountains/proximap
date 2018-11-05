import {Component, OnInit} from '@angular/core';
import {MatBottomSheet} from '@angular/material';

import {NgRedux, select} from '@angular-redux/store';
import {GalleryGuideComponent, GuideSelectorComponent, ImageGuideComponent, NameGuideComponent} from '../guide/guide.component';
import {DataService} from '../data.service';
import {SELECT_PROPERTY} from '../actions';
import {IAppState} from '../store';

@Component({
  selector: 'app-fountain-property-dialog',
  templateUrl: './fountain-property-dialog.component.html',
  styleUrls: ['./fountain-property-dialog.component.css']
})
export class FountainPropertyDialogComponent implements OnInit {
  @select('propertySelected') p;
  @select('fountainSelected') f;
  // for which properties should a guide be proposed?
  guides: string[] = ['image', 'name', 'name_en', 'name_fr', 'name_de', 'gallery', 'access_pet', 'access_bottle', 'access_wheelchair', 'construction_date', 'water_flow'];

  constructor(public dataService: DataService,
              private ngRedux: NgRedux<IAppState>,
              private bottomSheet: MatBottomSheet) {
  }

  ngOnInit() {
  }


  openGuide(): void {
    // Which guide should be opened?
    switch (this.ngRedux.getState().propertySelected.name) {
      case 'image': {
        this.bottomSheet.open(ImageGuideComponent);
        break;
      }
      case 'name':
      case 'name_en':
      case 'name_fr':
      case 'name_de':
      case 'construction_date':
      case 'water_flow':
      case 'access_pet':
      case 'access_wheelchair':
      case 'access_bottle': {
        this.bottomSheet.open(NameGuideComponent);
        break;
      }
      case 'gallery': {
        this.bottomSheet.open(GalleryGuideComponent);
        break;
      }
    }
  }

  openGuideSelector() {
    this.bottomSheet.open(GuideSelectorComponent);
  }

  closePropertyview() {
    this.ngRedux.dispatch({type: SELECT_PROPERTY, payload: null});
  }

}
