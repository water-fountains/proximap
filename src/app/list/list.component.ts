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
import {PROP_VAL_UNDEFINED} from '../constants';
import {PropertyMetadataCollection} from '../types';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  filtered_fountain_count: number = 0;
  isLoaded: boolean = false;
  propMeta: PropertyMetadataCollection = null;
  public fountains = [];
  @select() lang$;
  lang: string = 'de';
  total_fountain_count: number = 0;

  constructor(public dataService: DataService) {

  }

  ngOnInit() {
    this.dataService.fetchPropertyMetadata().then((metadata)=>{
      this.propMeta = metadata;
      this.isLoaded = true;
    });
    this.dataService.fountainsFilteredSuccess.subscribe(data => {
      this.fountains = data;
      this.total_fountain_count = this.dataService.getTotalFountainCount();
      this.filtered_fountain_count = this.fountains.length;
    });
    this.lang$.subscribe(l=>{
      if(l !== null){
        this.lang = l;
      }
    });

  }

  public highlightFountain(fountain) {
    this.dataService.highlightFountain(fountain);
  }

}
