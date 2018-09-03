import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { NgRedux, select } from "@angular-redux/store/lib/src";
import { IAppState } from "./store";
import { Feature } from "geojson";
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from "rxjs";
import { DataService } from './data.service';
import { FOUNTAIN_SELECTOR_SUCCESS, CHANGE_LANG, UPD_CITY } from './actions';
import { isObject } from 'util';
@Injectable({
  providedIn: 'root'
})
export class RouteCheckerService {

  @select((s: IAppState) => s) fountainSelector$: Observable<string>
  private subscription: Subscription;

  public queryType;
  public database;
  public lat;
  public idval;
  public lng;
  public boolean = false;
  public cityName;
  public lang;

  // Validates country names 
  _zurich = (/^[ Zuerich| Zuri| zuri| zürich | Zurich]{1,12}$/);
  _geneva = (/^[/Genève  | /geneve | /genf |/geneva |/Geneva]{4,12}$/);
  _basel = (/^[ /bale  | /bâle | /basel]{4,6}$/);

  constructor(public router: Router, private route: ActivatedRoute, private http: HttpClient, private ngRedux: NgRedux<IAppState>, public _data: DataService) {
  }

  // Checking City during Route
  routeCheck(lang) {
    if (this._geneva.test(location.pathname) || location.pathname == "/Gen%C3%A8ve") {
      this.checkFilterCategories("geneva", lang);
      this.cityName = "geneva"
    }
    else if (this._basel.test(location.pathname) || location.pathname == "/b%C3%A2le") {
      this.checkFilterCategories("basel", lang);
      this.cityName = "basel"
    }
    else {
      this.checkFilterCategories("zurich", lang);
      this.cityName = "zurich"

    }
    this.ngRedux.dispatch({ type: UPD_CITY, payload: this.cityName })
  }

  // Checking Languages during Route
  languages() {
    var urlParams = new URLSearchParams(window.location.search);
    var url = new URL(window.location.href);
    var c = url.searchParams.get("lang");
    // if (a = "") {
    this.route.queryParams.subscribe(params => {
      if (c == "deutsch" || c == " german" || c == "allemand" || c == "de") {
        this.routeCheck("de");
        this.lang = "de";
      }
      else if (c == "francais" || c == "french" || c == "französisch" || c == "fr") {
        this.routeCheck("fr")
        this.lang = "fr";
      }
      else {
        this.routeCheck("en");
        this.lang = "en";
      }
      this.ngRedux.dispatch({ type: CHANGE_LANG, payload: this.lang })
    });
  }

  // Checking Filter Categories.
  checkFilterCategories(city, lang) {
    let data = this.ngRedux.getState();
    this.checkFountainSelector(city, lang)
  }

  // Checking Fountain Selector
  checkFountainSelector(city, lang) {
    this.fountainSelector$.subscribe((val) => {
      if (val["fountainSelectorData"]) {
        this.router.navigate([city], {
          queryParams: {
            lang: `${lang}`,
            onlyOlderThan: val["onlyOlderThan"], onlyHistoric: val["onlyHistoric"], onlySpringwater: val["onlySpringwater"],
            filterText: val["filterText"], queryType: val["fountainSelector"].queryType, database: val["fountainSelector"].database, idval: val["fountainSelector"].idval, lat: val["fountainSelector"].lat,
            lng: val["fountainSelector"].lng, mode: val["mode"]
          }
        });
      } else {
        this.router.navigate([city], {
          queryParams: {
            lang: `${lang}`,
            onlyOlderThan: val["onlyOlderThan"], onlyHistoric: val["onlyHistoric"], onlySpringwater: val["onlySpringwater"],
            filterText: val["filterText"], mode: val["mode"]
          }
        });
      }
    })
  }
}
