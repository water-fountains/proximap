import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {DESELECT_FOUNTAIN, NAVIGATE_TO_FOUNTAIN, RETURN_TO_ROOT} from '../actions';
import {IAppState} from '../store';
import {DataService} from '../data.service';
import {Feature} from 'geojson';
import {DEFAULT_FOUNTAINS} from '../../assets/defaultData';
import {MatDialogRef} from '@angular/material';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  title = 'This is the detail of fountain ';
  @select('fountainSelected') fountain;
  @select() mode;
  @Output() closeDetails = new EventEmitter<boolean>();


  // deselectFountain(){
  //   this.ngRedux.dispatch({type: DESELECT_FOUNTAIN})
  // }

  closeDetailsEvent(){
    this.closeDetails.emit();
  }


  public navigateToFountain(){
    this.ngRedux.dispatch({type: NAVIGATE_TO_FOUNTAIN});
  }

  public returnToRoot(){
    this.ngRedux.dispatch({type: RETURN_TO_ROOT});
  }

  constructor(
    private ngRedux: NgRedux<IAppState>,
    // public dialogRef: MatDialogRef<DetailComponent>
  ) { }

  ngOnInit() {
    this.mode.subscribe(mode => {
      if (mode == 'map'){
        this.closeDetails.emit();
      }
    })
  }

}
