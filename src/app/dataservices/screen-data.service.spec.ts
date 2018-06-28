import { TestBed, inject } from '@angular/core/testing';

import { ScreenDataService } from './screen-data.service';

describe('ScreenDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScreenDataService]
    });
  });

  it('should be created', inject([ScreenDataService], (service: ScreenDataService) => {
    expect(service).toBeTruthy();
  }));
});
