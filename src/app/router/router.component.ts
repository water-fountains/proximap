/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { Component, OnInit } from '@angular/core';
import { select } from "@angular-redux/store/lib/src";
import {ActivatedRoute, Router} from '@angular/router';
import { RouteValidatorService } from '../services/route-validator.service';
import { IAppState} from '../store';
import {Observable} from 'rxjs/index';
import _ from 'lodash';


@Component({
  selector: 'app-router',
  templateUrl: './router.component.html',
  styleUrls: ['./router.component.css']
})
export class RouterComponent implements OnInit {
  @select((s: IAppState) => s) appState$:Observable<IAppState>;
  @select('fountainSelected') fountainSelected$;

  constructor(
    private route:ActivatedRoute,
    private router:Router,
  private routeValidator: RouteValidatorService
  ) { }

  ngOnInit() {
    this.route.paramMap
      .subscribe(params => {
        // update city from url params
        let city = params.get('city');
        this.routeValidator.validate('city', city);
      });

    this.route.queryParamMap
      .subscribe(paramsMap => {
        // update state from url params
        this.routeValidator.updateFromRouteParams(paramsMap);
      });

    // Update URL to reflect state
    this.appState$.subscribe(state =>{
      this.router.navigate([`/${state.city}`], {
        queryParams: this.routeValidator.getQueryParams()
      })
    });

    // watch for fountain selection to validate mode
    // this.fountainSelected$.subscribe((f)=>{
    //   if(f !== null){
    //     this.routeValidator.validate('mode', this._mode)
    //   }
    // })
  }
}
