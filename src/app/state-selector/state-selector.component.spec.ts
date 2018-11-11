import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateSelectorComponent } from './state-selector.component';

describe('StateSelectorComponent', () => {
  let component: StateSelectorComponent;
  let fixture: ComponentFixture<StateSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
