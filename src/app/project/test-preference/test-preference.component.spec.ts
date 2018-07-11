import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPreferenceComponent } from './test-preference.component';

describe('TestPreferenceComponent', () => {
  let component: TestPreferenceComponent;
  let fixture: ComponentFixture<TestPreferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestPreferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
