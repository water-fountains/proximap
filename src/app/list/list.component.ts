/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import {Component, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import { select } from '@angular-redux/store';
import {DeviceMode, PropertyMetadataCollection} from '../types';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {Feature} from 'geojson';
import {getId} from '../database.service';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  filtered_fountain_count: number = 0;
  isLoaded: boolean = false;
  propMeta: PropertyMetadataCollection = null;
  public fountains: Feature[] = [];
  @select() lang$;
  @select() device$;
  device: BehaviorSubject<DeviceMode> = new BehaviorSubject<DeviceMode>('mobile');
  lang: string = 'de';
  total_fountain_count: number = 0;

  constructor(public dataService: DataService) {

  }

  ngOnInit() {
    // watch for device type changes
    this.device$.subscribe(this.device);

    this.dataService.fetchPropertyMetadata().then((metadata)=>{
      this.propMeta = metadata;
      this.isLoaded = true;
    });
    this.dataService.fountainsFilteredSuccess.subscribe(data => {
      if(data !== null){
        this.fountains = data;
        this.total_fountain_count = this.dataService.getTotalFountainCount();
        this.filtered_fountain_count = this.fountains.length;
      }else{
        this.fountains = [];
        this.total_fountain_count = 0;
        this.filtered_fountain_count = 0;
      }
    });
    this.lang$.subscribe(l=>{
      if(l !== null){
        this.lang = l;
      }
    });
    this.device$.subscribe(d=>{
      if(d !== null){
        this.device = d;
      }
    });

  }

  public highlightFountain(fountain) {
    this.dataService.highlightFountain(fountain);
  }

  
  public getIdFnt(fountain) {
    return getId(fountain);
  }

    public getDistSignificantIss219(fountain) {
    //https://github.com/water-fountains/proximap/issues/291
    let dist = fountain.properties.distanceFromUser;
    if (null == dist) {
      return '';
    }
    let m = dist*1000;
    let kmS = '';
    if (1500 > m) {
      let res = ' ~'+m.toFixed(0)+'m'; 
      //console.log(res); 
      return res;
    }
      let km = m / 1000;
    if (m < 20000) {
      kmS = km.toFixed(1); 
    } else {
      kmS = km.toFixed(0);// new Intl.NumberFormat('en-GB', { notation: "compact" , compactDisplay: "short" }).format(m);
    }
    // let res = ' ~<acronym title="'+m.toFixed(0)+'m>'+kmS+'km</acronym>';
    let res = ' ~'+kmS+'km';
    // console.log(res); 
    return res;
  }


}