import { TestBed, inject } from '@angular/core/testing';

import { FeaturebomService } from './featurebom.service';

describe('FeaturebomService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeaturebomService]
    });
  });

  it('should be created', inject([FeaturebomService], (service: FeaturebomService) => {
    expect(service).toBeTruthy();
  }));
});
