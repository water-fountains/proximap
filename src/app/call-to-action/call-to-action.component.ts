import {Component, Input, OnInit} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {IAppState} from '../store';
import {SELECT_PROPERTY} from '../actions';
import {PropertyMetadata} from '../types';

@Component({
  selector: 'call-to-action',
  templateUrl: './call-to-action.component.html',
  styleUrls: ['./call-to-action.component.css']
})
export class CallToActionComponent implements OnInit {
  @Input('property') property: PropertyMetadata;
  @select('fountainSelected') f;

  constructor(
    private ngRedux: NgRedux<IAppState>
    ) { }

  ngOnInit() {
  }
  openGuideSelector() {
    this.ngRedux.dispatch({type: SELECT_PROPERTY, payload: this.property});
  }

}
