/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {MediaMatcher} from '@angular/cdk/layout';
import {IAppState} from './store';
import {CLOSE_NAVIGATION, SELECT_PROPERTY, CLOSE_DETAIL, CLOSE_SIDEBARS, SET_DEVICE} from './actions';
import {FountainPropertyDialogComponent} from './fountain-property-dialog/fountain-property-dialog.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef} from '@angular/material/dialog';
import { MatIconRegistry} from '@angular/material/icon';
import { Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {DialogConfig, hideIntroVar} from './constants';
import {DataService} from './data.service';
import {IssueListComponent} from './issue-list/issue-list.component';
import {finalize} from 'rxjs/operators';
import {IntroWindowComponent} from './intro-window/intro-window.component';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  @select() mode;
  @select() lang;
  @select() showList;
  @select() showMenu;
  @select() previewState;
  @select() fountainSelector$;
  @select() propertySelected;
  @select( 'appErrors') appErrors$;
  @ViewChild('listDrawer') listDrawer;
  @ViewChild('menuDrawer') menuDrawer;
  @ViewChild('map') map:ElementRef;
  mobileQuery: MediaQueryList;
  wideQuery: MediaQueryList;
  dialogRef: MatDialogRef<IssueListComponent>;
  private broadcastMediaChange: () => void;
  private propertyDialog;
  private introDialog;
  private propertyDialogIsOpen = false;

  constructor(
    private dataService: DataService,
    public router: Router,
    changeDetectorRef: ChangeDetectorRef,
    public media: MediaMatcher,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private ngRedux: NgRedux<IAppState>,
    private translate:  TranslateService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ){
    this.broadcastMediaChange = ()=>{
      // save to state if app is mobile
      this.ngRedux.dispatch({type:SET_DEVICE, payload:this.mobileQuery.matches?'mobile':'desktop'});
    };

    this.mobileQuery = media.matchMedia('(max-width: 900px)');
    this.wideQuery = media.matchMedia('(max-width: 900px)');
    this.iconRegistry.addSvgIcon(
        'cup',
        this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/cup.svg'));
    this.iconRegistry.addSvgIcon(
        'bottle',
        this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/bottle.svg'));
    this.iconRegistry.addSvgIcon(
        'wikipedia',
        this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/wikipedia.svg'));
    this.iconRegistry.addSvgIcon(
        'panorama',
        this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/panorama.svg'));
    this.iconRegistry.addSvgIcon(
        'osm',
        this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/osm.svg'));
    this.iconRegistry.addSvgIcon(
        'wikidata',
        this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/wikidata.svg'));
    this.iconRegistry.addSvgIcon(
        'swimming_place',
        this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/swimming_place.svg'));
    this.iconRegistry.addSvgIcon(
        'wikimedia',
        this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/wikimedia.svg'));
  }

  ngOnInit():void{

    this.broadcastMediaChange();
    //  MultiLanguages functionality default is en (English)
    this.translate.use(this.ngRedux.getState().lang);
    this.lang.subscribe((s) => {
      this.translate.use(s);
    });

    this.showList.subscribe((show) => {
      if (this.wideQuery.matches) {
        if (show) {
          this.listDrawer.open({openedVia: 'mouse'});
        } else {
          this.listDrawer.close();
          // this.map.nativeElement.focus();
        }
      }

    });
    this.showMenu.subscribe((show) => {
      if(this.menuDrawer) {
        show ? this.menuDrawer.open() : this.menuDrawer.close();
      }
    });

    this.appErrors$.subscribe((list)=>{
      if(list.length && !this.dialogRef){
        this.dialogRef = this.dialog.open(IssueListComponent, DialogConfig);

        this.dialogRef.afterClosed().pipe(
          finalize(()=> this.dialogRef = undefined)
        )
      }

    });

    // intro dialog for
    setTimeout(()=>{
      const hideIntro = localStorage.getItem(hideIntroVar);
      if(hideIntro !== 'true'){
        this.introDialog = this.dialog.open(IntroWindowComponent, DialogConfig);
      }
    }, 1000);




    this.propertySelected.subscribe((p) => {
      if (p !== null) {
        if(! this.propertyDialogIsOpen){
          this.propertyDialog = this.dialog.open(FountainPropertyDialogComponent, {
            maxWidth: 1000,
            width: '800px'
          });
          this.propertyDialogIsOpen = true;
        }
        this.propertyDialog.afterClosed().subscribe(() =>{
          this.ngRedux.dispatch({type: SELECT_PROPERTY, payload: null});
          this.propertyDialogIsOpen = false;
        });
      }
    })

  }

  closeSidebars(){
    this.ngRedux.dispatch({type: CLOSE_SIDEBARS})
  }

  returnToMap(){
    this.ngRedux.dispatch({type: CLOSE_DETAIL});
  }

  closeNavigation(){
    this.ngRedux.dispatch({type: CLOSE_NAVIGATION});
  }
}
