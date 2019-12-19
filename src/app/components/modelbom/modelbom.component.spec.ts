import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelbomComponent } from './modelbom.component';

describe('ModelbomComponent', () => {
  let component: ModelbomComponent;
  let fixture: ComponentFixture<ModelbomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelbomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelbomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
