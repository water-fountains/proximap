/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { NgRedux, select } from '@angular-redux/store';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import _ from 'lodash';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CLOSE_SIDEBARS, EDIT_FILTER_TEXT, TOGGLE_LIST, TOGGLE_MENU } from '../actions';
import { DataService } from '../data.service';
import { IAppState } from '../store';
import * as sharedConstants from './../../assets/shared-constants.json';
import { LanguageService } from './../core/language.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  @select() showList;
  @select() showMenu: Observable<boolean>;
  @select() filterText;
  @select() mode;
  @Output() menuToggle = new EventEmitter<boolean>();
  @select() device$;
  publicSharedConsts = sharedConstants;
  public cities = [];
  public last_scan: Date = new Date();

  constructor(
    private dataService: DataService,
    private ngRedux: NgRedux<IAppState>,
    public languageService: LanguageService
  ) {}

  public langObservable = this.languageService.langObservable;

  ngOnInit(): void {
    this.dataService.fetchLocationMetadata().then(([_, cities]) => {
      this.cities = cities;
      if (!environment.production) {
        console.log(this.cities.length + ' locations added ' + new Date().toISOString());
      }
    });

    // watch for fountains to be loaded to obtain last scan time
    // for https://github.com/water-fountains/proximap/issues/188 2)
    this.dataService.fountainsLoadedSuccess.subscribe(fountains => {
      this.last_scan = _.get(fountains, ['properties', 'last_scan'], '');
    });
  }

  toggleMenu(show: boolean) {
    console.log('toggleMenu ' + show + ' ' + new Date().toISOString());
    this.ngRedux.dispatch({ type: TOGGLE_MENU, payload: show });
    // this.menuToggle.emit(true);
  }

  applyTextFilter(search_text) {
    console.log('applyTextFilter ' + search_text + ' ' + new Date().toISOString());
    this.ngRedux.dispatch({ type: EDIT_FILTER_TEXT, text: search_text });
  }

  toggleList(show: boolean) {
    console.log('toggleList ' + show + ' ' + new Date().toISOString());
    this.ngRedux.dispatch({ type: TOGGLE_LIST, payload: show });
  }

  returnToRoot() {
    // close sidebars
    this.ngRedux.dispatch({ type: CLOSE_SIDEBARS });
  }
}
