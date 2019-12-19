import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDialogsComponent } from './custom-dialogs.component';

describe('CustomDialogsComponent', () => {
  let component: CustomDialogsComponent;
  let fixture: ComponentFixture<CustomDialogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomDialogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDialogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
