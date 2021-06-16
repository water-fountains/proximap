/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { NgRedux, select } from '@angular-redux/store';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DialogConfig } from '../constants';
import { IssueListComponent } from '../issue-list/issue-list.component';
import { IAppState } from '../store';

@Component({
  selector: 'app-issue-indicator',
  templateUrl: './issue-indicator.component.html',
  styleUrls: ['./issue-indicator.component.css']
})
export class IssueIndicatorComponent{
  @select('dataIssues') dataIssues$;
  @select('appErrors') appErrors$;
  @select('lang') lang$;

  constructor(private ngRedux: NgRedux<IAppState>,
              private dialog: MatDialog,
              private translateService: TranslateService) {
  }

  viewIssues(): void {
    this.dialog.open(IssueListComponent, DialogConfig);
  }

}
