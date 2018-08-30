import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../store';
import { UPDATE_FILTER_CATEGORIES } from '../actions';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  public onlyOlderThan: boolean = false;
  public ageLimit: number = 2000;
  public onlyNotable: boolean = false;
  public onlySpringwater: boolean = false;
  public filterCount: number = 0;
  public filterText: string = '';
  @select() filterCategories;
  @select() lang;

  updateFilters() {
    this.ngRedux.dispatch({
      type: UPDATE_FILTER_CATEGORIES, payload: {
        onlyOlderThan: this.onlyOlderThan ? this.ageLimit : null,
        onlyNotable: this.onlyNotable,
        onlySpringwater: this.onlySpringwater,
        filterText: this.filterText
      }
    });
    this.filterCount =
      (this.onlyOlderThan ? 1 : 0) +
      (this.onlyNotable ? 1 : 0) +
      (this.onlySpringwater ? 1 : 0) +
      (this.filterText !== '' ? 1 : 0)
  }

  constructor(private ngRedux: NgRedux<IAppState>, public translate: TranslateService) {

    //  MultiLanguages functionality default is en (English)
    translate.use(this.ngRedux.getState().lang);
    this.lang.subscribe((s) => {
      this.translate.use(s);
    })
  }

  ngOnInit() {
  }

}
