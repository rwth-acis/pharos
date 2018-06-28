import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateImageScreenComponent } from './update-image-screen.component';

describe('UpdateImageScreenComponent', () => {
  let component: UpdateImageScreenComponent;
  let fixture: ComponentFixture<UpdateImageScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateImageScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateImageScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
