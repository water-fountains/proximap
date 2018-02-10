import { Component, OnInit } from '@angular/core';
import {NgRedux, select} from 'ng2-redux';
import {DESELECT_FOUNTAIN} from '../actions';
import {IAppState} from '../store';
import {DataService} from '../data.service';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  title = 'This is the detail of fountain ';
  @select() fountainId;

  deselectFountain(){
    this.ngRedux.dispatch({type: DESELECT_FOUNTAIN})
  }

  constructor(private ngRedux: NgRedux<IAppState>, private dataService: DataService) { }

  ngOnInit() {
  }

}
