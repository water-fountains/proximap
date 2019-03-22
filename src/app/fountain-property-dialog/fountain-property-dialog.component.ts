/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import {Component, OnInit} from '@angular/core';
import {MatBottomSheet} from '@angular/material';

import {NgRedux, select} from '@angular-redux/store';
import {GalleryGuideComponent, GuideSelectorComponent, ImageGuideComponent, NameGuideComponent} from '../guide/guide.component';
import {DataService} from '../data.service';
import {SELECT_PROPERTY} from '../actions';
import {IAppState} from '../store';
import {PropertyMetadataCollection} from '../types';

@Component({
  selector: 'app-fountain-property-dialog',
  templateUrl: './fountain-property-dialog.component.html',
  styleUrls: ['./fountain-property-dialog.component.css']
})
export class FountainPropertyDialogComponent implements OnInit {
  @select('propertySelected') p;
  @select('fountainSelected') f;
  metadata:PropertyMetadataCollection;
  // for which properties should a guide be proposed?
  guides: string[] = ['image', 'name', 'name_en', 'name_fr', 'name_de', 'gallery', 'access_pet', 'access_bottle', 'access_wheelchair', 'construction_date', 'water_flow'];

  constructor(public dataService: DataService,
              private ngRedux: NgRedux<IAppState>,
              private bottomSheet: MatBottomSheet) {
  }

  ngOnInit() {
    this.metadata = this.dataService.propMeta;
  }

  getUrl(source:string, id:string){
    if (source === 'osm'){
      return `https://osm.org/${id}`;
    }else if (source === 'wikidata'){
      return `https://wikidata.org/wiki/${id}`;
    }
  }

  openGuide(name=null): void {
    name = name?name:this.ngRedux.getState().propertySelected.name;
    // Which guide should be opened?
    switch (name) {
      case 'image': {
        this.bottomSheet.open(ImageGuideComponent);
        break;
      }
      case 'name':
      case 'name_en':
      case 'name_fr':
      case 'name_de':
      case 'construction_date':
      case 'water_flow':
      case 'access_pet':
      case 'access_wheelchair':
      case 'access_bottle': {
        this.bottomSheet.open(NameGuideComponent);
        break;
      }
      case 'gallery': {
        this.bottomSheet.open(ImageGuideComponent);
        break;
      }
    }
  }

  openGuideSelector() {
    this.bottomSheet.open(GuideSelectorComponent);
  }

  closePropertyview() {
    this.ngRedux.dispatch({type: SELECT_PROPERTY, payload: null});
  }

}
