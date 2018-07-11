import { TestBed, inject } from '@angular/core/testing';

import { VersionsDataService } from './versions-data.service';

describe('VersionsDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VersionsDataService]
    });
  });

  it('should be created', inject([VersionsDataService], (service: VersionsDataService) => {
    expect(service).toBeTruthy();
  }));
});
