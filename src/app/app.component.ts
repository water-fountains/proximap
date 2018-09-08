import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {MediaMatcher} from '@angular/cdk/layout';
import {IAppState} from './store';
import {CLOSE_NAVIGATION, SELECT_PROPERTY, CLOSE_DETAIL, CLOSE_SIDEBARS} from './actions';
import {FountainPropertyDialogComponent} from './fountain-property-dialog/fountain-property-dialog.component';
import {MatDialog, MatDialogRef} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RouteValidatorService} from './services/route-validator.service';


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
  @ViewChild('listDrawer') listDrawer;
  @ViewChild('menuDrawer') menuDrawer;
  @ViewChild('map') map:ElementRef;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    public router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private dialog: MatDialog,
    private ngRedux: NgRedux<IAppState>,
    private translate:  TranslateService
  ){
    this.mobileQuery = media.matchMedia('(max-width: 900px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {

    //  MultiLanguages functionality default is en (English)
    this.translate.use(this.ngRedux.getState().lang);
    this.lang.subscribe((s) => {
      this.translate.use(s);
    });

    this.showList.subscribe((show) => {
      if (this.mobileQuery.matches) {
        if (show) {
          this.listDrawer.open({openedVia: 'mouse'});
        } else {
          this.listDrawer.close();
          // this.map.nativeElement.focus();
        }
      }

    });
    this.showMenu.subscribe((show) => {
      show ? this.menuDrawer.open() : this.menuDrawer.close();
    });


    this.propertySelected.subscribe((p) => {
      if (p !== null) {
        const dialogRef = this.dialog.open(FountainPropertyDialogComponent);
        dialogRef.afterClosed().subscribe(r =>{
          this.ngRedux.dispatch({type: SELECT_PROPERTY, payload: null})
        })
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

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
