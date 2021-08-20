/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */
import { Component, Input, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { SELECT_PROPERTY } from '../actions';
import { IAppState } from '../store';
import { propertyStatuses } from '../constants';
import { PropertyMetadata, PropertyMetadataCollection } from '../types';
import { DataService } from '../data.service';
import { LanguageService } from '../core/language.service';
import { SubscriptionService } from '../core/subscription.service';

@Component({
  selector: 'app-property-badge',
  templateUrl: './fountain-property-badge.component.html',
  styleUrls: ['./fountain-property-badge.component.css'],
  providers: [SubscriptionService],
})
export class FountainPropertyBadgeComponent implements OnInit {
  @Input() property: PropertyMetadata;
  @Input() showIfUndefined: boolean;
  WARN = propertyStatuses.warning;
  INFO = propertyStatuses.info;
  OK = propertyStatuses.ok;
  public iconMap = {
    access_wheelchair: {
      id: 'accessible',
      type: 'material',
    },
    access_pet: {
      id: 'pets',
      type: 'material',
    },
    access_bottle: {
      id: 'bottle',
      type: 'svg',
    },
    potable: {
      id: 'cup',
      type: 'svg',
    },
    construction_date: {
      id: '',
      type: 'none',
    },
    water_type: {
      id: '',
      type: 'none',
    },
    swimming_place: {
      id: 'swimming_place',
      type: 'svg',
    },
  };
  public propMeta: PropertyMetadataCollection;
  public isLoaded = false;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private dataService: DataService,
    private languageService: LanguageService
  ) {}

  public langObservable = this.languageService.langObservable;

  ngOnInit(): void {
    this.dataService.fetchPropertyMetadata().then(metadata => {
      this.propMeta = metadata;
      this.isLoaded = true;
    });
  }

  viewProperty(): void {
    // let p = this.ngRedux.getState().fountainSelected.properties[this.pName];
    this.ngRedux.dispatch({ type: SELECT_PROPERTY, payload: this.property.id });
  }
}
