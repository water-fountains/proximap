/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */
import {Component, Input, OnInit} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {SELECT_PROPERTY} from '../actions';
import {IAppState} from '../store';
import {propertyStatuses} from '../constants';
import {PropertyMetadata, PropertyMetadataCollection} from '../types';
import {DataService} from '../data.service';

@Component({
  selector: 'property-badge',
  templateUrl: './fountain-property-badge.component.html',
  styleUrls: ['./fountain-property-badge.component.css']
})
export class FountainPropertyBadgeComponent implements OnInit {
  @Input('property') property: PropertyMetadata;
  @Input('showIfUndefined') showIfUndefined: boolean;
  WARN = propertyStatuses.warning;
  INFO = propertyStatuses.info;
  OK = propertyStatuses.ok;
  @select('lang') lang$;
  public iconMap = {
    access_wheelchair: {
      name: 'accessible',
      type: 'material'
    },
    access_pet: {
      name: 'pets',
      type: 'material'
    },
    access_bottle: {
      name: 'bottle',
      type: 'svg'
    },
    potable: {
      name: 'cup',
      type: 'svg'
    },
    construction_date: {
      name: '',
      type: 'none'
    },
    water_type: {
      name: '',
      type: 'none'
    },
    swimming_place: {
      name: 'swimming_place',
      type: 'svg'
    }
  };
  public propMeta: PropertyMetadataCollection;
  public isLoaded: boolean = false;
  public lang: string;

  constructor(private ngRedux: NgRedux<IAppState>,
              private dataService: DataService) {
  }

  ngOnInit() {
    this.dataService.fetchPropertyMetadata().then(metadata=>{
      this.propMeta = metadata;
      this.isLoaded = true;
    });
    this.lang$.subscribe(l=>{if(l!==null) this.lang = l})
  }

  viewProperty(): void {
    // let p = this.ngRedux.getState().fountainSelected.properties[this.pName];
    this.ngRedux.dispatch({type: SELECT_PROPERTY, payload: this.property});
  }

  getIconName(name: String) {

  }
}
