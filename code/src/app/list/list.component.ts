import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import {NgRedux} from 'ng2-redux';
import {IAppState} from '../store';
import {SELECT_FOUNTAIN} from '../actions';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public fountains;

  constructor(public dataService: DataService, private ngRedux: NgRedux<IAppState>) {

  }

  ngOnInit() {

  }

  public selectFountain(id){
    this.ngRedux.dispatch({type:SELECT_FOUNTAIN, fountainId: id});
  }

}
