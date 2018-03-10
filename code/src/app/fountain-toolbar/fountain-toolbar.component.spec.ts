import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FountainToolbarComponent } from './fountain-toolbar.component';

describe('FountainToolbarComponent', () => {
  let component: FountainToolbarComponent;
  let fixture: ComponentFixture<FountainToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FountainToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FountainToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
