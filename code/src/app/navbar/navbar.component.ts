import { Component, OnInit } from '@angular/core';
import {NgRedux} from 'ng2-redux';
import {IAppState} from '../store';
import {EDIT_FILTER_TEXT, TOGGLE_LIST} from '../actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  constructor(private ngRedux: NgRedux<IAppState>) { }

  ngOnInit() {
  }

  textFilter(search_text){
    this.ngRedux.dispatch({type:EDIT_FILTER_TEXT, text: search_text});
  }

  showList(){
    this.ngRedux.dispatch({type:TOGGLE_LIST, payload: true});
  }

}
