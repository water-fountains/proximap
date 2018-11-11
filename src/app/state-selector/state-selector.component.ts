import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {IAppState} from '../store';
import {CHANGE_LANG} from '../actions';
import {Router} from '@angular/router';
import {RouteValidatorService} from '../services/route-validator.service';

@Component({
  selector: 'app-state-selector',
  templateUrl: './state-selector.component.html',
  styleUrls: ['./state-selector.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StateSelectorComponent implements OnInit {
  // Multilingual Integration Work
  public opted;
  @Input('controlVariable') controlVariable: string;
  public options = {
    lang: [{ display: "English", code: "en" }, { display: "Deutsch", code: "de" }],
    city: [{ display: "Zürich", code: "zurich" }, { display: "Genève", code: "geneva"}, { display: "Basel", code: "basel"}]
  };

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private router: Router,
    private routeValidator: RouteValidatorService
  ) {

  }

  ngOnInit() {
    // apply app state to selector
    this.ngRedux.select(this.controlVariable).subscribe(l=>{
      if(l !== null){
        this.opted = l;
      }
    })
  }

  changeValue() {
    // update route from selector. The app state will then be updated.
    this.routeValidator.validate(this.controlVariable, this.opted)
  }


}
