// // import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
// // import { NgRedux, select } from '@angular-redux/store';
// // import { IAppState } from '../store';
// // import { EDIT_FILTER_TEXT, TOGGLE_LIST, TOGGLE_MENU, RETURN_TO_ROOT, CHANGE_LANG, FOUNTAIN_SELECTED } from '../actions';
// // import { MediaMatcher } from '@angular/cdk/layout';
// // import { ActivatedRoute } from "@angular/router";
// // import { RouteCheckerService } from '../route-checker.service';
// // import { DataService } from '../data.service';
// // import { Observable } from 'rxjs';
// // import { Location } from '@angular/common';
// // import { MAT_CHIPS_DEFAULT_OPTIONS } from '@angular/material';

// // @Component({
// //   selector: 'app-navbar',
// //   templateUrl: './navbar.component.html',
// //   styleUrls: ['./navbar.component.css']
// // })
// // export class NavbarComponent implements OnInit {
// //   @select() showList;
// //   @select() showMenu;
// //   @select() filterText;
// //   @select() mode;
// //   @Output() menuToggle = new EventEmitter<boolean>();
// //   @select((s: IAppState) => s.lang) lang$: Observable<string>
// //   mobileQuery: MediaQueryList;
// //   private _mobileQueryListener: () => void;
// //   public urlParams = new URLSearchParams(window.location.search);
// //   public url = new URL(window.location.href);
// //   public c = this.url.searchParams.get("lang");
// //   public lat = null;
// //   public lng = null;
// //   // Multilingual Integration Work
// //   public langOpted = "";
// //   public lang = this.ngRedux.getState().lang;
// //   public languages = [{ language: "English", code: "en" }, { language: "German", code: "de" }]

// //   constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private ngRedux: NgRedux<IAppState>, private route: ActivatedRoute, public routess: RouteCheckerService, public _data: DataService, public location: Location) {
// //     this.mobileQuery = media.matchMedia('(max-width: 900px)');
// //     this._mobileQueryListener = () => changeDetectorRef.detectChanges();
// //     this.mobileQuery.addListener(this._mobileQueryListener);

// //     this.lang$.subscribe(s => {
// //       // this.langOpted = s
// //       console.log("ssssssssssssssssssssssssssssssss", s)
// //     })
// //     // if (this.langOpted !== 'en' || this.langOpted !== 'de') {
// //     //   // this.func()
// //     //   this.langOpted
// //     // }
// //   }

// //   ngOnInit() {
// //     var urlParams = new URLSearchParams(window.location.search);
// //     var url = new URL(window.location.href);
// //     var c = url.searchParams.get("idval");
// //     if (
// //       url.searchParams.get("lat") || url.searchParams.get("lng")
// //     ) {
// //       this.lat = url.searchParams.get("idval")
// //     }

// //     let llang = url.searchParams.get("lang") ? url.searchParams.get("lang") : this.lang
// //     let t = {
// //       queryType: url.searchParams.get("queryType"),
// //       database: url.searchParams.get("database"),
// //       idval: url.searchParams.get("idval"),
// //       lat: this.lat,
// //       lng: this.lng
// //     };

// //     if (t.idval || t.queryType || t.database || t.lat || t.lng) {
// //       this.ngRedux.dispatch({ type: FOUNTAIN_SELECTED, payload: t });
// //       this._data.selectCurrentFountain(t)
// //       if (llang == "en" || llang == "de") {
// //         console.log('llang', llang)
// //         this.routess.languagesCopy(llang)
// //         // this.langOpted = llang
// //       }
// //       else {
// //         console.log('else 1', llang)
// //         this.routess.languages();
// //       }
// //     }
// //     else {
// //       if (llang == "en" || llang == "de") {
// //         this.routess.languagesCopy(llang)
// //         console.log('llang2', llang)
// //         // this.langOpted = llang
// //       }
// //       else {
// //         this.routess.languages();
// //         // this.langOpted = llang
// //         console.log('else 2', llang)

// //       }
// //     }
// //   }

// //   func() {
// //     var urlParams = new URLSearchParams(window.location.search);
// //     var url = new URL(window.location.href);
// //     var c = url.searchParams.get("idval");
// //     if (
// //       url.searchParams.get("lat") || url.searchParams.get("lng")
// //     ) {
// //       this.lat = url.searchParams.get("idval")
// //     }

// //     let llang = url.searchParams.get("lang") ? url.searchParams.get("lang") : this.lang
// //     let t = {
// //       queryType: url.searchParams.get("queryType"),
// //       database: url.searchParams.get("database"),
// //       idval: url.searchParams.get("idval"),
// //       lat: this.lat,
// //       lng: this.lng
// //     };

// //     if (t.idval || t.queryType || t.database || t.lat || t.lng) {
// //       this.ngRedux.dispatch({ type: FOUNTAIN_SELECTED, payload: t });
// //       this._data.selectCurrentFountain(t)
// //       if (llang == "en" || llang == "de") {
// //         console.log('llang', llang)
// //         this.routess.languagesCopy(llang)
// //         this.langOpted = llang
// //       }
// //       else {
// //         console.log('else 1', llang)
// //         this.routess.languages();
// //       }
// //     }
// //     else {
// //       if (llang == "en" || llang == "de") {
// //         this.routess.languagesCopy(llang)
// //         console.log('llang2', llang)
// //       }
// //       else {
// //         this.routess.languages();
// //         this.langOpted = llang
// //         console.log('else 2', llang)

// //       }
// //     }
// //   }

// //   toggleMenu(show) {
// //     this.ngRedux.dispatch({ type: TOGGLE_MENU, payload: show });
// //     // this.menuToggle.emit(true);
// //   }

// //   applyTextFilter(search_text) {
// //     this.ngRedux.dispatch({ type: EDIT_FILTER_TEXT, text: search_text });
// //   }

// //   toggleList(show) {
// //     this.ngRedux.dispatch({ type: TOGGLE_LIST, payload: show });
// //   }

// //   returnToRoot() {
// //     this.ngRedux.dispatch({ type: RETURN_TO_ROOT });
// //   }

// //   // checking the change of language
// //   ngDoCheck() {
// //     if (this.ngRedux.getState().lang !== this.langOpted) {
// //       console.log("this.langopted", this.langOpted)
// //       console.log("new URLSearchParams(window.location.search)", new URLSearchParams(window.location.search).get("lang"))
// //       // this.lang = this.langOpted
// //       if (this.langOpted == "en" || this.langOpted == "de") {
// //         this.ngRedux.dispatch({ type: CHANGE_LANG, payload: this.langOpted })
// //         this.routess.languagesCopy(this.langOpted)
// //       }
// //       else {
// //         this.langOpted = this.ngRedux.getState().lang
// //       }
// //     }
// //   }

// // }

// import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
// import { NgRedux, select } from '@angular-redux/store';
// import { IAppState } from '../store';
// import { EDIT_FILTER_TEXT, TOGGLE_LIST, TOGGLE_MENU, RETURN_TO_ROOT, CHANGE_LANG, FOUNTAIN_SELECTOR_SUCCESS, FOUNTAIN_SELECTED } from '../actions';
// import { MediaMatcher } from '@angular/cdk/layout';
// import { ActivatedRoute, Router } from "@angular/router";
// import { RouteCheckerService } from '../route-checker.service';
// import { DataService } from '../data.service';
// import { Observable } from 'rxjs';
// // import { Location } from '@angular/common';

// @Component({
//   selector: 'app-navbar',
//   templateUrl: './navbar.component.html',
//   styleUrls: ['./navbar.component.css']
// })
// export class NavbarComponent implements OnInit {
//   @select() showList;
//   @select() showMenu;
//   @select() filterText;
//   @select() mode;
//   @Output() menuToggle = new EventEmitter<boolean>();
//   @select((s: IAppState) => s.lang) lang$: Observable<string>
//   mobileQuery: MediaQueryList;
//   private _mobileQueryListener: () => void;
//   public urlParams = new URLSearchParams(window.location.search);
//   public url = new URL(window.location.href);
//   public c = this.url.searchParams.get("lang");
//   public lat = null;
//   public lng = null;
//   // Multilingual Integration Work
//   public langOpted = "en";
//   public lang = this.c;
//   public languages = [{ language: "English", code: "en" }, { language: "German", code: "de" }]

//   constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
//      private ngRedux: NgRedux<IAppState>, private route: ActivatedRoute,
//       private location: Location, public routess: RouteCheckerService,
//        public _data: DataService,public rroute:Router) {
//     this.mobileQuery = media.matchMedia('(max-width: 900px)');
//     this._mobileQueryListener = () => changeDetectorRef.detectChanges();
//     this.mobileQuery.addListener(this._mobileQueryListener);
//     this.ngRedux.dispatch({ type: CHANGE_LANG, payload: this.lang })

//     this.lang$.subscribe(s => {
//       // if (s == this.langOpted) {
//       this.langOpted = s
//       console.log("sssssssssssssssssssssss", s)
//       // }
//     })
//   }
//   id;
//   ngOnInit() {
//     if (this.lang !== this.langOpted) {
//       this.ngRedux.dispatch({ type: CHANGE_LANG, payload: this.langOpted })
//     }
//     var urlParams = new URLSearchParams(window.location.search);
//     var url = new URL(window.location.href);
//     var c = url.searchParams.get("idval");
//     if (
//       url.searchParams.get("lat") || url.searchParams.get("lng")
//     ) {
//       this.lat = url.searchParams.get("idval")
//     }
//     let t = {
//       queryType: url.searchParams.get("queryType"),
//       database: url.searchParams.get("database"),
//       idval: url.searchParams.get("idval"),
//       lat: this.lat,
//       lng: this.lng
//     };

//     if (t.idval || t.queryType || t.database || t.lat || t.lng) {
//       this.ngRedux.dispatch({ type: FOUNTAIN_SELECTOR_SUCCESS, payload: t });
//       this.routess.languages();
//     }
//     else {
//       this.routess.languages();
//     }
//   }


//   toggleMenu(show) {
//     this.ngRedux.dispatch({ type: TOGGLE_MENU, payload: show });
//     // this.menuToggle.emit(true);
//   }

//   applyTextFilter(search_text) {
//     this.ngRedux.dispatch({ type: EDIT_FILTER_TEXT, text: search_text });
//   }

//   toggleList(show) {
//     this.ngRedux.dispatch({ type: TOGGLE_LIST, payload: show });
//   }

//   returnToRoot() {
//     this.ngRedux.dispatch({ type: RETURN_TO_ROOT });
//   }

//   changeLang(lang) {
//     this.ngRedux.dispatch({ type: CHANGE_LANG, payload: lang })
//   }

//   ngDoCheck() {
//     if (this.ngRedux.getState().lang !== this.langOpted) {
//       this.ngRedux.dispatch({ type: CHANGE_LANG, payload: this.langOpted })
//       this.lang = this.langOpted
//       // history.pushState('', 'New Page Title');
//       this.rroute.navigateByUrl("/team/33/user/11", { skipLocationChange: true });
//     }
//   }

//   sel(lang) {
//       this.rroute.navigateByUrl("/zurich", { skipLocationChange: true });    
//   }
// }


import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../store';
import { EDIT_FILTER_TEXT, TOGGLE_LIST, TOGGLE_MENU, RETURN_TO_ROOT, CHANGE_LANG, FOUNTAIN_SELECTOR_SUCCESS } from '../actions';
import { MediaMatcher } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from "@angular/router";
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

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private ngRedux: NgRedux<IAppState>, private route: ActivatedRoute,
    public routess: RouteCheckerService, public _data: DataService,
    public rroute: Router) {
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

    if (t.idval || t.queryType || t.database || t.lat || t.lng) {
      this.ngRedux.dispatch({ type: FOUNTAIN_SELECTOR_SUCCESS, payload: t });
      this._data.selectCurrentFountain(t)
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

  // checking the change of language
  ngDoCheck() {
    if (this.ngRedux.getState().lang !== this.langOpted) {
      this.ngRedux.dispatch({ type: CHANGE_LANG, payload: this.langOpted })
      this.lang = this.langOpted
    }
  }

  //Updating URL during lang change from site
  sel(lang) {
    history.replaceState('', '', `${location.protocol + '//' + location.host + location.pathname}?lang=${this.langOpted}${window.location.search.slice(8)}`)
  }

}

