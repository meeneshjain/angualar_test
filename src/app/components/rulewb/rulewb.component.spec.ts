import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulewbComponent } from './rulewb.component';

describe('RulewbComponent', () => {
  let component: RulewbComponent;
  let fixture: ComponentFixture<RulewbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulewbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulewbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
