import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatBottomSheet} from '@angular/material';
import {FountainProperty} from '../fountain-property/fountain-property.component';
import {select} from '@angular-redux/store';
import {GuideSelectorComponent} from '../guide/guide.component';

interface DialogData {
  pName: string;
}

@Component({
  selector: 'app-fountain-property-dialog',
  templateUrl: './fountain-property-dialog.component.html',
  styleUrls: ['./fountain-property-dialog.component.css']
})
export class FountainPropertyDialogComponent implements OnInit {
  @select('fountainSelected') fountain;
  p: FountainProperty;

  constructor(
    private bottomSheet: MatBottomSheet,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {

    this.fountain.subscribe(f=>{
      if(f !== null && this.data.pName !== null){
        this.p = f.properties[this.data.pName];
      }
    })
  }

  openGuideSelector() {
    this.bottomSheet.open(GuideSelectorComponent);
  }

}
