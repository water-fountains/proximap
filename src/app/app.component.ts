import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, DoCheck } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { MediaMatcher } from '@angular/cdk/layout';
import { IAppState } from './store';
import { TOGGLE_LIST, RETURN_TO_ROOT, CLOSE_NAVIGATION, FOUNTAIN_SELECTOR_SUCCESS } from './actions';
import { Router, Route } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { RouteCheckerService } from "./route-checker.service";
import { Observable } from "rxjs";
import { DataService } from "./data.service";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck {
  title = 'app';
  @select() mode;
  @select() showList;
  @select() showMenu;
  @select() previewState;
  @select((s: IAppState) => s) filterCategories$: Observable<string>
  // @select((s: IAppState) => s.fountainSelector) fountainSelector$: Observable<string>

  @ViewChild('listDrawer') listDrawer;
  @ViewChild('menuDrawer') menuDrawer;
  @ViewChild('map') map: ElementRef;
  mobileQuery: MediaQueryList;
  public list;
  private _mobileQueryListener: () => void;
  data;

  @select((s: IAppState) => s.lang) lang$: Observable<string>


  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private ngRedux: NgRedux<IAppState>, public router: Router, private route: ActivatedRoute, public routes: RouteCheckerService, public _data: DataService
    , public translate: TranslateService) {
    this.mobileQuery = media.matchMedia('(max-width: 900px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this._data.checkFountainSelector();


    //  MultiLanguages functionality default is en (English)
    // this.translate.use(this.ngRedux.getState().lang);
    this.lang$.subscribe((s) => {
      this.translate.use(s);
    })

  }

  ngOnInit() {
    this.showList.subscribe((show) => {
      if (this.mobileQuery.matches) {
        if (show) {
          this.listDrawer.open({ openedVia: 'mouse' });
        } else {
          this.listDrawer.close();
          // this.map.nativeElement.focus();
        }
      }

    });
    this.showMenu.subscribe((show) => {
      show ? this.menuDrawer.open() : this.menuDrawer.close();
    })

    this.data = this.route.snapshot.data;

  }
  ngDoCheck() {
  }

  closeList() {
    this.ngRedux.dispatch({ type: TOGGLE_LIST, payload: false })
  }

  returnToRoot() {
    this.ngRedux.dispatch({ type: RETURN_TO_ROOT });
  }

  closeNavigation() {
    this.ngRedux.dispatch({ type: CLOSE_NAVIGATION });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}
