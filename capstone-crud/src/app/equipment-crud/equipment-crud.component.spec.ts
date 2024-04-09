import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentCrudComponent } from './equipment-crud.component';

describe('EquipmentCrudComponent', () => {
  let component: EquipmentCrudComponent;
  let fixture: ComponentFixture<EquipmentCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentCrudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EquipmentCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
