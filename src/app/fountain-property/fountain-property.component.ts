import {Component, Input, OnInit} from '@angular/core';

interface Property{
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
  @Input('prop') p: Property;

  constructor() { }

  ngOnInit() {
  }

}
