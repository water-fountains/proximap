/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { Component } from '@angular/core';
import { IssueService } from '../issues/issue.service';
import { CityService } from '../city/city.service';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css'],
})
export class IssueListComponent {
  constructor(private issueService: IssueService, private cityService: CityService) {}
  appErrorsObservable = this.issueService.appErrors;
  dataIssuesObservable = this.issueService.dataIssues;
  cityObservable = this.cityService.city;
}
