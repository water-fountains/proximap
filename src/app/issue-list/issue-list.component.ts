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
import {DataIssue, PropertyMetadata} from '../types';
import {translateExpression} from '@angular/compiler-cli/src/ngtsc/transform/src/translator';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material';
import {Data} from '@angular/router';
import {Observable} from 'rxjs/internal/Observable';

@Component({
  selector: 'issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent {
  @select('dataIssues') dataIssues$:Observable<DataIssue[]>;
  @select('lang') lang$;
  @select('city') city$;
  // issue_count:number;

  constructor() {
  }

}
