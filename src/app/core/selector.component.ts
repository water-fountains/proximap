import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutService } from './layout.service';

@Component({
  selector: 'app-select',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css'],
})
export class SelectorComponent<T> {
  @Input() tooltipText!: string;
  @Input() options!: T[];
  @Input() valueObservable!: Observable<T | null>;
  @Input() changeHook!: (value: T) => void;
  @Input() translationPrefix!: string;

  constructor(private layoutService: LayoutService) {}

  changeValue(event: { value: T }): void {
    this.changeHook(event.value);
    this.layoutService.setShowMenu(false);
  }
}
