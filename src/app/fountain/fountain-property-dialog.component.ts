/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import _ from 'lodash';
import { of } from 'rxjs';
import { DialogConfig } from '../constants';
import { LanguageService } from '../core/language.service';
import { SubscriptionService } from '../core/subscription.service';
import { DataService } from '../data.service';
import { FountainService } from '../fountain/fountain.service';
import { ImagesGuideComponent, NewFountainGuideComponent, PropertyGuideComponent } from '../guide/guide.component';
import { illegalState } from '../shared/illegalState';
import { PropertyMetadataCollection, SourceType } from '../types';

@Component({
  selector: 'app-fountain-property-dialog',
  templateUrl: './fountain-property-dialog.component.html',
  styleUrls: ['./fountain-property-dialog.component.css'],
  providers: [SubscriptionService],
})
export class FountainPropertyDialogComponent implements OnInit {
  show_property_details: Record<SourceType, boolean> = {
    osm: false,
    wikidata: false,
  };
  // for which properties should a guide be proposed?
  guides: string[] = [
    'image',
    'name',
    'name_en',
    'name_fr',
    'name_de',
    'gallery',
    'access_pet',
    'access_bottle',
    'access_wheelchair',
    'construction_date',
    'water_flow',
  ];

  constructor(
    private subscriptionService: SubscriptionService,
    public dataService: DataService,
    private dialog: MatDialog,
    private languageService: LanguageService,
    private fountainService: FountainService
  ) {}

  langObservable = this.languageService.langObservable;
  propertyMetadataCollectionObservable = this.dataService.propertyMetadataCollection;
  fountainObservable = this.fountainService.fountain;
  selectedPropertyObservable = this.fountainService.selectedProperty;

  ngOnInit(): void {
    this.subscriptionService.registerSubscriptions(
      // choose whether to show all details
      this.selectedPropertyObservable.subscribe(property => {
        if (property !== null) {
          for (const source_name of ['osm', 'wikidata'] as SourceType[]) {
            if (
              ['PROP_STATUS_FOUNTAIN_NOT_EXIST', 'PROP_STATUS_NOT_AVAILABLE'].indexOf(
                property.sources[source_name].status
              ) >= 0
            ) {
              this.show_property_details[source_name] = false;
            } else {
              this.show_property_details[source_name] = true;
            }
          }
        }
      })
    );
  }

  getUrl(source: SourceType, id: string): string {
    if (source === 'osm') {
      return `https://openstreetmap.org/${id}`;
    } else if (source === 'wikidata') {
      return `https://wikidata.org/wiki/${id}`;
    } else {
      illegalState('source neither osm nor wikidata, was ' + source);
    }
  }

  //TODO @ralf.hauser, it is discouraged to use function calls in templates. better map the observable accordingly
  getHelpUrl(metadata: PropertyMetadataCollection, source: SourceType, pName: string): string {
    console.log(
      'fountain-property-dialog.components.ts: getHelpUrl "' +
        pName +
        '" source  ' +
        source +
        ' ' +
        new Date().toISOString()
    );
    const baseUrls = {
      osm: 'https://wiki.openstreetmap.org/wiki/Key:',
      wikidata: 'https://www.wikidata.org/wiki/Property:',
    };

    const url = _.get(
      metadata,
      [pName, 'src_config', source, 'help'],
      baseUrls[source] + metadata[pName].src_config[source].src_path[1]
    );
    return url;
  }

  openGuide(id: string | null = null): void {
    const propertyId = id ? of(id) : this.selectedPropertyObservable.map(x => x.id);
    this.subscriptionService.registerSubscriptions(
      propertyId.subscribeOnce(id => {
        // Which guide should be opened?
        switch (id) {
          case 'image': {
            this.dialog.open(ImagesGuideComponent);
            break;
          }
          case 'fountain': {
            this.dialog.open(NewFountainGuideComponent, DialogConfig);
            break;
          }
          default: {
            this.dialog.open(PropertyGuideComponent, DialogConfig);
            break;
          }
        }
      })
    );
  }
}
