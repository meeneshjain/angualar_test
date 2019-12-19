import { TestBed, inject } from '@angular/core/testing';

import { ArchivingService } from './archiving.service';

describe('ArchivingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArchivingService]
    });
  });

  it('should be created', inject([ArchivingService], (service: ArchivingService) => {
    expect(service).toBeTruthy();
  }));
});
