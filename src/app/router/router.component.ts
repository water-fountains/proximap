/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import '../shared/importAllExtensions';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, of } from 'rxjs/index';
import { SubscriptionService } from '../core/subscription.service';
import { CityService } from '../city/city.service';
import { RouteValidatorService } from '../services/route-validator.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-router',
  templateUrl: './router.component.html',
  styleUrls: ['./router.component.css'],
  providers: [SubscriptionService],
})
export class RouterComponent implements OnInit {
  constructor(
    private subscriptionService: SubscriptionService,
    private route: ActivatedRoute,
    private router: Router,
    private routeValidator: RouteValidatorService,
    private cityService: CityService
  ) {}

  ngOnInit(): void {
    this.subscriptionService.registerSubscriptions(
      combineLatest([this.route.paramMap, this.route.queryParamMap])
        // need to use pipe(switchMap(...)) as WEBPACK somehow messes up everything and cannot find the extension method
        .pipe(switchMap(([routeParam, queryParam]) => this.routeValidator.handleUrlChange(routeParam, queryParam)))
        .subscribe(_ => undefined /* nothing to do as side effect (navigating) occurs in handleUrlChange */),

      // TODO @ralf.hauser - navigating to a fountain currently happens in two route changes due to the code below (which is not nice IMO).
      // first it changes to https://old.water-fountains.org/ch-zh?l=de and then it changes to https://old.water-fountains.org/ch-zh?l=de&i=Q27229673
      // this is because city and fountainSelector are independent states.
      // Yet, they cannot really change independently and should be consolidated in one state
      this.cityService.city
        .switchMap(city => {
          if (city !== null) {
            return this.routeValidator.getShortenedQueryParams().tap(queryParams => {
              this.router.navigate([`/${city}`], {
                queryParams: queryParams,
              });
            });
          } else {
            return of(undefined);
          }
        })
        .subscribe(_ => undefined /* nothing to do as side effect occurs in tap */)
    );
  }
}
