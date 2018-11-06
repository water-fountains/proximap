import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FountainPropertyDialogComponent } from './fountain-property-dialog.component';

describe('FountainPropertyDialogComponent', () => {
  let component: FountainPropertyDialogComponent;
  let fixture: ComponentFixture<FountainPropertyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FountainPropertyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FountainPropertyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
