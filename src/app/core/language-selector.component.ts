import { Component } from '@angular/core';
import { LanguageService } from './language.service';
import { LayoutService } from './layout.service';

@Component({
  selector: 'app-lang-select',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css'],
})
export class LanguageSelectorComponent {
  constructor(private languageService: LanguageService, private layoutService: LayoutService) {}

  public languages = this.languageService.languages;
  public langObservable = this.languageService.langObservable;

  changeLocale(event: { value: string }) {
    this.languageService.changeLang(event.value);
    this.layoutService.setShowMenu(false);
  }
}
