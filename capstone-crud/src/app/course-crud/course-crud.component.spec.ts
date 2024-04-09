import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCrudComponent } from './course-crud.component';

describe('CourseCrudComponent', () => {
  let component: CourseCrudComponent;
  let fixture: ComponentFixture<CourseCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCrudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourseCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
