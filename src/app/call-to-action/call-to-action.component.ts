/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */
import { Component, Input } from '@angular/core';
import { FountainService } from '../fountain/fountain.service';
import { PropertyMetadata } from '../types';

@Component({
  selector: 'app-call-to-action',
  templateUrl: './call-to-action.component.html',
  styleUrls: ['./call-to-action.component.css'],
})
export class CallToActionComponent {
  @Input() property!: PropertyMetadata;

  constructor(private fountainService: FountainService) {}

  // created for #120
  viewProperty(): void {
    this.fountainService.selectProperty(this.property.id);
  }
}
