import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { LanguageService } from './language.service';

@Component({
  selector: 'app-lang-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css'],
})
export class LanguageSelectorComponent {
  @Input() tooltipText: string;

  constructor(private languageService: LanguageService) {}

  public languages: string[] = this.languageService.languages;
  public langObservable: Observable<string> = this.languageService.langObservable;

  changeLocale(lang: string): void {
    this.languageService.changeLang(lang);
  }
}
