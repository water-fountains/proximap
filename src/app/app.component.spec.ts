/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
describe('AppComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AppComponent],
      }).compileComponents();
    })
  );
  it(
    'should create the app',
    waitForAsync(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
    })
  );
  it(
    `should have as title 'app'`,
    waitForAsync(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      expect(app.title).toEqual('app');
    })
  );
  it(
    'should render title in a h1 tag',
    waitForAsync(() => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!');
    })
  );
});
