import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {IAppState} from '../store';
import {CHANGE_LANG} from '../actions';
import {Router} from '@angular/router';
import {RouteValidatorService} from '../services/route-validator.service';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LanguageSelectorComponent implements OnInit {
  // Multilingual Integration Work
  public langOpted='en';
  @select() lang;
  public languages = [{ language: "English", code: "en" }, { language: "Deutsch", code: "de" }];

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private router: Router,
    private routeService: RouteValidatorService
  ) {

  }

  ngOnInit() {
    this.lang.subscribe(l=>{
      if(l !== null){
        this.langOpted = l;
      }
    })
  }

  changeLang() {
    let params = this.routeService.getQueryParams();
    params.lang = this.langOpted;
    this.router.navigate([this.ngRedux.getState().city], {queryParams:params});
  }


}
