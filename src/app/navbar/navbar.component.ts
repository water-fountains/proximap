/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { Component, OnInit } from '@angular/core';
import _ from 'lodash';
import { environment } from '../../environments/environment';
import { LayoutService } from '../core/layout.service';
import { SubscriptionService } from '../core/subscription.service';
import { DataService } from '../data.service';
import { City } from '../locations';
import * as sharedConstants from './../../assets/shared-constants.json';
import { LanguageService } from './../core/language.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [SubscriptionService],
})
export class NavbarComponent implements OnInit {
  publicSharedConsts = sharedConstants;
  public cities: City[] = [];
  public last_scan: Date = new Date();

  constructor(
    private dataService: DataService,
    private subscriptionService: SubscriptionService,
    private languageService: LanguageService,
    private layoutService: LayoutService
  ) {}

  public langObservable = this.languageService.langObservable;
  public showListObservable = this.layoutService.showList;
  public showMenuObservable = this.layoutService.showMenu;
  public modeObservable = this.layoutService.mode;

  ngOnInit(): void {
    this.cities = this.dataService.getLocationMetadata()[1];
    if (!environment.production) {
      console.log(this.cities.length + ' locations added ' + new Date().toISOString());
    }

    // watch for fountains to be loaded to obtain last scan time
    // for https://github.com/water-fountains/proximap/issues/188 2)
    this.subscriptionService.registerSubscriptions(
      this.dataService.fountainsLoadedSuccess.subscribe(fountains => {
        this.last_scan = _.get(fountains, ['properties', 'last_scan'], '');
      })
    );
  }

  setShowMenu(show: boolean): void {
    console.log('toggleMenu ' + show + ' ' + new Date().toISOString());
    this.layoutService.setShowMenu(show);
  }

  setShowList(show: boolean): void {
    console.log('toggleList ' + show + ' ' + new Date().toISOString());
    this.layoutService.setShowList(show);
  }

  returnToRoot(): void {
    this.layoutService.closeSidebars();
  }
}
