/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../store';
import { RouteValidatorService } from '../services/route-validator.service';
import { LayoutService } from '../core/layout.service';
import { SubscriptionService } from '../core/subscription.service';

@Component({
  selector: 'app-state-selector',
  templateUrl: './state-selector.component.html',
  styleUrls: ['./state-selector.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [SubscriptionService],
})
export class StateSelectorComponent implements OnInit {
  // Multilingual Integration Work
  public opted;
  @Input() controlVariable: string;
  @Input() options: string[];
  @Input() tooltipText: string;

  constructor(
    private subscriptionService: SubscriptionService,
    private ngRedux: NgRedux<IAppState>,
    private routeValidator: RouteValidatorService,
    private layoutService: LayoutService
  ) {}

  ngOnInit(): void {
    this.subscriptionService.registerSubscriptions(
      // apply app state to selector
      this.ngRedux.select(this.controlVariable).subscribe(l => {
        if (l !== null) {
          this.opted = l;
        }
      })
    );
  }

  changeValue() {
    const contrVar = this.controlVariable;
    const opt = this.opted;
    console.log("contrVar '" + contrVar + "' opt '" + opt + "' " + new Date().toISOString());
    // update route from selector. The app state will then be updated.
    this.routeValidator.validate(contrVar, opt);
    this.layoutService.setShowMenu(false);
  }
}
