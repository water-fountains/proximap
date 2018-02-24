import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {select} from 'ng2-redux';
import {MediaMatcher} from '@angular/cdk/layout';

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
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher){
    this.mobileQuery = media.matchMedia('(max-width: 900px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(){
    this.showList.subscribe((show)=>{
      if(this.mobileQuery.matches){
        show ? this.listDrawer.open() : this.listDrawer.close();
      }

    });

    // open by default if desktop
    setTimeout(()=>{
      if(!this.mobileQuery.matches){
        this.listDrawer.open();
      }
    }, 500);

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
