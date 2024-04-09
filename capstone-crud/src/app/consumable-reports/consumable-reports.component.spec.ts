import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumableReportsComponent } from './consumable-reports.component';

describe('ConsumableReportsComponent', () => {
  let component: ConsumableReportsComponent;
  let fixture: ComponentFixture<ConsumableReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumableReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsumableReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
