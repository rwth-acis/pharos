import { TestBed, inject } from '@angular/core/testing';

import { AnnotationsDataService } from './annotations-data.service';

describe('AnnotationsDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnnotationsDataService]
    });
  });

  it('should be created', inject([AnnotationsDataService], (service: AnnotationsDataService) => {
    expect(service).toBeTruthy();
  }));
});
