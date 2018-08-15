import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../store';
import { EDIT_FILTER_TEXT, TOGGLE_LIST, TOGGLE_MENU, RETURN_TO_ROOT, CHANGE_LANG } from '../actions';
import { MediaMatcher } from '@angular/cdk/layout';

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
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  // Multilingual Integration Work

  public langOpted = "en";
  public lang = "en";
  public languages = [{ language: "English", code: "en" }, { language: "German", code: "de" }]

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private ngRedux: NgRedux<IAppState>) {
    this.mobileQuery = media.matchMedia('(max-width: 900px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.ngRedux.dispatch({ type: CHANGE_LANG, payload: this.lang })
  }

  ngOnInit() {
    if (this.lang !== this.langOpted) {
      this.ngRedux.dispatch({ type: CHANGE_LANG, payload: this.langOpted })
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

  ngDoCheck() {
    if (this.lang !== this.langOpted) {
      this.ngRedux.dispatch({ type: CHANGE_LANG, payload: this.langOpted })
      this.lang = this.langOpted
    }
  }

}
