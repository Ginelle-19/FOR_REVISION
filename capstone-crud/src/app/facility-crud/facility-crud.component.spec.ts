import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityCrudComponent } from './facility-crud.component';

describe('FacilityCrudComponent', () => {
  let component: FacilityCrudComponent;
  let fixture: ComponentFixture<FacilityCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilityCrudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacilityCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
