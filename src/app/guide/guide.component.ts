/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../data.service';
import { DialogConfig } from '../constants';

import _ from 'lodash';
import { Lang, LanguageService } from '../core/language.service';
import { SubscriptionService } from '../core/subscription.service';
import { FountainService } from '../fountain/fountain.service';
import { of } from 'rxjs';
import { PropertyMetadataCollection, SourceType } from '../types';
import { NamedSources, SourceConfig } from '../fountain_properties';

const property_dict = [
  {
    name: 'Fountain name (Default)',
    osm_p: 'name',
    wd_p: '-',
    description: 'Default name to be shown if no language-specific name is provided',
  },
  {
    name: 'Fountain name (English)',
    osm_p: 'name:en',
    wd_p: 'label (English)',
    description: 'Name of the fountain in English',
  },
  {
    name: 'Fountain name (German)',
    osm_p: 'name:de',
    wd_p: 'label (German)',
    description: 'Name of the fountain in German',
  },
  {
    name: 'Fountain name (French)',
    osm_p: 'name:fr',
    wd_p: 'label (French)',
    description: 'Name of the fountain in French',
  },
  {
    name: 'Bottle access',
    osm_p: 'bottle',
    wd_p: '-',
    description: 'Whether a bottle can be refilled easily. [yes, no]',
  },
  {
    name: 'Wheelchair access',
    osm_p: 'wheelchair',
    wd_p: '-',
    description: 'Whether fountain is wheelchair-friendly. [yes, no]',
  },
  {
    name: 'Pet access',
    osm_p: 'dog',
    wd_p: '-',
    description: 'Whether a fountain for small pets is available. [yes, no]',
  },
  {
    name: 'Water flow',
    osm_p: 'flow_rate',
    wd_p: '-',
    description: 'Flow rate of fountain. [example: 1.5 l/min]',
  },
  {
    name: 'Year',
    osm_p: 'start_date',
    wd_p: 'P571',
    description: 'Year of construction. [example: 1971]',
  },
  {
    name: 'Directions',
    osm_p: '-',
    wd_p: 'P2795',
    description: 'Directions to or address of fountain. [example: near Kappenbühlstrasse 74]',
  },
];

@Component({
  selector: 'app-guide-selector',
  styleUrls: ['./guide.component.css'],
  template: '',
  providers: [SubscriptionService],
})
export class GuideSelectorComponent implements OnInit {
  metadata!: PropertyMetadataCollection;
  available_properties: (keyof PropertyMetadataCollection)[] = [];
  guides: string[] = ['images', 'name', 'fountain'];

  constructor(
    private subscriptionService: SubscriptionService,
    private dialog: MatDialog,
    private dataService: DataService,
    private languageService: LanguageService,
    private fountainService: FountainService
  ) {}

  langObservable = this.languageService.langObservable;
  fountainObservable = this.fountainService.fountain;
  propertyMetadataCollectionObservable = this.dataService.propertyMetadataCollection;
  propertyObservable = this.fountainService.selectedProperty;

  ngOnInit(): void {
    this.subscriptionService.registerSubscriptions(
      this.propertyMetadataCollectionObservable.subscribeOnce(metadata => {
        // TODO @ralf.hauser, is actually FountainPropertiesMeta which is not as precise as PropertyMetadataCollection
        const m = metadata as any as PropertyMetadataCollection;
        this.metadata = m;
        this.available_properties = _.map(m, 'id');
      })
    );
  }

  changeProperty(propertyId: string): void {
    this.fountainService.selectProperty(propertyId);
  }

  forceCityRefresh(): void {
    this.dataService.forceLocationRefresh();
  }
  public forceLocalRefresh(): void {
    this.dataService.forceRefresh();
  }

  openGuide(id: string | null = null): void {
    const propertyId = id ? of(id) : this.fountainService.selectedProperty.map(x => x?.id);
    propertyId.subscribeOnce(id => {
      switch (id) {
        case 'name': {
          this.dialog.open(NameGuideComponent, DialogConfig);
          break;
        }
        case 'images': {
          this.dialog.open(ImagesGuideComponent, DialogConfig);
          break;
        }
        case 'fountain': {
          this.dialog.open(NewFountainGuideComponent, DialogConfig);
          break;
        }
        default: {
          console.log(`Guide name not recognized: ${id}`);
        }
      }
    });
  }

  closeGuide(): void {
    // this.bottomSheetRef.dismiss()
  }

  getSrcConfig(
    propertyMetadataCollection: PropertyMetadataCollection,
    currentPropertyId: string
  ): NamedSources<SourceConfig<string, string>, SourceConfig<string, string>> | undefined {
    return propertyMetadataCollection[currentPropertyId]?.src_config;
  }

  getSrcConfigProp(
    propertyMetadataCollection: PropertyMetadataCollection,
    currentPropertyId: string,
    sourceType: SourceType
  ): SourceConfig<string, string> | undefined {
    return this.getSrcConfig(propertyMetadataCollection, currentPropertyId)?.[sourceType];
  }

  getSrcConfigHasProperty(
    propertyMetadataCollection: PropertyMetadataCollection,
    currentPropertyId: string,
    sourceType: SourceType,
    property: string
  ): boolean {
    const sourceConfig = propertyMetadataCollection[currentPropertyId]?.src_config[sourceType];
    return sourceConfig !== undefined && Object.prototype.hasOwnProperty.call(sourceConfig, property);
  }

  getSrcInstructions(
    propertyMetadataCollection: PropertyMetadataCollection,
    currentPropertyId: string,
    sourceType: SourceType,
    lang: Lang,
    index: number
  ): string | undefined {
    const translated = this.getSrcConfigProp(
      propertyMetadataCollection,
      currentPropertyId,
      sourceType
    )?.src_instructions;
    return translated?.[lang][index];
  }
}

@Component({
  selector: 'app-images-guide',
  styleUrls: ['./guide.component.css'],
  templateUrl: './images.guide.component.html',
  providers: [SubscriptionService],
})
export class ImagesGuideComponent extends GuideSelectorComponent {}

@Component({
  selector: 'app-fountain-guide',
  styleUrls: ['./guide.component.css'],
  templateUrl: './new-fountain.guide.component.html',
  providers: [SubscriptionService],
})
export class NewFountainGuideComponent extends GuideSelectorComponent {}

@Component({
  selector: 'app-property-guide',
  styleUrls: ['./guide.component.css'],
  templateUrl: './property.guide.component.html',
  providers: [SubscriptionService],
})
export class PropertyGuideComponent extends GuideSelectorComponent {}

@Component({
  selector: 'app-name-guide',
  styleUrls: ['./guide.component.css'],
  templateUrl: './name.guide.component.html',
  providers: [SubscriptionService],
})
export class NameGuideComponent extends GuideSelectorComponent {
  property_dict = new MatTableDataSource(property_dict);
  displayedColumns: string[] = ['name', 'osm_p', 'wd_p', 'description'];

  applyFilter(keyboardEvent: KeyboardEvent): void {
    if (keyboardEvent.target) {
      const filterValue = (keyboardEvent.target as any)['value'];
      this.property_dict.filter = filterValue.trim().toLowerCase();
    }
  }
}
