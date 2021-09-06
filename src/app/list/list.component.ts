/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Fountain, PropertyMetadataCollection } from '../types';
import { Feature } from 'geojson';
import { getId } from '../database.service';
import { LanguageService } from '../core/language.service';
import { SubscriptionService } from '../core/subscription.service';
import { LayoutService } from '../core/layout.service';
import { FountainService } from '../fountain/fountain.service';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [SubscriptionService],
})
export class ListComponent implements OnInit {
  filtered_fountain_count = 0;
  isLoaded = false;
  propMeta: PropertyMetadataCollection = null;
  public fountains: Feature[] = [];

  total_fountain_count = 0;

  constructor(
    private subscriptionService: SubscriptionService,
    private languageService: LanguageService,
    private dataService: DataService,
    private layoutService: LayoutService,
    private fountainService: FountainService
  ) {}

  langObservable = this.languageService.langObservable;

  ngOnInit(): void {
    this.dataService.fetchPropertyMetadata().then(metadata => {
      this.propMeta = metadata;
      this.isLoaded = true;
    });
    this.subscriptionService.registerSubscriptions(
      this.dataService.fountainsFilteredSuccess.subscribe(data => {
        if (data !== null) {
          this.fountains = data as unknown as Feature[];

          this.total_fountain_count = this.dataService.getTotalFountainCount();
          this.filtered_fountain_count = this.fountains.length;
        } else {
          this.fountains = [];
          this.total_fountain_count = 0;
          this.filtered_fountain_count = 0;
        }
      }),

      // Selected fountain.
      this.fountainService.fountain.subscribe(fountainDetail => {
        if (fountainDetail !== null) {
          const fountainID = fountainDetail.properties.id;

          for (const fountain of this.fountains) {
            if (fountainID == fountain.properties.id) {
              fountain.properties.fountain_detail = fountainDetail;
              break;
            }
          }
        }
      })
    );
  }

  public highlightFountain(fountain: Fountain): void {
    this.layoutService.isMobile.subscribeOnce(isMobile => {
      if (!isMobile) {
        this.dataService.highlightFountain(fountain);
      }
    });
  }

  public getIdFnt(fountain) {
    return getId(fountain);
  }

  public getDistSignificantIss219(fountain: Fountain): string {
    //https://github.com/water-fountains/proximap/issues/291
    const dist = fountain.properties.distanceFromUser;
    if (null == dist) {
      return '';
    }
    const m = dist * 1000;
    let kmS = '';
    if (1500 > m) {
      const res = ' ~' + m.toFixed(0) + 'm';
      //console.log(res);
      return res;
    }
    const km = m / 1000;
    if (m < 20000) {
      kmS = km.toFixed(1);
    } else {
      kmS = km.toFixed(0); // new Intl.NumberFormat('en-GB', { notation: "compact" , compactDisplay: "short" }).format(m);
    }
    //let res = ' ~<acronym title="'+m.toFixed(0)+'m">'+kmS+'km</acronym>';
    const res = ' ~' + kmS + 'km';
    // console.log(res);
    return res;
  }
}
