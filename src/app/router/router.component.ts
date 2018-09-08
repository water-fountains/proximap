import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from "@angular-redux/store/lib/src";
import {ActivatedRoute, Router} from '@angular/router';
import { RouteValidatorService } from '../services/route-validator.service';
import {FountainSelector, IAppState} from '../store';
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
        let lang = params.get('lang');
        this.routeValidator.validate('lang', lang);
        let mode = params.get('mode');
        this.routeValidator.validate('mode', mode);

        // check if fountain is selected
        if(params.keys.indexOf('queryType')>=0){
          let fountainSelector:FountainSelector = {
            queryType: params.get('queryType'),
            database: params.get('database'),
            idval: params.get('idval'),
          };
          let currentSelector = this.ngRedux.getState().fountainSelector;
          if(JSON.stringify(fountainSelector)!== JSON.stringify(currentSelector)){
            this.dataService.selectFountainBySelector(fountainSelector);
          }
        }
      });

    // Update URL to reflect state
    this.appState$.subscribe(state =>{
      this.router.navigate([], {
        queryParams: this.routeValidator.getQueryParams()
      })
    })
  }
}
