/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import {Component, OnInit} from '@angular/core';
import {MatBottomSheet, MatDialog} from '@angular/material';

import {NgRedux, select} from '@angular-redux/store';
import {
  GuideSelectorComponent,
  ImagesGuideComponent,
  NameGuideComponent,
  NewFountainGuideComponent, PropertyGuideComponent
} from '../guide/guide.component';
import {DataService} from '../data.service';
import {SELECT_PROPERTY} from '../actions';
import {IAppState} from '../store';
import {PropertyMetadataCollection} from '../types';
import _ from 'lodash'
import {DialogConfig} from '../constants';

@Component({
  selector: 'app-fountain-property-dialog',
  templateUrl: './fountain-property-dialog.component.html',
  styleUrls: ['./fountain-property-dialog.component.css']
})
export class FountainPropertyDialogComponent implements OnInit {
  @select('propertySelected') p;
  @select('fountainSelected') f;
  @select('lang') lang$;
  lang: string;
  _: _;
  metadata:PropertyMetadataCollection;
  show_property_details = {
    osm: false,
    wikidata: false
  };
  isLoaded: boolean = false;
  // for which properties should a guide be proposed?
  guides: string[] = ['image', 'name', 'name_en', 'name_fr', 'name_de', 'gallery', 'access_pet', 'access_bottle', 'access_wheelchair', 'construction_date', 'water_flow'];

  constructor(public dataService: DataService,
              private ngRedux: NgRedux<IAppState>,
              private dialog: MatDialog,
              private bottomSheet: MatBottomSheet) {
  }

  ngOnInit() {
    this.dataService.fetchPropertyMetadata().then(metadata=>{
      this.metadata = metadata;
      this.isLoaded = true;
    });
    this.lang$.subscribe(l=>this.lang = l);

    // choose whether to show all details
    this.p.subscribe(p=>{
      if(p !== null){
        for (let source_name of ['osm', 'wikidata']){
          if (['PROP_STATUS_FOUNTAIN_NOT_EXIST', 'PROP_STATUS_NOT_AVAILABLE'].indexOf(p.sources[source_name].status)>=0){
            this.show_property_details[source_name] = false;
          }else{
            this.show_property_details[source_name] = true;
          }
        }
      }
    });
  }

  getUrl(source:string, id:string){
    if (source === 'osm'){
      return `https://openstreetmap.org/${id}`;
    }else if (source === 'wikidata'){
      return `https://wikidata.org/wiki/${id}`;
    }
  }

  getHelpUrl(source, pName){
    let baseUrls = {
      osm: 'https://wiki.openstreetmap.org/wiki/Key:',
      wikidata: 'https://www.wikidata.org/wiki/Property:'
    };

    let url = _.get(
      this.metadata,
      [pName,'src_config', source, 'help'],
      baseUrls[source] + this.metadata[pName].src_config[source].src_path[1]);
    return url;
  }

  openGuide(id=null): void {
    // if a property id is provided, use it. Otherwise use the property id that is in the state
    id = id?id:this.ngRedux.getState().propertySelected.id;
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
  }



}
