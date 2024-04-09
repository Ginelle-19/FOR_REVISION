import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumableCrudComponent } from './consumable-crud.component';

describe('ConsumableCrudComponent', () => {
  let component: ConsumableCrudComponent;
  let fixture: ComponentFixture<ConsumableCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumableCrudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsumableCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
