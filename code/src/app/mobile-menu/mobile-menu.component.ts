import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {select} from 'ng2-redux';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.css']
})
export class MobileMenuComponent implements OnInit {
  @select() lang;
  @Output() menuToggle = new EventEmitter<boolean>()

  constructor() { }

  toggleMenu(){
    this.menuToggle.emit(true);
  }

  ngOnInit() {
  }

}
