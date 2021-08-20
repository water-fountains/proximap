/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { NgRedux, select } from '@angular-redux/store';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import _ from 'lodash';
import { Observable } from 'rxjs';
import { versions } from '../../environments/versions';
import { TOGGLE_MENU } from '../actions';
import { LanguageService } from '../core/language.service';
import { SubscriptionService } from '../core/subscription.service';
import { DataService } from '../data.service';
import { City, LocationsCollection } from '../locations';
import { IAppState } from '../store';
import * as sharedConstants from './../../assets/shared-constants.json';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.css'],
  providers: [SubscriptionService],
})
export class MobileMenuComponent implements OnInit {
  @select() device$;
  @select('city') city$: Observable<City | null>;
  @Output() menuToggle = new EventEmitter<boolean>();
  publicSharedConsts = sharedConstants;
  cities = [];
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
    private dataService: DataService,
    private ngRedux: NgRedux<IAppState>,
    private languageService: LanguageService
  ) {}

  langObservable = this.languageService.langObservable;

  toggleMenu(show: boolean): void {
    this.ngRedux.dispatch({ type: TOGGLE_MENU, payload: show });
    // this.menuToggle.emit(true);
  }

  ngOnInit(): void {
    this.dataService.fetchLocationMetadata().then(([locationsCollection, cities]) => {
      // get location information
      this.locationsCollection = locationsCollection;
      this.cities = cities;
    });

    // watch for fountains to be loaded to obtain last scan time
    // for https://github.com/water-fountains/proximap/issues/188 1)
    this.dataService.fountainsLoadedSuccess.subscribe(fountains => {
      this.last_scan = _.get(fountains, ['properties', 'last_scan'], null);
    });
  }

  refreshCurrentLocationData() {
    this.dataService.forceLocationRefresh();
  }
}
