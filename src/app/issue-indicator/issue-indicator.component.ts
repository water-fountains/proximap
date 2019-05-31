/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import {Component, Input, OnInit} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {SELECT_PROPERTY} from '../actions';
import {IAppState} from '../store';
import {DialogConfig, propertyStatuses} from '../constants';
import {PropertyMetadata} from '../types';
import {translateExpression} from '@angular/compiler-cli/src/ngtsc/transform/src/translator';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material';
import {IssueListComponent} from '../issue-list/issue-list.component';

@Component({
  selector: 'issue-indicator',
  templateUrl: './issue-indicator.component.html',
  styleUrls: ['./issue-indicator.component.css']
})
export class IssueIndicatorComponent implements OnInit {
  @select('dataIssues') dataIssues$;
  @select('lang') lang$;
  // issue_count:number;

  constructor(private ngRedux: NgRedux<IAppState>,
              private dialog: MatDialog,
              private translateService: TranslateService) {
  }

  ngOnInit() {
  }

  viewIssues(): void {
    this.dialog.open(IssueListComponent, DialogConfig);
  }

}
