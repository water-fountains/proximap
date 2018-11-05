import {Component, Input, OnInit} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {MatBottomSheet} from '@angular/material';
import {GuideSelectorComponent} from '../guide/guide.component';
import {IAppState} from '../store';
import {SELECT_PROPERTY} from '../actions';

@Component({
  selector: 'call-to-action',
  templateUrl: './call-to-action.component.html',
  styleUrls: ['./call-to-action.component.css']
})
export class CallToActionComponent implements OnInit {
  @Input('pName') pName: string;
  @select('fountainSelected') f;

  constructor(
    private bottomSheet: MatBottomSheet,
    private ngRedux: NgRedux<IAppState>
    ) { }

  ngOnInit() {
  }
  openGuideSelector() {
    let p = this.ngRedux.getState().fountainSelected.properties[this.pName];
    this.ngRedux.dispatch({type: SELECT_PROPERTY, payload: p});
    this.bottomSheet.open(GuideSelectorComponent);
  }

}
