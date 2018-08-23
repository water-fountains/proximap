import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../store';
import { EDIT_FILTER_TEXT, TOGGLE_LIST, TOGGLE_MENU, RETURN_TO_ROOT, CHANGE_LANG, FOUNTAIN_SELECTOR_SUCCESS } from '../actions';
import { MediaMatcher } from '@angular/cdk/layout';
import { ActivatedRoute } from "@angular/router";
import { RouteCheckerService } from '../route-checker.service';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @select() showList;
  @select() showMenu;
  @select() filterText;
  @select() mode;
  @Output() menuToggle = new EventEmitter<boolean>();
  @select((s: IAppState) => s.lang) lang$: Observable<string>
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  public urlParams = new URLSearchParams(window.location.search);
  public url = new URL(window.location.href);
  public c = this.url.searchParams.get("lang");
  public lat = null;
  public lng = null;
  // Multilingual Integration Work
  public langOpted = "";
  public lang = this.c;
  public languages = [{ language: "English", code: "en" }, { language: "German", code: "de" }]

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private ngRedux: NgRedux<IAppState>, private route: ActivatedRoute, public routess: RouteCheckerService, public _data: DataService) {
    this.mobileQuery = media.matchMedia('(max-width: 900px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.ngRedux.dispatch({ type: CHANGE_LANG, payload: this.lang })

    this.lang$.subscribe(s => {
      this.langOpted = s
    })
  }

  ngOnInit() {
    if (this.lang !== this.langOpted) {
      this.ngRedux.dispatch({ type: CHANGE_LANG, payload: this.langOpted })
    }
    var urlParams = new URLSearchParams(window.location.search);
    var url = new URL(window.location.href);
    var c = url.searchParams.get("idval");
    if (
      url.searchParams.get("lat") || url.searchParams.get("lng")
    ) {
      this.lat = url.searchParams.get("idval")
    }
    let t = {
      queryType: url.searchParams.get("queryType"),
      database: url.searchParams.get("database"),
      idval: url.searchParams.get("idval"),
      lat: this.lat,
      lng: this.lng
    };

    if (t.idval || t.queryType   || t.database  || t.lat  || t.lng ) {
      this.ngRedux.dispatch({ type: FOUNTAIN_SELECTOR_SUCCESS, payload: t });
      this.routess.languages();
    }
    else {
      this.routess.languages();
    }
  }

  toggleMenu(show) {
    this.ngRedux.dispatch({ type: TOGGLE_MENU, payload: show });
    // this.menuToggle.emit(true);
  }

  applyTextFilter(search_text) {
    this.ngRedux.dispatch({ type: EDIT_FILTER_TEXT, text: search_text });
  }

  toggleList(show) {
    this.ngRedux.dispatch({ type: TOGGLE_LIST, payload: show });
  }

  returnToRoot() {
    this.ngRedux.dispatch({ type: RETURN_TO_ROOT });
  }

  changeLang(lang) {
    this.ngRedux.dispatch({ type: CHANGE_LANG, payload: lang })
  }

  // checking the change of language
  ngDoCheck() {
    if (this.ngRedux.getState().lang !== this.langOpted) {
      this.ngRedux.dispatch({ type: CHANGE_LANG, payload: this.langOpted })
      this.lang = this.langOpted
    }
  }

}

