/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { Component, OnInit } from '@angular/core';
import _ from 'lodash';
import { versions } from '../../environments/versions';
import { LanguageService } from '../core/language.service';
import { LayoutService } from '../core/layout.service';
import { SubscriptionService } from '../core/subscription.service';
import { DataService } from '../data.service';
import { City, LocationsCollection } from '../locations';
import { CityService } from '../city/city.service';
import * as sharedConstants from './../../assets/shared-constants.json';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.css'],
  providers: [SubscriptionService],
})
export class MobileMenuComponent implements OnInit {
  publicSharedConsts = sharedConstants;
  cities: City[] = [];
  locationsCollection: LocationsCollection | null = null;
  showMoreLocationDescription = false;
  versionInfo = {
    url: `https://github.com/water-fountains/proximap/commit/${versions.revision}`,
    shorthash: versions.revision,
    commit_time: new Date(versions.commit_time),
    build_time: new Date(versions.build_time),
    version: versions.version,
    branch: versions.branch,
  };
  public last_scan: Date = new Date();

  constructor(
    private subscriptionService: SubscriptionService,
    private dataService: DataService,
    private languageService: LanguageService,
    private layoutService: LayoutService,
    private citySerivce: CityService
  ) {}

  langObservable = this.languageService.langObservable;
  cityObservable = this.citySerivce.city;
  device = this.layoutService.isMobile.map(x => (x ? 'mobile' : 'desktop'));

  ngOnInit(): void {
    [this.locationsCollection, this.cities] = this.dataService.getLocationMetadata();

    this.subscriptionService.registerSubscriptions(
      // watch for fountains to be loaded to obtain last scan time
      // for https://github.com/water-fountains/proximap/issues/188 1)
      this.dataService.fountainsLoadedSuccess.subscribe(fountains => {
        this.last_scan = _.get(fountains, ['properties', 'last_scan'], null);
      })
    );
  }

  setShowMenu(show: boolean): void {
    this.layoutService.setShowMenu(show);
  }

  refreshCurrentLocationData() {
    this.dataService.forceLocationRefresh();
  }
}
