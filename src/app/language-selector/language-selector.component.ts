import { Component, OnInit } from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {IAppState} from '../store';
import {CHANGE_LANG} from '../actions';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent implements OnInit {
  // Multilingual Integration Work
  public langOpted='en';
  @select() lang;
  public languages = [{ language: "English", code: "en" }, { language: "Deutsch", code: "de" }];

  constructor(private ngRedux: NgRedux<IAppState>) {

  }

  ngOnInit() {
    this.lang.subscribe(l=>{
      if(l !== null){
        this.langOpted = l;
      }
    })
  }

  changeLang() {
    this.ngRedux.dispatch({ type: CHANGE_LANG, payload: this.langOpted })
  }


}
