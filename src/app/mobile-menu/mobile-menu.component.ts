import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {versions } from '../../environments/versions';
import {DataService} from '../data.service';
import _ from 'lodash';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.css']
})
export class MobileMenuComponent implements OnInit {
  // @select() lang;
  @Output() menuToggle = new EventEmitter<boolean>();
  locationOptions = [];
  versionInfo = {
    url: `https://github.com/water-fountains/proximap/commit/${versions.revision}`,
    shorthash: versions.revision,
    commit_time: new Date(versions.commit_time),
    build_time: new Date(versions.build_time),
    version: versions.version,
    branch: versions.branch
  };



  constructor(private dataService: DataService) {

  }

  toggleMenu(){
    this.menuToggle.emit(true);
  }

  ngOnInit() {
    this.dataService.metadataLoaded.subscribe(()=>{
      // get location information
      this.locationOptions = _.keys(this.dataService.locationInfo);
    })
  }

}
