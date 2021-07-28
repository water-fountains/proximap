import { NgRedux } from '@angular-redux/store';
import { Component } from '@angular/core';
import { TOGGLE_MENU } from '../actions';
import { IAppState } from '../store';
import { LanguageService } from './language.service';

@Component({
  selector: 'app-lang-select',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css'],
})
export class LanguageSelectorComponent {
  constructor(private languageService: LanguageService, private ngRedux: NgRedux<IAppState>) {}

  public languages = this.languageService.languages;
  public langObservable = this.languageService.langObservable;

  changeLocale(event: { value: string }) {
    this.languageService.changeLang(event.value);
    // TODO replace by a service call
    this.ngRedux.dispatch({ type: TOGGLE_MENU, payload: false });
  }
}
