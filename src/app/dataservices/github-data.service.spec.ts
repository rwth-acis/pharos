import { TestBed, inject } from '@angular/core/testing';

import { GithubDataService } from './github-data.service';

describe('GithubDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GithubDataService]
    });
  });

  it('should be created', inject([GithubDataService], (service: GithubDataService) => {
    expect(service).toBeTruthy();
  }));
});
