/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { Component, OnInit } from '@angular/core';
import { select } from '@angular-redux/store';
import {FilterData, PropertyMetadataCollection} from '../types';
import {DataService} from '../data.service';
import {defaultFilter, WaterTypes} from '../constants';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  isLoaded: boolean = false;
  public waterTypes = WaterTypes;
  public filter: FilterData = defaultFilter;
  @select() lang$;
  public lang: string;
  public propMeta: PropertyMetadataCollection;

  log(val) { console.log(val);}

  updateFilters() {
    // for #115 - #118 additional filtering functions
    this.dataService.filterFountains(this.filter);
  }

  constructor(private dataService: DataService
  ) {
  }

  ngOnInit() {
    this.dataService.fetchPropertyMetadata().then((metadata)=>{
      this.propMeta = metadata;
      this.isLoaded = true;
    });
    this.lang$.subscribe(l=>{
      if (l !== null){
        this.lang = l;
      }
    });
  }

}
