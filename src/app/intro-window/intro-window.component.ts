/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */
import { Component } from '@angular/core';
import { hideIntroVar } from '../constants';
import * as sharedConstants from './../../assets/shared-constants.json';

@Component({
  selector: 'app-intro-window',
  templateUrl: './intro-window.component.html',
  styleUrls: ['./intro-window.component.css'],
})
export class IntroWindowComponent {
  hideIntro = false;

  publicSharedConsts = sharedConstants;

  hideIntroForever(): void {
    const value = this.hideIntro ? 'true' : 'false';
    localStorage.setItem(hideIntroVar, value);
  }
}
