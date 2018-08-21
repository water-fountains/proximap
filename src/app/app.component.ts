import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {MediaMatcher} from '@angular/cdk/layout';
import {IAppState} from './store';
import {TOGGLE_LIST, RETURN_TO_ROOT, CLOSE_NAVIGATION, SELECT_PROPERTY} from './actions';
import {FountainPropertyDialogComponent} from './fountain-property-dialog/fountain-property-dialog.component';
import {MatDialog, MatDialogRef} from '@angular/material';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  @select() mode;
  @select() showList;
  @select() showMenu;
  @select() previewState;
  @select() propertySelected;
  @ViewChild('listDrawer') listDrawer;
  @ViewChild('menuDrawer') menuDrawer;
  @ViewChild('map') map:ElementRef;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private dialog: MatDialog,
    private ngRedux: NgRedux<IAppState>){
    this.mobileQuery = media.matchMedia('(max-width: 900px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
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

  closeList(){
    this.ngRedux.dispatch({type: TOGGLE_LIST, payload: false})
  }

  returnToRoot(){
    this.ngRedux.dispatch({type: RETURN_TO_ROOT});
  }

  closeNavigation(){
    this.ngRedux.dispatch({type: CLOSE_NAVIGATION});
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
