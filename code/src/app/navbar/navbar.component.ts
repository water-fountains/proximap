import { Component, OnInit } from '@angular/core';
import {NgRedux} from 'ng2-redux';
import {IAppState} from '../store';
import {FILTER_TEXT} from '../actions';

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
    this.ngRedux.dispatch({type:FILTER_TEXT, text: search_text})
  }

}
