import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeDe from '@angular/common/locales/de';
import localeIt from '@angular/common/locales/it';
import localeTr from '@angular/common/locales/tr';
import { BehaviorSubject, Observable } from 'rxjs';

const defaultLang = 'de';
// the given order of the language codes here
// determines the order in the language dropdown
const languageConfig = [
  {
    code: 'en',
    aliases: ['english', 'anglais', 'englisch', 'en', 'e'],
  },
  {
    code: 'de',
    aliases: ['german', 'allemand', 'deutsch', 'de', 'd'],
  },
  {
    code: 'fr',
    aliases: ['french', 'französisch', 'franzoesisch', 'francais', 'fr', 'f'],
  },
  {
    code: 'it',
    aliases: ['italian', 'italiano', 'italien', 'italienisch', 'it', 'i'],
  },
  {
    code: 'tr',
    aliases: ['turc', 'türkisch', 'turco', 'turkish', 'tr', 't'],
  },
  {
    code: 'sr',
    aliases: ['srpski', 'serbian', 'serbian', 'sr', 'srb'],
  },
];

@Injectable()
export class LanguageService {
  languages: string[] = languageConfig.map(l => l.code);

  private langSubject = new BehaviorSubject(defaultLang);

  constructor(private translateService: TranslateService) {}

  init(): void {
    // Register locales
    //TODO #394 @ralf.hauser, misses sr, on purpose?
    registerLocaleData(localeDe, 'de');
    registerLocaleData(localeFr, 'fr');
    registerLocaleData(localeIt, 'it');
    registerLocaleData(localeTr, 'tr');

    this.translateService.addLangs(this.languages);
    this.translateService.setDefaultLang(defaultLang);
    const currentLang = this.determineCurrentLang();
    this.translateService.use(currentLang);
  }

  changeLang(newLang: string): void {
    const lang = this.parseLang(newLang);
    if (lang === undefined) {
      throw new Error('given language is not supported: ' + newLang);
    }
    if (this.langSubject.value !== lang) {
      this.translateService.use(lang);
      this.langSubject.next(lang);
      //TODO #359 store choice in localStorage
    }
  }

  determineCurrentLang(): string {
    //TODO #395 and #369 use preferred language according to last chosen language and infer from browser on first visit
    return defaultLang;
  }

  private parseLang(lang: string | undefined): string | undefined {
    if (lang === undefined || lang === null) return undefined;

    const langLower = lang.toLowerCase();
    return languageConfig.find(x => x.aliases.includes(langLower))?.code;
  }

  get currentLang(): string {
    return this.langSubject.value;
  }

  get langObservable(): Observable<string> {
    return this.langSubject.asObservable();
  }
}
