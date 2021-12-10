import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { fountainAliases } from '../fountain-aliases';
import { Config, ConfigBasedParserService } from '../core/config-based-parser.service';
import { City } from '../locations';

export const defaultCity: City = 'ch-zh';

const internalCityConfigs = [
  {
    code: 'ch-zh',
    aliases: ['zuerich', 'zuri', 'zürich ', 'zurich', 'zürih', 'züri', 'zueri', 'ch-zh'],
  },
  {
    code: 'ch-ge',
    aliases: ['genève', 'geneve', 'genf', 'geneva', 'cenevre', '/gen%C3%A8ve', 'ch-ge'],
  },
  {
    code: 'ch-bs',
    aliases: ['bale', 'bâle', 'basel', '/b%C3%A2le', 'ch-bs'],
  },
  {
    code: 'ch-lu',
    aliases: ['lucerne', 'luzern', 'ch-lu'],
  },
  {
    code: 'ch-nw',
    aliases: ['nidwalden', 'nidwald', 'nidvaldo', 'sutsilvania', 'ch-nw'],
  },
  {
    code: 'de-hh',
    aliases: ['Hamburg', 'hamburg', 'Hambourg', 'hambourg', 'Amburgo', 'amburgo', 'de-hh'],
  },
  {
    code: 'fr-paris',
    aliases: ['Paris', 'paris', 'Parigi', '75', 'fr-75', 'parigi', 'fr-paris'],
  },
  {
    code: 'in-ch',
    aliases: ['Chennai', 'chennai', 'in-ch'],
  },
  {
    code: 'test',
    aliases: ['Test-City', 'dev', 'dev-city', 'test'],
  },
  {
    code: 'it-roma',
    aliases: ['rome', 'roma', 'rom', 'it-roma'],
  },
  {
    code: 'us-nyc',
    aliases: ['NewYork', 'new_york', 'nyc', 'us-nyc', 'us-ny'],
  },
  {
    code: 'tr-be',
    aliases: ['bergama', 'Pergamon', 'tr-be'],
  },
  {
    code: 'sr-bg',
    aliases: ['Belgrade', 'belgrade', 'beograd', 'sr-bg'],
  },
] as const;
const cityConfigs: readonly Config<City>[] = internalCityConfigs;

// check that city code and aliases don't have an intersection with fountain aliases as the fountain aliases take precedence
const cityConfigCode: Pick<typeof internalCityConfigs[number], 'code'> = { code: internalCityConfigs[0].code };
const cityConfigAlias: Pick<typeof internalCityConfigs[number], 'aliases'> = {
  aliases: internalCityConfigs[0].aliases,
};
type AllCityRelatedIdentifiers = typeof cityConfigCode.code | typeof cityConfigAlias.aliases[number];
const fountainConfigAlias: Pick<typeof fountainAliases[number], 'alias'> = { alias: fountainAliases[0].alias };
type FountainAliases = typeof fountainConfigAlias.alias;

type Overlaps<T extends any[]> = {
  [K in keyof T]: {
    [L in keyof T]: L extends K
      ? never
      : T[K] & T[L] extends never
      ? never
      : ['Elements at indices', K | L, 'both contain', T[K] & T[L]];
  }[number];
}[number];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ExpectNever<_T extends never> = void;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _CheckCityAndFountainDoNotOverlapp = ExpectNever<Overlaps<[AllCityRelatedIdentifiers, FountainAliases]>>;

@Injectable()
export class CityService {
  constructor(private configBasedParser: ConfigBasedParserService) {}

  private readonly citySubject = new BehaviorSubject<City | null>(null);
  get city(): Observable<City | null> {
    return this.citySubject.asObservable();
  }
  setCity(city: City) {
    this.citySubject.next(city);
  }

  parse(value: string | null | undefined): City | undefined {
    return this.configBasedParser.parse(value, cityConfigs);
  }
}
