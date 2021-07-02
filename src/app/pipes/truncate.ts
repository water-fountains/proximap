/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value, limit = 25, completeWords = false, ellipsis = '...') {
    if (typeof value === 'string') {
      if (completeWords) {
        limit = value.substr(0, 13).lastIndexOf(' ');
      }
      ellipsis = value.length > limit ? ellipsis : '';
      return `${value.substr(0, limit)}${ellipsis}`;
    } else {
      return value;
    }
  }
}
