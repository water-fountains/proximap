import { Component, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LayoutService } from './layout.service';

@Component({
  selector: 'app-select',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css'],
})
export class SelectorComponent<T> {
  @Input() tooltipText = '';
  @Input() options: T[] = [];
  @Input() valueObservable: Observable<T | undefined> = of();
  @Input() changeHook: ((value: T) => void) | undefined;
  @Input() translationPrefix = '';
  @Input() pleaseSelectKey = '';

  constructor(private layoutService: LayoutService) {}

  changeValue(event: { value: T }): void {
    if (this.changeHook) {
      this.changeHook(event.value);
    }
    this.layoutService.setShowMenu(false);
  }
}
