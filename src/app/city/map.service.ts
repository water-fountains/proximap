import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { fountainAliases } from '../fountain-aliases';
import { Config, ConfigBasedParserService } from '../core/config-based-parser.service';
import { City, defaultCityLocationBounds, getCentre, getLocationBounds as getCityBounds } from '../locations';
import { Bounds, LngLat, SharedLocation } from '../types';
import _ from 'lodash';
import { distinctUntilChanged } from 'rxjs/operators';
import { filterUndefined } from '../shared/ObservableExtensions';
import { MapConfig } from '../map/map.config';
import { environment } from '../../environments/environment';

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

export interface MapState {
  bounds: Bounds;
  city: City | undefined;
  location: LngLat;
  zoom: number | 'auto';
}
export type MapStateOmitCalculatedFields = Omit<MapState, 'location'>;

@Injectable()
export class MapService {
  constructor(private configBasedParser: ConfigBasedParserService, private mapConfig: MapConfig) {}

  private stateSubject = new BehaviorSubject<MapState | undefined>(undefined);

  get state(): Observable<MapState> {
    // we don't want to emit the first state where it is undefined
    return this.stateSubject.pipe(filterUndefined());
  }

  updatedStateBasedOnSharedLocation(sharedLocation: SharedLocation, cityIdOrAlias: string | undefined): void {
    const lng = sharedLocation.location.lng;
    const lat = sharedLocation.location.lat;
    let bounds: Bounds;
    const currentState = this.stateSubject.value;
    if (currentState !== undefined && _.isEqual(this.mapStateToSharedLocation(currentState), sharedLocation)) {
      bounds = currentState.bounds;
    } else {
      // we don't know yet what bounds the map has, so we are faking it by using the same area as the default city
      const diffLng = (defaultCityLocationBounds.max.lng - defaultCityLocationBounds.min.lng) / 2.0;
      const diffLat = (defaultCityLocationBounds.max.lat - defaultCityLocationBounds.min.lat) / 2.0;
      bounds = Bounds(LngLat(lng - diffLng, lat - diffLat), LngLat(lng + diffLng, lat + diffLat));
    }

    this.updateState({
      bounds: bounds,
      zoom: sharedLocation.zoom,
      city: this.parseCity(cityIdOrAlias),
    });
  }

  updateState(mapState: MapStateOmitCalculatedFields): void {
    const calculcatedMapState: MapState = this.calculateFields(mapState);

    if (!_.isEqual(calculcatedMapState, this.stateSubject.value)) {
      if (!environment.production) {
        console.log('updating map state to', calculcatedMapState);
      }
      this.stateSubject.next(calculcatedMapState);
    }
  }

  calculateFields(mapState: MapStateOmitCalculatedFields): MapState {
    return { ...mapState, location: getCentre(mapState.bounds) };
  }

  get currentCity(): City | undefined {
    return this.stateSubject.value?.city;
  }
  get city(): Observable<City | undefined> {
    return (
      this.state
        .map(s => s.city)
        // we don't want to propagate a city change if something else changed
        .pipe(distinctUntilChanged())
    );
  }

  get sharedLocation(): Observable<SharedLocation> {
    return (
      this.state
        .map(s => this.mapStateToSharedLocation(s))
        // we don't want to propagate a change if e.g. the bounds change (due to resizing of the browser for instance)
        .pipe(distinctUntilChanged((x, y) => _.isEqual(x, y)))
    );
  }

  private mapStateToSharedLocation(state: MapState): SharedLocation {
    return { location: state.location, zoom: state.zoom };
  }

  parseCity(value: string | null | undefined): City | undefined {
    return this.configBasedParser.parse(value, cityConfigs);
  }

  setCity(city: City) {
    this.updateState({
      city: city,
      bounds: getCityBounds(city),
      // if we have not yet zoomed, then we want to fit to bounds
      zoom: 'auto',
    });
  }
}
