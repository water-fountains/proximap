/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */
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
