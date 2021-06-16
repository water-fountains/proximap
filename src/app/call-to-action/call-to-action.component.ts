/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */
import { NgRedux, select } from '@angular-redux/store';
import { Component, Input } from '@angular/core';
import { SELECT_PROPERTY } from '../actions';
import { DataService } from '../data.service';
import { IAppState } from '../store';
import { PropertyMetadata } from '../types';

@Component({
  selector: 'app-call-to-action',
  templateUrl: './call-to-action.component.html',
  styleUrls: ['./call-to-action.component.css'],
})
export class CallToActionComponent {
  @Input() property: PropertyMetadata;
  @select('fountainSelected') f;

  constructor(private ngRedux: NgRedux<IAppState>, private dataService: DataService) {}

  // created for #120
  viewProperty(): void {
    // let p = this.ngRedux.getState().fountainSelected.properties[this.pName];
    this.ngRedux.dispatch({ type: SELECT_PROPERTY, payload: this.property.id });
  }
}
