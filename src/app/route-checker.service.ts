import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { NgRedux, select } from "@angular-redux/store/lib/src";
import { IAppState } from "./store";
import { Feature } from "geojson";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class RouteCheckerService {

  @select((s: IAppState) => s) fountainSelector$: Observable<string>
  public queryType;
  public database;
  public lat;
  public idval;
  public lng;
  public boolean = false;

  // Validates country names 
  _zurich = (/^[ Zuerich| Zuri| zuri| zürich | Zurich]{1,12}$/);
  _geneva = (/^[/Genève  | /geneve | /genf |/geneva |/Geneva]{4,12}$/);
  _bales = (/^[ /bale  | /bâle | /bales]{4,6}$/);

  // Validates language codes
  _en = (/^[english | englisch | anglais | en]{2,8}$/);
  _de = (/^[deutsch | german | allemand | de]{2,8}$/);
  _fr = (/^[ francais| french| französisch | fr]{2,12}$/);

  constructor(public router: Router, private route: ActivatedRoute, private http: HttpClient, private ngRedux: NgRedux<IAppState>) {
  }

  // Checking City during Route
  routeCheck(lang) {
    if (this._zurich.test(location.pathname) || location.pathname == "/z%C3%BCrich") {
      this.checkFilterCategories("zurich", lang);
    }
    else if (this._geneva.test(location.pathname) || location.pathname == "/Gen%C3%A8ve") {
      this.checkFilterCategories("geneva", lang);
    }
    else if (this._bales.test(location.pathname) || location.pathname == "/b%C3%A2le") {
      this.checkFilterCategories("bales", lang);
    }
    else {
      this.checkFilterCategories("zurich", lang);
    }
  }

  // Checking Languages during Route
  languages() {
    var urlParams = new URLSearchParams(window.location.search);
    var url = new URL(window.location.href);
    var c = url.searchParams.get("lang");

    this.route.queryParams.subscribe(params => {
      if (this._de.test(c)) {
        this.routeCheck("de");
      }
      else if (this._en.test(c)) {
        this.routeCheck("en")
      }
      else if (this._fr.test(c)) {
        this.routeCheck("fr")
      }
      else {
        this.routeCheck("en")
      }
    });
  }

  // Checking Filter Categories.
  checkFilterCategories(city, lang) {
    let data = this.ngRedux.getState()
    this.fountainSelector$.subscribe((val) => {
      this.checkFountainSelector(city, lang, val["filterText"], val["filterText"], val["onlyHistoric"], val["onlySpringwater"], data["map"])
    })
  }

  // Checking Fountain Selector
  checkFountainSelector(city, lang, onlyOlderThan, onlyHistoric, onlySpringwater, filterText, map) {
    this.fountainSelector$.subscribe((val) => {
      if (val["fountainSelector"]) {
        this.router.navigate([city], {
          queryParams: {
            lang: `${lang}`,
            onlyOlderThan: onlyOlderThan, onlyHistoric: onlyHistoric, onlySpringwater: onlySpringwater,
            filterText: filterText, queryType: val["fountainSelector"].queryType, database: val["fountainSelector"].database, idval: val["fountainSelector"].idval, lat: val["fountainSelector"].lat,
            lng: val["fountainSelector"].lng
          }
        });
      } else {
        this.router.navigate([city], {
          queryParams: {
            lang: `${lang}`,
            onlyOlderThan: onlyOlderThan, onlyHistoric: onlyHistoric, onlySpringwater: onlySpringwater,
            filterText: filterText, mode: val["mode"]
          }
        });
      }
    })
  }
}
