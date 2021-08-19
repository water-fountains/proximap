/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfig } from '../constants';
import { IssueListComponent } from '../issue-list/issue-list.component';
import { IssueService } from '../issues/issue.service';

@Component({
  selector: 'app-issue-indicator',
  templateUrl: './issue-indicator.component.html',
  styleUrls: ['./issue-indicator.component.css'],
})
export class IssueIndicatorComponent {
  constructor(private dialog: MatDialog, private issueService: IssueService) {}

  appErrorsObservable = this.issueService.appErrors;
  dataIssuesObservable = this.issueService.dataIssues;

  viewIssues(): void {
    this.dialog.open(IssueListComponent, DialogConfig);
  }
}
