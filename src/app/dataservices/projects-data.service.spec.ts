import { TestBed, inject } from '@angular/core/testing';

import { ProjectsDataService } from './projects-data.service';

describe('ProjectsDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectsDataService]
    });
  });

  it('should be created', inject([ProjectsDataService], (service: ProjectsDataService) => {
    expect(service).toBeTruthy();
  }));
});
