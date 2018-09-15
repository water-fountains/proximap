import { Component, OnInit } from '@angular/core';
import {IAppState} from '../store';
import {NgRedux, select} from '@angular-redux/store';
import {CHANGE_TRAVEL_MODE} from '../actions';

@Component({
  selector: 'app-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.css']
})

export class DirectionsComponent implements OnInit {
  public leg = {steps:[], duration:0};
  @select('directions') directions;
  public travelMode='walking';

  constructor(
    private ngRedux: NgRedux<IAppState>
  ) { }

  ngOnInit() {
    this.directions.subscribe(data=>{
      if(data !== null){
        this.leg = data.routes[0].legs[0];
      }
    })
  }

  changeTravelMode(){
    this.ngRedux.dispatch({type: CHANGE_TRAVEL_MODE, payload: this.travelMode})
  }

}
