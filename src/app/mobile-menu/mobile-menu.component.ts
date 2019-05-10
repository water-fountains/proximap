/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {versions } from '../../environments/versions';
import {DataService} from '../data.service';
import _ from 'lodash';
import {select} from '@angular-redux/store';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.css']
})
export class MobileMenuComponent implements OnInit {
  @select() device$;
  @Output() menuToggle = new EventEmitter<boolean>();
  locationOptions = [];
  versionInfo = {
    url: `https://github.com/water-fountains/proximap/commit/${versions.revision}`,
    shorthash: versions.revision,
    commit_time: new Date(versions.commit_time),
    build_time: new Date(versions.build_time),
    version: versions.version,
    branch: versions.branch
  };



  constructor(private dataService: DataService) {

  }

  toggleMenu(){
    this.menuToggle.emit(true);
  }

  ngOnInit() {
    this.dataService.fetchLocationMetadata().then((locationInfo)=>{
      // get location information
      this.locationOptions = _.keys(locationInfo);
    })
  }

}
