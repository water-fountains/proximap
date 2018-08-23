import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { NgRedux, select } from '@angular-redux/store';
import { FountainSelector, IAppState } from '../store';
import { HIGHLIGHT_FOUNTAIN, SELECT_FOUNTAIN, UPD_CITY, CHANGE_LANG } from '../actions';
import { RouteCheckerService } from '../route-checker.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public fountains = [];

  constructor(public dataService: DataService, private ngRedux: NgRedux<IAppState>,
    public route: RouteCheckerService, public translate: TranslateService) {
    var urlParams = new URLSearchParams(window.location.search);
    var url = new URL(window.location.href);
    var c = url.searchParams.get("idval");
    let t = {
      queryType: url.searchParams.get("queryType"),
      database: url.searchParams.get("database"),
      idval: url.searchParams.get("idval")
    };

    if (t.idval || t.database || t.queryType) {
      this.dataService.selectCurrentFountain(t)
    }

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
  }

  public highlightFountain(fountain) {
    this.ngRedux.dispatch({ type: HIGHLIGHT_FOUNTAIN, payload: fountain })
  }

}
