import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemcodegenerationComponent } from './itemcodegeneration.component';

describe('ItemcodegenerationComponent', () => {
  let component: ItemcodegenerationComponent;
  let fixture: ComponentFixture<ItemcodegenerationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemcodegenerationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemcodegenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
