
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CourseCrudComponentModule } from './course-crud/course-crud.module';
import { EquipmentCrudComponentModule } from './equipment-crud/equipment-crud.module';
import { ConsumableCrudComponent } from './consumable-crud/consumable-crud.component';
import { MenuComponent } from './menu/menu.component';
import { LoginComponentModule } from './login/login.module';
import { RegisterComponentModule } from './register/register.module';
import { ReportsComponentModule } from './reports/reports.module';
import { TermsAndConditonsComponentModule } from './terms-and-conditons/terms-and-conditions.module';
import { ConsumableReportsComponentModule } from './consumable-reports/consumable-reports.module';
import { ManageUsersComponentModule } from './manage-users/manage-users.module';
import { FacilityCrudComponentModule } from './facility-crud/facility-crud.module';

// USER COMPONENT IMPORTS
import { UserCourseComponentModule } from './user-course/user-course.module';
import { UserEquipmentComponentModule } from './user-equipment/user-equipment.module';
import { UserConsumableComponent } from './user-consumable/user-consumable.component';
import { UserMenuComponentModule } from './user-menu/user-menu.module';
import { UserSurveyComponentModule } from './user-survey/user-survey.module';
import { UserFacilityComponentModule } from './user-facility/user-facility.module';
import { UserProfileComponentModule } from './user-profile/user-profile.module';
// Material Imports

import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ManageUsersComponent } from './manage-users/manage-users.component';

@NgModule({
  declarations: [
    CourseCrudComponentModule,
    EquipmentCrudComponentModule,
    ConsumableCrudComponent,
    MenuComponent,
    LoginComponentModule,
    RegisterComponentModule,
    UserCourseComponentModule,
    UserEquipmentComponentModule,
    UserConsumableComponent,
    UserMenuComponentModule,
    TermsAndConditonsComponentModule,
    ReportsComponentModule,
    ConsumableReportsComponentModule,
    ManageUsersComponentModule,
    FacilityCrudComponentModule,
    UserSurveyComponentModule,
    UserFacilityComponentModule,
    UserProfileComponentModule,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    //   BrowserAnimationsModule,
    MatTableModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatPaginatorModule,
    MatPaginator,
    MatSnackBar,
    NoopAnimationsModule,
  ],
  providers: [HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule {}