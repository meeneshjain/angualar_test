import { TestBed, inject } from '@angular/core/testing';


import { ItemcodegenerationService } from './itemcodegeneration.service';

describe('ItemcodegenerationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemcodegenerationService]
    });
  });

  it('should be created', inject([ItemcodegenerationService], (service: ItemcodegenerationService) => {
    expect(service).toBeTruthy();
  }));
});
