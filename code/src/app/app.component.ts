import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgRedux, select} from 'ng2-redux';
import {MediaMatcher} from '@angular/cdk/layout';
import {IAppState} from './store';
import {TOGGLE_LIST} from './actions';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  @select() mode;
  @select() showList;
  @ViewChild('listDrawer') listDrawer;
  @ViewChild('detailsDrawer') detailsDrawer;
  @ViewChild('map') map:ElementRef;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private ngRedux: NgRedux<IAppState>){
    this.mobileQuery = media.matchMedia('(max-width: 900px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(){
    this.showList.subscribe((show)=>{
      if(this.mobileQuery.matches){
        if(show){
          this.listDrawer.open({openedVia: 'mouse'});
        }else{
          this.listDrawer.close();
          // this.map.nativeElement.focus();
        }
      }

    });
    // open by default if desktop
    setTimeout(()=>{
      if(!this.mobileQuery.matches){
        this.listDrawer.open();
      }
    }, 500);


  }

  closeList(){
    this.ngRedux.dispatch({type: TOGGLE_LIST, payload: false})
  }

  toggleDetails(open){
    if(open){
      this.detailsDrawer.open();
    }else{
      this.detailsDrawer.close();
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
