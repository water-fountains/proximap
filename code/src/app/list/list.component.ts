import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../store';
import { HIGHLIGHT_FOUNTAIN, SELECT_FOUNTAIN } from '../actions';
import { Observable } from "rxjs/Observable";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public fountains = [];
  @select((s: IAppState) => s.lang) lang$: Observable<string>


  constructor(public dataService: DataService, private ngRedux: NgRedux<IAppState>, public translate: TranslateService) {

    //  MultiLanguages functionality default is en (English)
    translate.use(this.ngRedux.getState().lang);
    this.lang$.subscribe((s) => {
      if (s === undefined) {
        this.translate.use("en");
      }
      else {
        this.translate.use(s);
      }
    })
  }

  ngOnInit() {
    this.dataService.fountainsFilteredSuccess.subscribe(data => {
      this.fountains = data;
    })
  }

  public selectFountain(fountain) {
    this.dataService.selectCurrentFountain(fountain);
  }

  public highlightFountain(fountain) {
    this.ngRedux.dispatch({ type: HIGHLIGHT_FOUNTAIN, payload: fountain })
  }

}
