import { TestBed, inject } from '@angular/core/testing';

import { RulewbService } from './rulewb.service';

describe('RulewbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RulewbService]
    });
  });

  it('should be created', inject([RulewbService], (service: RulewbService) => {
    expect(service).toBeTruthy();
  }));
});
