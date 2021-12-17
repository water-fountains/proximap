/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import '../shared/importAllExtensions';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs/index';
import { SubscriptionService } from '../core/subscription.service';
import { MapService, MapState } from '../city/map.service';
import { first, switchMap } from 'rxjs/operators';
import { FountainService } from '../fountain/fountain.service';
import { FountainSelector } from '../types';
import { LanguageService } from '../core/language.service';
import { RoutingService } from '../services/routing.service';

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
    private routeValidator: RoutingService,
    private mapService: MapService,
    private fountainService: FountainService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.subscriptionService.registerSubscriptions(
      combineLatest([this.route.paramMap, this.route.queryParamMap])
        .pipe(
          // we only want to know about the first url (i.e. the url the user entered into the addressbar)
          // and not programmatic changes to the url
          first(),
          // need to use pipe(switchMap(...)) as WEBPACK somehow messes up everything and cannot find the extension method
          switchMap(([routeParam, queryParam]) => this.routeValidator.handleUrlChange(routeParam, queryParam))
        )
        .subscribe(_ => undefined /* nothing to do as side effect (navigating) occurs in handleUrlChange */),

      // TODO @ralf.hauser - navigating to a fountain currently happens in two route changes (which is not nice IMO).
      // first it changes to https://old.water-fountains.org/ch-zh?l=de and then it changes to https://old.water-fountains.org/ch-zh?l=de&i=Q27229673
      // this is because city and fountainSelector are independent states (subscribed independently)
      // Yet, they cannot really change independently and should be consolidated in one state
      combineLatest([this.mapService.state, this.fountainService.fountainSelector]).subscribe(([state, selector]) => {
        this.navigateToNewRoute(state, selector);
      })
    );
  }

  private navigateToNewRoute(state: MapState, fountainSelector: FountainSelector | undefined): void {
    const q: Omit<QueryParams, 'loc'> = fountainSelector ? this.getQueryParamsForSelector(fountainSelector) : {};
    const queryParams: QueryParams = {
      loc: `${state.location.lat},${state.location.lng},` + (state.zoom === 'auto' ? 'auto' : `${state.zoom}z`),
      ...q,
      l: this.languageService.currentLang,
    };
    this.router.navigate([`/${state.city ? state.city : ''}`], {
      queryParams: queryParams,
    });
  }

  private getQueryParamsForSelector(fountainSelector: FountainSelector): Omit<QueryParams, 'loc'> {
    switch (fountainSelector.queryType) {
      case 'byId':
        return { i: fountainSelector.idval };
    }
  }
}

interface QueryParams {
  l?: string;
  i?: string; // url for identifiers, for #159
  loc: string;
}
