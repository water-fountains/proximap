/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { MediaMatcher } from '@angular/cdk/layout';
import { IAppState } from './store';
import { CLOSE_NAVIGATION, SELECT_PROPERTY, CLOSE_DETAIL, CLOSE_SIDEBARS, SET_DEVICE } from './actions';
import { FountainPropertyDialogComponent } from './fountain-property-dialog/fountain-property-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogConfig, hideIntroVar } from './constants';
import { IssueListComponent } from './issues/issue-list.component';
import { finalize } from 'rxjs/operators';
import { IntroWindowComponent } from './intro-window/intro-window.component';
import { LanguageService } from './core/language.service';
import { IssueService } from './issues/issue.service';
import { SubscriptionService } from './core/subscription.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SubscriptionService],
})
export class AppComponent implements OnInit {
  title = 'app';
  @select() mode;
  @select() showList;
  @select() showMenu;
  @select() previewState;
  @select() fountainSelector$;
  @select() propertySelected;
  @ViewChild('listDrawer') listDrawer;
  @ViewChild('menuDrawer') menuDrawer;
  @ViewChild('map') map: ElementRef;
  mobileQuery: MediaQueryList;
  wideQuery: MediaQueryList;
  dialogRef: MatDialogRef<IssueListComponent>;
  private broadcastMediaChange: () => void;
  private propertyDialog;
  private propertyDialogIsOpen = false;

  constructor(
    public router: Router,
    public media: MediaMatcher,
    private dialog: MatDialog,
    private ngRedux: NgRedux<IAppState>,
    private languageService: LanguageService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private issueService: IssueService,
    private subscriptionService: SubscriptionService
  ) {
    this.broadcastMediaChange = () => {
      // save to state if app is mobile
      this.ngRedux.dispatch({ type: SET_DEVICE, payload: this.mobileQuery.matches ? 'mobile' : 'desktop' });
    };

    this.mobileQuery = media.matchMedia('(max-width: 900px)');
    this.wideQuery = media.matchMedia('(max-width: 900px)');
    this.iconRegistry.addSvgIcon('cup', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/cup.svg'));
    this.iconRegistry.addSvgIcon('bottle', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/bottle.svg'));
    this.iconRegistry.addSvgIcon(
      'wikipedia',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/wikipedia.svg')
    );
    this.iconRegistry.addSvgIcon(
      'panorama',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/panorama.svg')
    );
    this.iconRegistry.addSvgIcon('osm', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/osm.svg'));
    this.iconRegistry.addSvgIcon(
      'wikidata',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/wikidata.svg')
    );
    this.iconRegistry.addSvgIcon(
      'swimming_place',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/swimming_place.svg')
    );
    this.iconRegistry.addSvgIcon(
      'wikimedia',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/wikimedia.svg')
    );
  }

  ngOnInit(): void {
    this.broadcastMediaChange();
    this.languageService.init();

    this.showList.subscribe(show => {
      if (this.listDrawer) {
        if (this.wideQuery.matches) {
          if (show) {
            this.listDrawer.open({ openedVia: 'mouse' });
          } else {
            this.listDrawer.close();
            // this.map.nativeElement.focus();
          }
        }
      }
    });
    this.showMenu.subscribe(show => {
      if (this.menuDrawer) {
        show ? this.menuDrawer.open() : this.menuDrawer.close();
      }
    });

    this.subscriptionService.registerSubscriptions(
      this.issueService.appErrors.subscribe(list => {
        if (list.length && !this.dialogRef) {
          this.dialogRef = this.dialog.open(IssueListComponent, DialogConfig);

          this.dialogRef.afterClosed().pipe(finalize(() => (this.dialogRef = undefined)));
        }
      })
    );

    // intro dialog for
    setTimeout(() => {
      const hideIntro = localStorage.getItem(hideIntroVar);
      if (hideIntro !== 'true') {
        this.dialog.open(IntroWindowComponent, DialogConfig);
      }
    }, 1000);

    this.propertySelected.subscribe(p => {
      if (p !== null) {
        if (!this.propertyDialogIsOpen) {
          this.propertyDialog = this.dialog.open(FountainPropertyDialogComponent, {
            maxWidth: 1000,
            width: '800px',
          });
          this.propertyDialogIsOpen = true;
        }
        this.propertyDialog.afterClosed().subscribe(() => {
          this.ngRedux.dispatch({ type: SELECT_PROPERTY, payload: null });
          this.propertyDialogIsOpen = false;
        });
      }
    });
  }

  closeSidebars() {
    this.ngRedux.dispatch({ type: CLOSE_SIDEBARS });
  }

  returnToMap() {
    this.ngRedux.dispatch({ type: CLOSE_DETAIL });
  }

  closeNavigation() {
    this.ngRedux.dispatch({ type: CLOSE_NAVIGATION });
  }
}
