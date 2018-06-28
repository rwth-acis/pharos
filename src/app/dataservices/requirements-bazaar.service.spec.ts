import { TestBed, inject } from '@angular/core/testing';

import { RequirementsBazaarDataService } from './requirements-bazaar.service';

describe('RequirementsBazaarDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequirementsBazaarDataService]
    });
  });

  it('should be created', inject([RequirementsBazaarDataService], (service: RequirementsBazaarDataService) => {
    expect(service).toBeTruthy();
  }));
});
