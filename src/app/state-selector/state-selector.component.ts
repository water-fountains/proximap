/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '../store';
import {RouteValidatorService} from '../services/route-validator.service';
import {TOGGLE_MENU} from '../actions';

@Component({
  selector: 'app-state-selector',
  templateUrl: './state-selector.component.html',
  styleUrls: ['./state-selector.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StateSelectorComponent implements OnInit {
  // Multilingual Integration Work
  public opted;

  @Input() controlVariable: string;
  @Input() options: string[];
  @Input() tooltipText: string;
  @Input() pleaseSelectKey: string = null;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private routeValidator: RouteValidatorService
  ) {

  }

  ngOnInit() {
    // apply app state to selector
    this.ngRedux.select(this.controlVariable).subscribe(l => { this.opted = l; });
  }

  changeValue() {
	    const contrVar = this.controlVariable;
    const opt = this.opted;
	    console.log("contrVar '"+contrVar+"' opt '"+opt+"' " +new Date().toISOString());
    // update route from selector. The app state will then be updated.
    this.routeValidator.validate(contrVar, opt);
    this.ngRedux.dispatch({ type: TOGGLE_MENU, payload: false });
  }


}
