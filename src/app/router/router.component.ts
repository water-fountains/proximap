/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs/index';
import { SubscriptionService } from '../core/subscription.service';
import { CityService, defaultCity } from '../city/city.service';
import { RouteValidatorService } from '../services/route-validator.service';
import { getSingleStringQueryParam } from '../services/utils';

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
      //TODO @ralf.hauser this observable is in a concurrency race with this.route.queryParamMap, looks smelly
      this.route.paramMap.subscribe(paramMap => {
        // update city or fountain id from url params
        // modified to identify if a fountain ID is provided
        const cityOrId = getSingleStringQueryParam(paramMap, 'city');
        const maybeCityCode = this.routeValidator.validateCity(cityOrId);
        console.log("cityCode '" + maybeCityCode + "' cityOrId  '" + cityOrId + "' " + new Date().toISOString()); //todo show what came as parameters: https://angular.io/api/router/ParamMap  for '"+paramMap.params+"'

        // if the routeValidator returned null for the city code, then it might be an ID
        if (maybeCityCode === null) {
          // it might be a wikidata id
          this.routeValidator
            .validateWikidata(cityOrId)
            // if not successful, try OSM
            .catch(() => {
              // it might be an OSM id
              this.routeValidator
                .validateOsm(cityOrId, 'node')
                // if not successful, try looking for OSM ways
                .catch(() => {
                  this.routeValidator
                    .validateOsm(cityOrId, 'way')
                    // if not successful, use default city
                    .catch(() => defaultCity);
                });
            });
        }
      }),

      //TODO @ralf.hauser this observable is in a concurrency race with the  this.route.paramMap, looks smelly
      this.route.queryParamMap.subscribe(paramMap => {
        // update state from url params
        this.routeValidator.updateFromRouteParams(paramMap);
      }),

      this.cityService.city
        .switchMap(city => {
          if (city !== null) {
            return this.routeValidator.getQueryParams().tap(queryParams => {
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
