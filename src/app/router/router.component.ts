import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from "@angular-redux/store/lib/src";
import {ActivatedRoute, Router} from '@angular/router';
import { RouteValidatorService } from '../services/route-validator.service';
import {FilterCategories, FountainSelector, IAppState} from '../store';
import {Observable} from 'rxjs/index';
import {DataService} from '../data.service';
import _ from 'lodash';


@Component({
  selector: 'app-router',
  templateUrl: './router.component.html',
  styleUrls: ['./router.component.css']
})
export class RouterComponent implements OnInit {
  @select((s: IAppState) => s) appState$:Observable<IAppState>;
  @select('fountainSelected') fountainSelected$;

  constructor(
    private dataService: DataService,
    private route:ActivatedRoute,
    private router:Router,
  private routeValidator: RouteValidatorService,
    private ngRedux: NgRedux<IAppState>
  ) { }

  ngOnInit() {
    this.route.paramMap
      .subscribe(params => {
        let city = params.get('city');
        this.routeValidator.validate('city', city);
      });

    this.route.queryParamMap
      .subscribe(params => {
        this.routeValidator.updateFromRouteParams(params);
      });

    // Update URL to reflect state
    this.appState$.subscribe(state =>{
      this.router.navigate([], {
        queryParams: this.routeValidator.getQueryParams()
      })
    });

    // watch for fountain selection to validate mode
    // this.fountainSelected$.subscribe((f)=>{
    //   if(f !== null){
    //     this.routeValidator.validate('mode', this._mode)
    //   }
    // })
  }
}
