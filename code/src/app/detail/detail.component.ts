import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NgRedux, select} from 'ng2-redux';
import {DESELECT_FOUNTAIN} from '../actions';
import {IAppState} from '../store';
import {DataService} from '../data.service';
import {Feature} from 'geojson';
import {DEFAULT_FOUNTAINS} from '../../assets/defaultData';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  title = 'This is the detail of fountain ';
  @select('fountainSelected') fountain;


  deselectFountain(){
    this.ngRedux.dispatch({type: DESELECT_FOUNTAIN})
  }

  constructor(
    private ngRedux: NgRedux<IAppState>) { }

  ngOnInit() {
  }

}
