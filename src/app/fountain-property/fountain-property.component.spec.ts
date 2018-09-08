import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FountainPropertyComponent } from './fountain-property.component';

describe('FountainPropertyComponent', () => {
  let component: FountainPropertyComponent;
  let fixture: ComponentFixture<FountainPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FountainPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FountainPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
