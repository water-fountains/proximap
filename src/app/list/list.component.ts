import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { NgRedux } from '@angular-redux/store';
import { FountainSelector, IAppState } from '../store';
import { HIGHLIGHT_FOUNTAIN, SELECT_FOUNTAIN } from '../actions';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public fountains = [];

  constructor(public dataService: DataService, private ngRedux: NgRedux<IAppState>) {

  }

  ngOnInit() {
    this.dataService.fountainsFilteredSuccess.subscribe(data => {
      this.fountains = data;
    })

  }

  public selectFountain(fountain) {
    let s: FountainSelector = {} as any;
    if (fountain.properties.id_wikidata !== 'undefined') {
      s = {
        queryType: 'byId',
        database: 'wikidata',
        idval: fountain.properties.id_wikidata
      };
    } else if (fountain.properties.id_operator !== 'undefined') {
      s = {
        queryType: 'byId',
        database: 'operator',
        idval: fountain.properties.id_operator
      };
    } else if (fountain.properties.id_osm !== 'undefined') {
      s = {
        queryType: 'byId',
        database: 'osm',
        idval: fountain.properties.id_osm
      };
    } else {
      s = {
        queryType: 'byCoords',
        lat: fountain.geometry.coordinates[1],
        lng: fountain.geometry.coordinates[0]
      };
    }
    this.dataService.selectCurrentFountain(s);
    // this.ngRedux.dispatch({type:SELECT_FOUNTAIN, payload: fountain});
  }

  public highlightFountain(fountain) {
    this.ngRedux.dispatch({ type: HIGHLIGHT_FOUNTAIN, payload: fountain })
  }

}
