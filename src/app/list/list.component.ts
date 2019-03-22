/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import {Component, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {NgRedux, select} from '@angular-redux/store';
import {IAppState} from '../store';
import {PROP_VAL_UNDEFINED} from '../constants'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public fountains = [];
  public PROP_VAL_UNDEFINED = PROP_VAL_UNDEFINED;
  @select() lang;

  constructor(public dataService: DataService, private ngRedux: NgRedux<IAppState>) {

  }

  ngOnInit() {
    this.dataService.fountainsFilteredSuccess.subscribe(data => {
      this.fountains = data;
    });

  }

  public highlightFountain(fountain) {
    this.dataService.highlightFountain(fountain);
  }

}
