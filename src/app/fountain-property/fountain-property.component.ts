import {Component, Input, OnInit} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {SELECT_PROPERTY} from '../actions';
import {IAppState} from '../store';
import { propertyStatuses } from '../constants';
import {PropertyMetadata} from '../types';

@Component({
  selector: 'f-property',
  templateUrl: './fountain-property.component.html',
  styleUrls: ['./fountain-property.component.css']
})
export class FountainPropertyComponent implements OnInit {
  @Input('property') property: PropertyMetadata;
  @select('fountainSelected') f;
  WARN = propertyStatuses.warning;
  INFO = propertyStatuses.info;
  OK = propertyStatuses.ok;

  constructor(
    private ngRedux: NgRedux<IAppState>){}

  ngOnInit() {
  }

  viewProperty(): void{
      // let p = this.ngRedux.getState().fountainSelected.properties[this.pName];
    this.ngRedux.dispatch({type: SELECT_PROPERTY, payload: this.property});
  }
}
