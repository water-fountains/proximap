import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-fountain-toolbar',
  templateUrl: './fountain-toolbar.component.html',
  styleUrls: ['./fountain-toolbar.component.css']
})
export class FountainToolbarComponent implements OnInit {
  @Output() detailsToggle = new EventEmitter<boolean>();

  public toggleDetails(){
    this.detailsToggle.emit(true);
  }

  constructor(private dialog: MatDialog) { }


  ngOnInit() {
  }

}
