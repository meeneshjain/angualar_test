import { TestBed, inject } from '@angular/core/testing';

import { ModelbomService } from './modelbom.service';

describe('ModelbomService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModelbomService]
    });
  });

  it('should be created', inject([ModelbomService], (service: ModelbomService) => {
    expect(service).toBeTruthy();
  }));
});
