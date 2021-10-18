import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeDe from '@angular/common/locales/de';
import localeIt from '@angular/common/locales/it';
import localeTr from '@angular/common/locales/tr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Config, ConfigBasedParserService } from './config-based-parser.service';
import { Translated } from '../locations';

// TODO @ralf.hauser this types, const should be shared with datablue/shared-constans.ts
export const AVAILABLE_LANGS = ['en', 'de', 'fr', 'it', 'tr' /*, 'sr'*/] as const;
export type Lang = typeof AVAILABLE_LANGS[number];

// check that we cover all Lang which are defined in Translated and vice versa
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _checkLangAndTranslatedInSync1: Lang = 'en' as keyof Translated<unknown>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _checkLangAndTranslatedInSync2: keyof Translated<unknown> = 'en' as Lang;

export function toLang(lang: string | undefined): Lang | undefined {
  return isLang(lang) ? lang : undefined;
}
function isLang(lang: string | undefined): lang is Lang {
  return lang !== undefined && AVAILABLE_LANGS.includes(lang as Lang);
}

const defaultLang: Lang = 'de';
// the given order of the language codes here
// determines the order in the language dropdown
const languageConfig: Config<Lang>[] = [
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
  // {
  //   code: 'sr',
  //   aliases: ['srpski', 'serbian', 'serbian', 'sr', 'srb'],
  // },
];

@Injectable()
export class LanguageService {
  languages: Lang[] = languageConfig.map(l => l.code);

  private langSubject: BehaviorSubject<Lang> = new BehaviorSubject(defaultLang);

  constructor(private translateService: TranslateService, private configBasedParser: ConfigBasedParserService) {}

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
    const lang = toLang(this.configBasedParser.parse(newLang, languageConfig));
    if (!lang) {
      throw new Error('given language is not supported: ' + newLang);
    } else {
      if (this.langSubject.value !== lang) {
        this.translateService.use(lang);
        this.langSubject.next(lang);
        //TODO #359 store choice in localStorage
      }
    }
  }

  determineCurrentLang(): Lang {
    //TODO #395 and #369 use preferred language according to last chosen language and infer from browser on first visit
    return defaultLang;
  }

  /**
   * Returns the current language - use langObserable if you want to react to changes
   */
  get currentLang(): Lang {
    return this.langSubject.value;
  }

  get langObservable(): Observable<Lang> {
    return this.langSubject.asObservable();
  }
}
