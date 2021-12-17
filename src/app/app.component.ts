/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FountainPropertyDialogComponent } from './fountain/fountain-property-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogConfig, hideIntroVar } from './constants';
import { IssueListComponent } from './issues/issue-list.component';
import { finalize } from 'rxjs/operators';
import { IntroWindowComponent } from './intro-window/intro-window.component';
import { LanguageService } from './core/language.service';
import { IssueService } from './issues/issue.service';
import { SubscriptionService } from './core/subscription.service';
import { LayoutService } from './core/layout.service';
import { FountainService } from './fountain/fountain.service';
import { MatSidenav } from '@angular/material/sidenav';
import { filterUndefined } from './shared/ObservableExtensions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SubscriptionService],
})
export class AppComponent implements OnInit {
  @ViewChild('listDrawer') listDrawer?: MatSidenav;
  @ViewChild('menuDrawer') menuDrawer?: MatSidenav;
  @ViewChild('map') map!: ElementRef;

  private dialogRef!: MatDialogRef<IssueListComponent> | undefined;
  private propertyDialog!: MatDialogRef<FountainPropertyDialogComponent>;
  private propertyDialogIsOpen = false;

  constructor(
    private subscriptionService: SubscriptionService,
    private dialog: MatDialog,
    private languageService: LanguageService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,

    private issueService: IssueService,
    private layoutService: LayoutService,
    private fountainService: FountainService
  ) {
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
  isMobile = this.layoutService.isMobile;
  previewStateObservable = this.layoutService.previewState;
  modeObservable = this.layoutService.mode;
  fountainSelectorObservable = this.fountainService.fountainSelector;

  ngOnInit(): void {
    this.languageService.init();

    this.subscriptionService.registerSubscriptions(
      this.layoutService.showList
        .switchMap(show =>
          // we only want to know the current state not trigger an update on each isMobile change, hence the switchMap and not combineLatest
          this.layoutService.isMobile.map(isMobile => [show, isMobile] as [any, boolean])
        )
        .subscribe(([show, isMobile]) => {
          if (this.listDrawer !== undefined && isMobile) {
            if (show) {
              this.listDrawer.open('mouse');
            } else {
              this.listDrawer.close();
              // this.map.nativeElement.focus();
            }
          }
        }),
      this.layoutService.showMenu.subscribe(show => {
        if (this.menuDrawer) {
          show ? this.menuDrawer.open() : this.menuDrawer.close();
        }
      }),
      this.issueService.appErrors.subscribe(list => {
        if (list.length && !this.dialogRef) {
          this.dialogRef = this.dialog.open(IssueListComponent, DialogConfig);

          this.dialogRef.afterClosed().pipe(finalize(() => (this.dialogRef = undefined)));
        }
      }),
      this.fountainService.selectedProperty
        .pipe(filterUndefined())
        .switchMap(_ => {
          if (!this.propertyDialogIsOpen) {
            this.propertyDialog = this.dialog.open(FountainPropertyDialogComponent, {
              maxWidth: 1000,
              width: '800px',
            });
            this.propertyDialogIsOpen = true;
          }
          return this.propertyDialog.afterClosed().tap(() => {
            this.fountainService.deselectProperty();
            this.propertyDialogIsOpen = false;
          });
        })
        .subscribe(_ => undefined /* nothing to do in addition as side effect happens in switchMap and tap */)
    );

    // intro dialog for
    setTimeout(() => {
      const hideIntro = localStorage.getItem(hideIntroVar);
      if (hideIntro !== 'true') {
        this.dialog.open(IntroWindowComponent, DialogConfig);
      }
    }, 1000);
  }

  closeSidebars(): void {
    this.layoutService.closeSidebars();
  }

  returnToMap(): void {
    this.layoutService.closeDetail();
  }

  closeNavigation(): void {
    this.layoutService.closeNavigation();
  }
}
