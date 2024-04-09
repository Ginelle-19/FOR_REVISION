
import { Routes, RouterModule } from '@angular/router';
import { CourseCrudComponent } from './course-crud/course-crud.component';
import { EquipmentCrudComponent } from './equipment-crud/equipment-crud.component';
import { ConsumableCrudComponent } from './consumable-crud/consumable-crud.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { AuthGuard } from './services/auth.guard';
import { RegisterComponent } from './register/register.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { UserCourseComponent } from './user-course/user-course.component';
import { UserConsumableComponent } from './user-consumable/user-consumable.component';
import { UserEquipmentComponent } from './user-equipment/user-equipment.component';
import { TermsAndConditonsComponent } from './terms-and-conditons/terms-and-conditons.component';
import { ReportsComponent } from './reports/reports.component';
import { ConsumableReportsComponent } from './consumable-reports/consumable-reports.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { FacilityCrudComponent } from './facility-crud/facility-crud.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminMenuComponent } from './admin-menu/admin-menu.component';
import { AdminManageUsersComponent } from './admin-manage-users/admin-manage-users.component';
import { UserFacilityComponent } from './user-facility/user-facility.component';
import { UserSurveyComponent } from './user-survey/user-survey.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

export const routes: Routes = [
  {
    path: 'menu',
    component: MenuComponent,
    title: 'Dashboard',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'courses',
        component: CourseCrudComponent,
        title: 'Home Page',
      },
      {
        path: 'equipments',
        component: EquipmentCrudComponent,
        title: 'Equipments',
      },
      {
        path: 'consumables',
        component: ConsumableCrudComponent,
        title: 'Consumables',
      },
      {
        path: 'reports',
        component: ReportsComponent,
        title: 'Equipment Reports',
      },
      {
        path: 'consumableReports',
        component: ConsumableReportsComponent,
        title: 'Consumable Reports',
      },
      {
        path: 'manageUsers',
        component: ManageUsersComponent,
        title: 'Manage Users',
      },
      {
        path: 'facilities',
        component: FacilityCrudComponent,
        title: 'Facilities',
      },
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'User Profile',
      },
    ],
  },
  // ROUTING FOR USER LOGIN
  {
    path: 'user-menu',
    component: UserMenuComponent,
    title: 'Dashboard',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'user-courses',
        component: UserCourseComponent,
        title: 'Home Page',
      },
      {
        path: 'user-equipments',
        component: UserEquipmentComponent,
        title: 'Equipments',
      },
      {
        path: 'user-consumables',
        component: UserConsumableComponent,
        title: 'Consumables',
      },
      {
        path: 'user-facilities',
        component: UserFacilityComponent,
        title: 'Facilities',
      },
      {
        path: 'user-survey',
        component: UserSurveyComponent,
        title: 'Survey',
      },
      {
        path: 'user-profile',
        component: UserProfileComponent,
        title: 'User Profile',
      },
    ],
  },

  // ROUTING FOR ADMIN LOGIN
  {
    path: 'admin-menu',
    component: AdminMenuComponent,
    title: 'Dashboard',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'courses',
        component: CourseCrudComponent,
        title: 'Home Page',
      },
      {
        path: 'equipments',
        component: EquipmentCrudComponent,
        title: 'Equipments',
      },
      {
        path: 'consumables',
        component: ConsumableCrudComponent,
        title: 'Consumables',
      },
      {
        path: 'reports',
        component: ReportsComponent,
        title: 'Equipment Reports',
      },
      {
        path: 'consumableReports',
        component: ConsumableReportsComponent,
        title: 'Consumable Reports',
      },
      {
        path: 'adminManageUsers',
        component: AdminManageUsersComponent,
        title: 'Manage Users',
      },
      {
        path: 'facilities',
        component: FacilityCrudComponent,
        title: 'Facilities',
      },
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'User Profile',
      },
    ],
  },

  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: 'register',
    component: RegisterComponent,
    title: 'Sign Up',
  },
  {
    path: 'terms',
    component: TermsAndConditonsComponent,
    title: 'Terms and Conditions',
  },
];