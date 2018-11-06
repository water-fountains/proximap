import { Component, OnInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef, MatTableDataSource} from '@angular/material';
import {NgRedux, select} from '@angular-redux/store';
import {IAppState} from '../store';

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
  guides: string[] = ['image', 'name', 'gallery'];

  constructor( private bottomSheetRef: MatBottomSheetRef<GuideSelectorComponent>,
               private bottomSheet: MatBottomSheet,
               private ngRedux: NgRedux<IAppState>
               ) { }

  ngOnInit() {

  }

  openGuide(name=null):void{
    name = name?name:this.ngRedux.getState().propertySelected.name
    switch(name){
      case 'image': {this.bottomSheet.open(ImageGuideComponent); break;}
      case 'name': {this.bottomSheet.open(NameGuideComponent); break;}
      case 'gallery': {this.bottomSheet.open(GalleryGuideComponent); break;}
    }
  }

  closeGuide():void{
    this.bottomSheetRef.dismiss()
  }
}


@Component({
  selector: 'app-image-guide',
  styleUrls: ['./guide.component.css'],
  templateUrl: './image.guide.component.html',
})
export class ImageGuideComponent extends GuideSelectorComponent {}



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
