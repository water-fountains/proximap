/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { Component, OnInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef, MatDialog, MatTableDataSource} from '@angular/material';
import {NgRedux, select} from '@angular-redux/store';
import {IAppState} from '../store';
import {DataService} from '../data.service';

let property_dict = [
  {
    name: 'Fountain name (Default)',
    osm_p: 'name',
    wd_p: '-',
    description: 'Default name to be shown if no language-specific name is provided'
  },{
    name: 'Fountain name (English)',
    osm_p: 'name:en',
    wd_p: 'label (English)',
    description: 'Name of the fountain in English'
  },{
    name: 'Fountain name (German)',
    osm_p: 'name:de',
    wd_p: 'label (German)',
    description: 'Name of the fountain in German'
  },{
    name: 'Fountain name (French)',
    osm_p: 'name:fr',
    wd_p: 'label (French)',
    description: 'Name of the fountain in French'
  },{
    name: 'Bottle access',
    osm_p: 'bottle',
    wd_p: '-',
    description: 'Whether a bottle can be refilled easily. [yes, no]'
  },{
    name: 'Wheelchair access',
    osm_p: 'wheelchair',
    wd_p: '-',
    description: 'Whether fountain is wheelchair-friendly. [yes, no]'
  },{
    name: 'Pet access',
    osm_p: 'dog',
    wd_p: '-',
    description: 'Whether a fountain for small pets is available. [yes, no]'
  },{
    name: 'Water flow',
    osm_p: 'flow_rate',
    wd_p: '-',
    description: 'Flow rate of fountain. [example: 1.5 l/min]'
  },{
    name: 'Year',
    osm_p: 'start_date',
    wd_p: 'P571',
    description: 'Year of construction. [example: 1971]'
  },{
    name: 'Directions',
    osm_p: '-',
    wd_p: 'P2795',
    description: 'Directions to or address of fountain. [example: near Kappenbühlstrasse 74]'
  }
];

@Component({
  selector: 'app-guide-selector',
  styleUrls: ['./guide.component.css'],
  template: ''
})
export class GuideSelectorComponent implements OnInit {
  @select('fountainSelected') fountain;
  @select('propertySelected') property;
  guides: string[] = ['image', 'name', 'gallery', 'fountain'];

  constructor( private dialog: MatDialog,
               private ngRedux: NgRedux<IAppState>
               ) { }

  ngOnInit() {

  }

  openGuide(name=null):void{
    name = name?name:this.ngRedux.getState().propertySelected.id;
    switch(name){
      case 'name': {this.dialog.open(NameGuideComponent); break;}
      case 'gallery': {this.dialog.open(GalleryGuideComponent); break;}
      case 'image': {this.dialog.open(ImageGuideComponent); break;}
      case 'fountain': {this.dialog.open(NewFountainGuideComponent); break;}
    }
  }

  closeGuide():void{
    // this.bottomSheetRef.dismiss()
  }
}


@Component({
  selector: 'app-image-guide',
  styleUrls: ['./guide.component.css'],
  templateUrl: './image.guide.component.html',
})
export class ImageGuideComponent extends GuideSelectorComponent {}


@Component({
  selector: 'app-image-guide',
  styleUrls: ['./guide.component.css'],
  templateUrl: './new-fountain.guide.component.html',
})
export class NewFountainGuideComponent extends GuideSelectorComponent {
  constructor(
    ngRedux: NgRedux<IAppState>,
    dialog: MatDialog,
    private dataService: DataService
  ){
    super( dialog, ngRedux);

  }
  forceCityRefresh(){
    this.dataService.forceLocationRefresh();
  }
  public forceLocalRefresh(){
    this.dataService.forceRefresh();
  }
}



@Component({
  selector: 'app-gallery-guide',
  styleUrls: ['./guide.component.css'],
  templateUrl: './gallery.guide.component.html',
})
export class GalleryGuideComponent extends GuideSelectorComponent {}

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
