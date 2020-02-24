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
import { Observable, combineLatest } from 'rxjs/index';
import _ from 'lodash';
import { map } from 'rxjs/operators';


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

    this.route.paramMap.subscribe(paramMap => {
      // update city or fountain id from url params
        // modified to identify if a fountain ID is provided
        const cityOrId = paramMap.get('city');
        const cityCode = this.routeValidator.validate('city', cityOrId, false);
        console.log("cityCode '"+cityCode+"' cityOrId  '"+cityOrId+"' for '"+paramMap.params+"' pm/i244 " +new Date().toISOString());   

        // if the routeValidator returned null for the city code, then it might be an ID
        if ( cityCode === null) {
          // it might be a wikidata id
          this.routeValidator.validateWikidata(cityOrId)
          // if not successful, try OSM
          .catch(reason => {
            // it might be an OSM id
            this.routeValidator.validateOsm(cityOrId, 'node')
            // if not successful, try looking for OSM ways
            .catch(reason => {
              this.routeValidator.validateOsm(cityOrId, 'way')
              // if not successful, use default city
              .catch(reason => {
                this.routeValidator.validate('city', cityOrId, true);
              });
            });
          });
        }
    });

    this.route.queryParamMap.subscribe( paramMap => {
      // update state from url params
      this.routeValidator.updateFromRouteParams(paramMap);
    });

    // combineLatest([this.route.paramMap, this.route.queryParamMap])
    // .subscribe(results => {
    //   // update city or fountain id from url params
    //     // modified to identify if a fountain ID is provided
    //     const cityOrId = results[0].get('city');
    //     const cityCode = this.routeValidator.validate('city', cityOrId, false);

    //     // if the routeValidator returned null for the city code, then it might be an ID
    //     if ( cityCode === null) {
    //       // it might be a wikidata id
    //       this.routeValidator.validateWikidata(cityOrId)
    //       .then(() => {
    //         // update state from url params
    //         this.routeValidator.updateFromRouteParams(results[1]);
    //       })
    //       // if not successful, try OSM
    //       .catch(reason => {
    //         // it might be an OSM id
    //         this.routeValidator.validateOsm(cityOrId, 'node')
    //         .then(() => {
    //           // update state from url params
    //           this.routeValidator.updateFromRouteParams(results[1]);
    //         })
    //         // if not successful, try looking for OSM ways
    //         .catch(reason => {
    //           this.routeValidator.validateOsm(cityOrId, 'way')
    //           .then(() => {
    //             // update state from url params
    //             this.routeValidator.updateFromRouteParams(results[1]);
    //           })
    //           // if not successful, use default city
    //           .catch(reason => {
    //             this.routeValidator.validate('city', cityOrId, true);
    //             // update state from url params
    //             this.routeValidator.updateFromRouteParams(results[1]);
    //           });
    //         });
    //       });
    //     }
    //     // update state from url params
    //     this.routeValidator.updateFromRouteParams(results[1]);


    // });

      // Update URL to reflect state
      this.appState$.subscribe(state => {
        if (state.city) {
          this.router.navigate([`/${state.city}`], {
            queryParams: this.routeValidator.getQueryParams()
          });
        }
      });



  }
}
