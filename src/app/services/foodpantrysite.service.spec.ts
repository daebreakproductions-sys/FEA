import { TestBed } from '@angular/core/testing';

import { FoodPantrySiteService } from './foodpantrysite.service';

describe('FoodPantrySiteService', () => {
  let service: FoodPantrySiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoodPantrySiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
