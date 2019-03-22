import {Component, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {NgRedux, select} from '@angular-redux/store';
import {IAppState} from '../store';
import {PROP_VAL_UNDEFINED} from '../constants'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public fountains = [];
  public PROP_VAL_UNDEFINED = PROP_VAL_UNDEFINED;
  @select() lang;

  constructor(public dataService: DataService, private ngRedux: NgRedux<IAppState>) {

  }

  ngOnInit() {
    this.dataService.fountainsFilteredSuccess.subscribe(data => {
      this.fountains = data;
    });

  }

  public highlightFountain(fountain) {
    this.dataService.highlightFountain(fountain);
  }

}
