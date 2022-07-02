import { TestBed } from '@angular/core/testing';

import { EatsLocationsService } from './eats-locations.service';

describe('LocationService', () => {
  let service: EatsLocationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EatsLocationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
