import { TestBed, inject } from '@angular/core/testing';

import { FeaturemodelService } from './featuremodel.service';

describe('FeaturemodelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeaturemodelService]
    });
  });

  it('should be created', inject([FeaturemodelService], (service: FeaturemodelService) => {
    expect(service).toBeTruthy();
  }));
});
