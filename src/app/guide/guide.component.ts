/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../store';
import { DataService } from '../data.service';
import { DialogConfig } from '../constants';
import { PropertyMetadataCollection } from '../types';

import _ from 'lodash';
import { LanguageService } from '../core/language.service';
import { SubscriptionService } from '../core/subscription.service';
import { FountainService } from '../fountain/fountain.service';
import { of } from 'rxjs';

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
  metadata: PropertyMetadataCollection = {};
  available_properties: string[];
  current_property_id: string;
  guides: string[] = ['images', 'name', 'fountain'];

  constructor(
    private subscriptionService: SubscriptionService,
    private dialog: MatDialog,
    private ngRedux: NgRedux<IAppState>,
    private dataService: DataService,
    private languageService: LanguageService,
    private fountainService: FountainService
  ) {
    this.dataService.fetchPropertyMetadata().then(metadata => {
      this.metadata = metadata;
      this.available_properties = _.map(this.metadata, 'id');
    });
  }

  langObservable = this.languageService.langObservable;
  fountainObservable = this.fountainService.fountain;

  ngOnInit(): void {
    this.subscriptionService.registerSubscriptions(
      this.fountainService.selectedProperty.subscribe(p => {
        if (p) {
          this.current_property_id = p.id;
        }
      })
    );
  }

  changeProperty() {
    this.fountainService.selectProperty(this.current_property_id);
  }

  forceCityRefresh() {
    this.dataService.forceLocationRefresh();
  }
  public forceLocalRefresh() {
    this.dataService.forceRefresh();
  }

  openGuide(id: string | null = null): void {
    const propertyId = id ? of(id) : this.fountainService.selectedProperty.map(x => x.id);
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
}

@Component({
  selector: 'app-images-guide',
  styleUrls: ['./guide.component.css'],
  templateUrl: './images.guide.component.html',
})
export class ImagesGuideComponent extends GuideSelectorComponent {}

@Component({
  selector: 'app-fountain-guide',
  styleUrls: ['./guide.component.css'],
  templateUrl: './new-fountain.guide.component.html',
})
export class NewFountainGuideComponent extends GuideSelectorComponent {}

@Component({
  selector: 'app-property-guide',
  styleUrls: ['./guide.component.css'],
  templateUrl: './property.guide.component.html',
})
export class PropertyGuideComponent extends GuideSelectorComponent {}

@Component({
  selector: 'app-name-guide',
  styleUrls: ['./guide.component.css'],
  templateUrl: './name.guide.component.html',
})
export class NameGuideComponent extends GuideSelectorComponent {
  property_dict = new MatTableDataSource(property_dict);
  displayedColumns: string[] = ['name', 'osm_p', 'wd_p', 'description'];

  applyFilter(filterValue: string) {
    this.property_dict.filter = filterValue.trim().toLowerCase();
  }
}
