/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { Component, Input } from '@angular/core';
import { propertyStatuses } from '../constants';
import { PropertyMetadata, SourceType } from '../types';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../core/language.service';
import { FountainService } from '../fountain/fountain.service';
import { FountainPropertiesMeta, FountainPropertyMeta } from '../fountain_properties';

@Component({
  selector: 'app-f-property',
  templateUrl: './fountain-property.component.html',
  styleUrls: ['./fountain-property.component.css'],
})
export class FountainPropertyComponent {
  @Input() property!: PropertyMetadata;
  @Input() propertyMetadata!: FountainPropertiesMeta;

  public readonly WARN = propertyStatuses.warning;
  public readonly INFO = propertyStatuses.info;
  public readonly OK = propertyStatuses.ok;

  constructor(
    private translateService: TranslateService,
    private languageService: LanguageService,
    private fountainService: FountainService
  ) {}

  viewProperty(): void {
    this.fountainService.selectProperty(this.property.id);
  }

  // TODO @ralf.hauser: it is in general discouraged to use functions in templates as this needs to be
  // recalculated for every template change, so over and over again where in this case it would suffice to
  // calcuclate it once during onInit or such and only re-calculate if the language changes
  makeTitle(): string {
    // creates title string
    const texts = [];
    const id = this.property.id as keyof FountainPropertiesMeta;
    const sources: SourceType[] = this.propertyMetadata[id].src_pref as SourceType[];
    for (const src of sources) {
      const fountainPropertyMeta = this.propertyMetadata[id] as FountainPropertyMeta;
      const property_txt =
        fountainPropertyMeta.src_config[src].src_instructions[this.languageService.currentLang].join(' > ');
      texts.push(`${property_txt} in ${this.translateService.instant('quicklink.id_' + src)}`);
    }
    return texts.join(' or ');
  }
}
