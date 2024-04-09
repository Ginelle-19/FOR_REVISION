import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CourseCrudComponent } from './course-crud/course-crud.component';
import { EquipmentCrudComponent } from './equipment-crud/equipment-crud.component';
import { ConsumableCrudComponent } from './consumable-crud/consumable-crud.component';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UserCourseComponent } from './user-course/user-course.component';
import { UserEquipmentComponent } from './user-equipment/user-equipment.component';
import { UserConsumableComponent } from './user-consumable/user-consumable.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { TermsAndConditonsComponent } from './terms-and-conditons/terms-and-conditons.component';
import { ReportsComponent } from './reports/reports.component';
import { ConsumableReportsComponent } from './consumable-reports/consumable-reports.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { AdminManageUsersComponent } from './admin-manage-users/admin-manage-users.component';
import { AdminMenuComponent } from './admin-menu/admin-menu.component';
import { FacilityCrudComponent } from './facility-crud/facility-crud.component';
import { ProfileComponent } from './profile/profile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    CourseCrudComponent, 
    EquipmentCrudComponent, 
    ConsumableCrudComponent,
    MenuComponent, 
    AdminMenuComponent,
    RouterModule, 
    LoginComponent, 
    UserCourseComponent,
    UserEquipmentComponent,
    UserConsumableComponent,
    UserMenuComponent, 
    TermsAndConditonsComponent,
    ReportsComponent,
    ConsumableReportsComponent,
    ManageUsersComponent,
    AdminManageUsersComponent
    // ProfileComponent
    // FacilityCrudComponent
  
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'capstone-crud';
  constructor(public authService: AuthService) {}
  
}
