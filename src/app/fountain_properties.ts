/*
 * @license
 * (c) Copyright 2019 - 2020 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 *
 * Each time you change the datablue/config/fountain.properties.js, you need to run
 *
 *   ~/git/proximap$ npm run sync_datablue for=fountains
 */

// import fountain_properties.json from assets folder.
import { Translated } from './locations';
import { SourceType, PropStatus, ImageLikeCollection } from './types';
import * as fountainPropertiesJSON from './../assets/fountain_properties.json';

/**
 * Copied over from fountain.properties.ts
 */

export interface NamedSources<W, O> {
  wikidata: W;
  osm: O;
}

export interface SourceConfig<V, RE> {
  src_path: string[];
  src_instructions: Translated<string[]>;
  value_translation: (values: V) => any | null;

  help?: string;
  extraction_info?: Translated<string> | Translated<string[]>;
  src_info?: Translated<string>;
  src_path1?: string[];
  src_path_extra?: string[];
  value_translation_extra?: (text: string) => RE | null;
  //TODO see if we get official types
  properties?: {
    image: string;
    wikimedia_commons?: any;
    man_made?: 'drinking_fountain' | 'water_tap' | 'water_well';
    amenity?: 'drinking_water' | 'water_point' | 'watering_place' | 'fountain';
    natural?: 'spring';
  };
}
export interface SCL {
  s: string;
  c: string;
  l: number;
}

export interface FountainPropertyMetaUnfinished<W, O> {
  name: Translated<string>;
  essential: boolean;
  type: string;
  descriptions: Translated<string>;
  src_pref: SourceType[];
  src_config: NamedSources<W, O>;
}

export interface FountainPropertyMeta<
  WC = any[],
  OC = string,
  WER = string,
  OER = string,
  W extends SourceConfig<WC, WER> | null = SourceConfig<WC, WER>,
  O extends SourceConfig<OC, OER> | null = SourceConfig<OC, OER>
> extends FountainPropertyMetaUnfinished<W, O> {
  id: string;
  value: any | null;
  comments: string;
  status: PropStatus;
  source: string;
}

type FountainPropertyMetaWikiOnly<WC = any[], WER = string> = FountainPropertyMeta<
  WC,
  string,
  WER,
  string,
  SourceConfig<WC, WER>,
  null
>;
type FountainPropertyMetaOsmOnly<OC = any[], OER = string> = FountainPropertyMeta<
  any[],
  OC,
  string,
  OER,
  null,
  SourceConfig<OC, OER>
>;

export interface FountainPropertiesMeta {
  name: FountainPropertyMeta;
  name_en: FountainPropertyMeta;
  name_de: FountainPropertyMeta;
  name_fr: FountainPropertyMeta;
  name_it: FountainPropertyMeta;
  name_tr: FountainPropertyMeta;
  description_short_en: FountainPropertyMeta;
  description_short_de: FountainPropertyMeta;
  description_short_fr: FountainPropertyMeta;
  description_short_it: FountainPropertyMeta;
  description_short_tr: FountainPropertyMeta;
  id_osm: FountainPropertyMeta<any[], string, string, string, null, SourceConfig<string, string>>;
  id_operator: FountainPropertyMeta;
  id_wikidata: FountainPropertyMeta;
  construction_date: FountainPropertyMeta;
  removal_date: FountainPropertyMetaWikiOnly;
  artist_name: FountainPropertyMeta;
  availability: FountainPropertyMetaOsmOnly;
  floor_level: FountainPropertyMetaOsmOnly;
  fixme: FountainPropertyMetaOsmOnly;
  directions: FountainPropertyMetaWikiOnly;
  pano_url: FountainPropertyMetaWikiOnly;
  featured_image_name: FountainPropertyMeta<string, string, ImageLikeCollection, ImageLikeCollection>;
  coords: FountainPropertyMeta;
  water_type: FountainPropertyMeta;
  wiki_commons_name: FountainPropertyMeta<any[], string, SCL[], SCL[]>;
  wikipedia_en_url: FountainPropertyMeta;
  wikipedia_de_url: FountainPropertyMeta;
  wikipedia_fr_url: FountainPropertyMeta;
  wikipedia_it_url: FountainPropertyMeta;
  wikipedia_tr_url: FountainPropertyMeta;
  operator_name: FountainPropertyMeta;
  access_pet: FountainPropertyMetaOsmOnly;
  access_bottle: FountainPropertyMetaOsmOnly;
  access_wheelchair: FountainPropertyMetaOsmOnly;
  potable: FountainPropertyMetaOsmOnly;
  potable_controlled: FountainPropertyMetaOsmOnly;
  water_flow: FountainPropertyMetaOsmOnly;
  swimming_place: FountainPropertyMetaWikiOnly;
  described_at_url: FountainPropertyMetaWikiOnly;
  youtube_video_id: FountainPropertyMetaWikiOnly;
}

export const fountainProperties: FountainPropertiesMeta = fountainPropertiesJSON as FountainPropertiesMeta;
