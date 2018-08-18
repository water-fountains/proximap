import { TestBed, inject } from '@angular/core/testing';

import { RouteCheckerService } from './route-checker.service';

describe('RouteCheckerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RouteCheckerService]
    });
  });

  it('should be created', inject([RouteCheckerService], (service: RouteCheckerService) => {
    expect(service).toBeTruthy();
  }));
});
