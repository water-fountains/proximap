/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import {Component, EventEmitter, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {versions } from '../../environments/versions';
import {DataService} from '../data.service';
import _ from 'lodash';
import {NgRedux, select} from '@angular-redux/store';
import {TOGGLE_MENU} from '../actions';
import {IAppState} from '../store';
const sharedConstants = require('./../../assets/shared-constants.json');

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.css'],
})
export class MobileMenuComponent implements OnInit {
  @select() device$;
  @select('lang') lang$;
  @select('city') city$;
  @Output() menuToggle = new EventEmitter<boolean>();
  publicSharedConsts = sharedConstants;
  locationOptions = [];
  locationInfo = false;
  showMoreLocationDescription = false;
  versionInfo = {
    url: `https://github.com/water-fountains/proximap/commit/${versions.revision}`,
    shorthash: versions.revision,
    commit_time: new Date(versions.commit_time),
    build_time: new Date(versions.build_time),
    version: versions.version,
    branch: versions.branch
  };
  public last_scan:Date = new Date();



  constructor(private dataService: DataService, private ngRedux: NgRedux<IAppState>) {

  }

  toggleMenu(show) {
      this.ngRedux.dispatch({ type: TOGGLE_MENU, payload: show });
    // this.menuToggle.emit(true);
  }

  ngOnInit() {
    this.dataService.fetchLocationMetadata().then((locationInfo)=>{
      // get location information
      this.locationInfo = locationInfo;
      this.locationOptions = _.keys(locationInfo);
    });


    // watch for fountains to be loaded to obtain last scan time
    // for https://github.com/water-fountains/proximap/issues/188 1)
    this.dataService.fountainsLoadedSuccess.subscribe((fountains)=>{
      this.last_scan = _.get(fountains, ['properties', 'last_scan'], null);
    })
  }

  refreshCurrentLocationData(){
    this.dataService.forceLocationRefresh();
  }

}
