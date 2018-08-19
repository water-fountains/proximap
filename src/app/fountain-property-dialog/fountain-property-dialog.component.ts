import {Component, OnInit} from '@angular/core';
import { MatBottomSheet} from '@angular/material';

import {NgRedux, select} from '@angular-redux/store';
import {GuideSelectorComponent} from '../guide/guide.component';
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

  constructor(
    public dataService: DataService,
    private ngRedux: NgRedux<IAppState>,
    private bottomSheet: MatBottomSheet){}

  ngOnInit() {
  }

  openGuideSelector() {
    this.bottomSheet.open(GuideSelectorComponent);
  }

  closePropertyview() {
      this.ngRedux.dispatch({type: SELECT_PROPERTY, payload: null})
  }

}
