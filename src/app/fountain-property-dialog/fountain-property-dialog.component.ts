import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FountainProperty} from '../fountain-property/fountain-property.component';

interface DialogData {
  p: FountainProperty;
}

@Component({
  selector: 'app-fountain-property-dialog',
  templateUrl: './fountain-property-dialog.component.html',
  styleUrls: ['./fountain-property-dialog.component.css']
})
export class FountainPropertyDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FountainPropertyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {
  }

}
