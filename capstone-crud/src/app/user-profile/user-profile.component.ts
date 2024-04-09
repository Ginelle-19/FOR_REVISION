import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { DatePipe } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    NgxPaginationModule,
  ],
  providers: [DatePipe],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  currentUser: any;
  birthdateError: string = '';
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.refreshUserData();
  }
  userArray: any[] = [];
  isResultLoaded = false;
  isEditMode = false;
  p: number = 1;
  itemsPerPage: number = 7;
  LastName: string = '';
  FirstName: string = '';
  Birthdate: string = '';
  StudentNum: string = '';
  UserName: string = '';
  Password: string = '';
  AccountID!: number;

  loadUserData(): void {
    this.authService.getCurrentUser(this.AccountID).subscribe(
      (userData) => {
        this.currentUser = userData;
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  validateName(name: string): boolean {

    const regex = /^[a-zA-Z\s]*$/;
    return regex.test(name);
  }  

  validateBirthdate() {
    const selectedDate = new Date(this.Birthdate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate >= today) {
      this.birthdateError = 'Birthdate cannot be set to today or the future.';
    } else {
      this.birthdateError = '';
    }
  }

  getAllUsers(): void {
    this.http
      .get('https://ccjeflabsolutions.online:3000/api/users')
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        this.userArray = resultData.data;

        const currentUserData = this.userArray.find(
          (user: any) => user.AccountID === this.AccountID
        );
        if (currentUserData) {
          this.currentUser = currentUserData;
          this.LastName = currentUserData.LastName;
          this.FirstName = currentUserData.FirstName;
          this.Birthdate = currentUserData.Birthdate;
          this.StudentNum = currentUserData.StudentNum;
          this.UserName = currentUserData.UserName;
          this.Password = currentUserData.Password;
        }
      });
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  enterEditMode(currentUser: any) {
    this.setUpdate(currentUser);
    this.isEditMode = true;
  }

  setUpdate(currentUser: any) {
    this.LastName = currentUser.LastName;
    this.FirstName = currentUser.FirstName;
    const birthdateDate = new Date(currentUser.Birthdate);
    this.Birthdate = this.datePipe.transform(birthdateDate, 'yyyy-MM-dd') || '';

    this.StudentNum = currentUser.StudentNum;
    this.UserName = currentUser.UserName;
    this.Password = currentUser.Password;
    this.AccountID = currentUser.AccountID;
  }

  UpdateProfile() {
    if (!this.AccountID) {
      console.error('AccountID is undefined.');
      return;
    }

    if (!this.validateName(this.LastName) || !this.validateName(this.FirstName)) {
      alert('Name cannot include numbers and special characters.');
      return;
    }

    if (this.birthdateError !== '') {
      console.error(
        'Validation error: Birthdate cannot be set to today or the future.'
      );
      alert(
        'Validation error: Birthdate cannot be set to today or the future.'
      );
    }

    let bodyData = {
      LastName: this.LastName,
      FirstName: this.FirstName,
      Birthdate: this.Birthdate,
      StudentNum: this.StudentNum,
      UserName: this.UserName,
      Password: this.Password,
      isActive: this.currentUser.isActive,
      AccessLevelID: this.currentUser.AccessLevelID,
    };

    if (!this.birthdateError) {
      console.log('Sending HTTP request to update profile:', bodyData);

      this.http
        .put(
          'https://ccjeflabsolutions.online:3000/api/users/update/' +
            this.currentUser.AccountID,
          bodyData
        )
        .subscribe({
          next: (resultData: any) => {
            alert('Profile Updated Successfully!');
            this.authService.updateCurrentUser(bodyData);
            this.refreshUserData();
            this.toggleEditMode();
          },
          error: (error) => {
            console.error('Error updating profile:', error);
          },
        });
    }
  }

  refreshUserData(): void {
    if (!this.currentUser || !this.currentUser.AccountID) {
      console.error('No valid current user or AccountID');
      return;
    }

    this.authService.getCurrentUser(this.currentUser.AccountID).subscribe(
      (userData) => {
        this.currentUser = userData;

        this.LastName = userData.LastName || '';
        this.FirstName = userData.FirstName || '';
        this.Birthdate =
          this.datePipe.transform(userData.Birthdate, 'yyyy-MM-dd') || '';
        this.StudentNum = userData.StudentNum || '';
        this.UserName = userData.UserName || '';
        this.Password = userData.Password || '';
        this.http
          .get('https://ccjeflabsolutions.online:3000/api/users/' + this.currentUser.AccountID)
          .subscribe((resultData: any) => {
            this.isResultLoaded = true;

            this.userArray = resultData.data;

            const currentUserData = this.userArray.find(
              (user: any) => user.AccountID === this.AccountID
            );
            if (currentUserData) {
              this.currentUser = currentUserData;

              this.LastName = currentUserData.LastName;
              this.FirstName = currentUserData.FirstName;
              this.Birthdate = currentUserData.Birthdate;
              this.StudentNum = currentUserData.StudentNum;
              this.UserName = currentUserData.UserName;
              this.Password = currentUserData.Password;
            }
          });
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }
}