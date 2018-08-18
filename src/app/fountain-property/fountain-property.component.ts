import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {FountainPropertyDialogComponent} from '../fountain-property-dialog/fountain-property-dialog.component';
import {NgRedux} from '@angular-redux/store';

export interface FountainProperty{
  value:any,
  source_url?: string,
  comment?: string,
  source_name?: string
}

@Component({
  selector: 'f-property',
  templateUrl: './fountain-property.component.html',
  styleUrls: ['./fountain-property.component.css']
})
export class FountainPropertyComponent implements OnInit {
  @Input('prop') p: FountainProperty;

  constructor(public dialog:MatDialog) { }

  ngOnInit() {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FountainPropertyDialogComponent, {
      data: {p: this.p}
    });
  }

}
