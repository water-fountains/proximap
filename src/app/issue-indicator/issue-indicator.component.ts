/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { NgRedux, select } from '@angular-redux/store';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfig } from '../constants';
import { IssueListComponent } from '../issue-list/issue-list.component';
import { IssueService } from '../issues/issue.service';
import { IAppState } from '../store';

@Component({
  selector: 'app-issue-indicator',
  templateUrl: './issue-indicator.component.html',
  styleUrls: ['./issue-indicator.component.css'],
})
export class IssueIndicatorComponent {
  @select('dataIssues') dataIssues$;

  constructor(private ngRedux: NgRedux<IAppState>, private dialog: MatDialog, private issueService: IssueService) {
    //ngRedux is used implicitly via select, this is only for the compiler - I guess we could already remove it but I keep it to avoid unnecessary side effects (of the removal)
    this.ngRedux.getState();
  }
  appErrorsObservable = this.issueService.appErrors;

  viewIssues(): void {
    this.dialog.open(IssueListComponent, DialogConfig);
  }
}
