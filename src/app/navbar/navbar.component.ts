/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { NgRedux, select } from '@angular-redux/store';
import { Component, OnInit } from '@angular/core';
import _ from 'lodash';
import { environment } from '../../environments/environment';
import { EDIT_FILTER_TEXT } from '../actions';
import { LayoutService } from '../core/layout.service';
import { SubscriptionService } from '../core/subscription.service';
import { DataService } from '../data.service';
import { IAppState } from '../store';
import * as sharedConstants from './../../assets/shared-constants.json';
import { LanguageService } from './../core/language.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [SubscriptionService],
})
export class NavbarComponent implements OnInit {
  @select() mode;
  publicSharedConsts = sharedConstants;
  public cities = [];
  public last_scan: Date = new Date();

  constructor(
    private dataService: DataService,
    private ngRedux: NgRedux<IAppState>,
    private subscriptionService: SubscriptionService,
    private languageService: LanguageService,
    private layoutService: LayoutService
  ) {}

  public langObservable = this.languageService.langObservable;
  public showListObservable = this.layoutService.showList;
  public showMenuObservable = this.layoutService.showMenu;

  ngOnInit(): void {
    this.dataService.fetchLocationMetadata().then(([_, cities]) => {
      this.cities = cities;
      if (!environment.production) {
        console.log(this.cities.length + ' locations added ' + new Date().toISOString());
      }
    });
    // watch for fountains to be loaded to obtain last scan time
    // for https://github.com/water-fountains/proximap/issues/188 2)
    this.subscriptionService.registerSubscriptions(
      this.dataService.fountainsLoadedSuccess.subscribe(fountains => {
        this.last_scan = _.get(fountains, ['properties', 'last_scan'], '');
      })
    );
  }

  setShowMenu(show: boolean) {
    console.log('toggleMenu ' + show + ' ' + new Date().toISOString());
    this.layoutService.setShowMenu(show);
  }

  applyTextFilter(search_text) {
    console.log('applyTextFilter ' + search_text + ' ' + new Date().toISOString());
    this.ngRedux.dispatch({ type: EDIT_FILTER_TEXT, text: search_text });
  }

  setShowList(show: boolean) {
    console.log('toggleList ' + show + ' ' + new Date().toISOString());
    this.layoutService.setShowList(show);
  }

  returnToRoot() {
    this.layoutService.closeSidebars();
  }
}
