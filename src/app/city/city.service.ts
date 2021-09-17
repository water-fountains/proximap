import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Config } from '../core/config-based-parser.service';
import { City } from '../locations';

export const defaultCity: City = 'ch-zh';

export const cityConfigs: Config<City>[] = [
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
];

@Injectable()
export class CityService {
  private readonly citySubject = new BehaviorSubject<City | null>(null);
  get city(): Observable<City | null> {
    return this.citySubject.asObservable();
  }
  setCity(city: City) {
    this.citySubject.next(city);
  }
}
