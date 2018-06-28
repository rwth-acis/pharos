import { TestBed, inject } from '@angular/core/testing';

import { FeedbackDataService } from './feedback-data.service';

describe('FeedbackDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeedbackDataService]
    });
  });

  it('should be created', inject([FeedbackDataService], (service: FeedbackDataService) => {
    expect(service).toBeTruthy();
  }));
});
