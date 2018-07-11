import { TestBed, inject } from '@angular/core/testing';

import { CommentDataService } from './comment-data.service';

describe('CommentDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommentDataService]
    });
  });

  it('should be created', inject([CommentDataService], (service: CommentDataService) => {
    expect(service).toBeTruthy();
  }));
});
