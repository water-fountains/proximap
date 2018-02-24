import { Component, OnInit } from '@angular/core';
import {NgRedux, select} from 'ng2-redux';
import {IAppState} from '../store';
import {EDIT_FILTER_TEXT, TOGGLE_LIST} from '../actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @select() showList;
  @select() filterText;

  constructor(private ngRedux: NgRedux<IAppState>) { }

  ngOnInit() {
  }

  applyTextFilter(search_text){
    this.ngRedux.dispatch({type:EDIT_FILTER_TEXT, text: search_text});
  }

  toggleList(show){
    this.ngRedux.dispatch({type:TOGGLE_LIST, payload: show});
  }
}
