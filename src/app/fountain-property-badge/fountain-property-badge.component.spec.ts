/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FountainPropertyBadgeComponent } from './fountain-property-badge.component';

describe('FountainPropertyBadgeComponent', () => {
  let component: FountainPropertyBadgeComponent;
  let fixture: ComponentFixture<FountainPropertyBadgeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FountainPropertyBadgeComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FountainPropertyBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
