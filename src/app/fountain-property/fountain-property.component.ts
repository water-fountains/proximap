/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { Component, Input } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { SELECT_PROPERTY } from '../actions';
import { IAppState } from '../store';
import { propertyStatuses } from '../constants';
import { PropertyMetadata } from '../types';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../core/language.service';

@Component({
  selector: 'app-f-property',
  templateUrl: './fountain-property.component.html',
  styleUrls: ['./fountain-property.component.css'],
})
export class FountainPropertyComponent {
  @Input() property: PropertyMetadata;
  @Input() propMeta: PropertyMetadata;
  @select('fountainSelected') f;

  WARN = propertyStatuses.warning;
  INFO = propertyStatuses.info;
  OK = propertyStatuses.ok;
  title = '';

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private translateService: TranslateService,
    private languageService: LanguageService
  ) {}

  viewProperty(): void {
    // let p = this.ngRedux.getState().fountainSelected.properties[this.pName];
    this.ngRedux.dispatch({ type: SELECT_PROPERTY, payload: this.property.id });
  }

  // TODO @ralf.hauser: it is in general discouraged to use functions in templates as this needs to be
  // recalculated for every template change, so over and over again where in this case it would suffice to
  // calcuclate it once during onInit or such
  makeTitle() {
    // creates title string
    const texts = [];
    for (const src of this.propMeta[this.property.id].src_pref) {
      const property_txt =
        this.propMeta[this.property.id].src_config[src].src_instructions[this.languageService.currentLang].join(' > ');
      texts.push(`${property_txt} in ${this.translateService.instant('quicklink.id_' + src)}`);
    }
    return texts.join(' or ');
  }
}
