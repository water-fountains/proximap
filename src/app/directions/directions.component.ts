import { Component, OnInit } from '@angular/core';
import {IAppState} from '../store';
import {NgRedux, select} from '@angular-redux/store';

@Component({
  selector: 'app-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.css']
})

export class DirectionsComponent implements OnInit {
  public steps;
  @select('directions') directions;

  constructor(
    private ngRedux: NgRedux<IAppState>
  ) { }

  ngOnInit() {
    this.directions.subscribe(data=>{
      if(data !== null){
        this.steps = data.routes[0].legs[0].steps;
      }
    })
  }

}
