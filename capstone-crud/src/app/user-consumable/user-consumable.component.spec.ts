import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserConsumableComponent } from './user-consumable.component';

describe('UserConsumableComponent', () => {
  let component: UserConsumableComponent;
  let fixture: ComponentFixture<UserConsumableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserConsumableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserConsumableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
