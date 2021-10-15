/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */
import { Component, Input } from '@angular/core';
import { propertyStatuses } from '../constants';
import { PropertyMetadata } from '../types';
import { DataService } from '../data.service';
import { LanguageService } from '../core/language.service';
import { SubscriptionService } from '../core/subscription.service';
import { FountainService } from '../fountain/fountain.service';
import { property } from 'lodash';
import { FountainPropertiesMeta, FountainPropertyMeta } from '../fountain_properties';

interface IconMapValue {
  id: string;
  type: string;
}
interface IconMap {
  access_wheelchair: IconMapValue;
  access_pet: IconMapValue;
  access_bottle: IconMapValue;
  potable: IconMapValue;
  construction_date: IconMapValue;
  water_type: IconMapValue;
  swimming_place: IconMapValue;
}

@Component({
  selector: 'app-property-badge',
  templateUrl: './fountain-property-badge.component.html',
  styleUrls: ['./fountain-property-badge.component.css'],
  providers: [SubscriptionService],
})
export class FountainPropertyBadgeComponent {
  @Input() property!: PropertyMetadata;
  @Input() showIfUndefined!: boolean;

  public readonly WARN = propertyStatuses.warning;
  public readonly INFO = propertyStatuses.info;
  public readonly OK = propertyStatuses.ok;
  public readonly iconMap: IconMap = {
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

  constructor(
    private dataService: DataService,
    private languageService: LanguageService,
    private fountainService: FountainService
  ) {}

  langObservable = this.languageService.langObservable;
  propertyMetadataCollection = this.dataService.propertyMetadataCollection;

  getPropMetaProperty(propMeta: FountainPropertiesMeta, propertyId: string) {
    return propMeta[propertyId as keyof FountainPropertiesMeta];
  }

  getIconMapProperty(propertyId: string) {
    return this.iconMap[propertyId as keyof IconMap];
  }

  viewProperty(): void {
    this.fountainService.selectProperty(this.property.id);
  }
}
