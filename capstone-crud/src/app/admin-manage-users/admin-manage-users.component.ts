import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-manage-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    MatIconModule,
  ],
  templateUrl: './admin-manage-users.component.html',
  styleUrl: './admin-manage-users.component.css',
})
export class AdminManageUsersComponent {
  users: any[] = [];
  AccessLevels: any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;
  p: number = 1;
  itemsPerPage: number = 7;

  currentUser: any = {
    UserName: '',
    Password: '',
    LastName: '',
    FirstName: '',
    Birthdate: '',
    StudentNum: '',
    AccessLevelID: '',
    isActive: false,
    AccountID: '',
  };

  searchStudentNum: string = '';
  filteredUsers: any[] = [];

  constructor(private http: HttpClient) {
    this.getAllUsers();
    this.loadAccessLevels();
  }

  validateName(name: string): boolean {

    const regex = /^[a-zA-Z\s]*$/;
    return regex.test(name);
  }

  getAllUsers() {
    this.http
      .get('https://ccjeflabsolutions.online:3000/api/users')
      .subscribe(
        (resultData: any) => {
          this.isResultLoaded = true;
          if (Array.isArray(resultData)) {
            this.users = resultData; // Assign the users array if it's an array
          } else if (resultData && resultData.data && Array.isArray(resultData.data)) {
            this.users = resultData.data; // Assign the users array if it's nested under 'data'
          } else {
            console.error('Invalid API response:', resultData);
          }
        },
        (error) => {
          console.error('Error fetching users:', error); // Log any errors
        }
      );
  }

  addUser() {
    this.http
      .post('https://ccjeflabsolutions.online:3000/api/users/add', this.currentUser)
      .subscribe((resultData: any) => {
        alert('User Added Successfully!');
        this.getAllUsers();
      });
  }

  getAccessLevelName(AccessLevelID: number): string {
    const accessLevel = this.AccessLevels.find(
      (level) => level.AccessLevelID === AccessLevelID
    );
    return accessLevel ? accessLevel.AccessName : '';
  }

  setUpdate(user: any) {
    this.currentUser = { ...user };
    this.currentUser.AccountID = user.AccountID;
    this.isUpdateFormActive = true;
  }

  toggleActive(currentUser: any) {
    if (currentUser && currentUser.isActive !== undefined) {
      currentUser.isActive = currentUser.isActive === 1 ? 0 : 1;
      currentUser.AccountID = currentUser.AccountID;
      this.UpdateRecords(currentUser);
    } else {
      console.error(
        'currentUser is undefined or does not have an isActive property'
      );
    }
  }

  UpdateRecords(currentUser: any) {
    if (!this.validateName(currentUser.LastName) || !this.validateName(currentUser.FirstName)) {
      alert('Name cannot include numbers and special characters.');
      return;
    }

    let bodyData = {
      UserName: currentUser.UserName,
      Password: currentUser.Password,
      LastName: currentUser.LastName,
      FirstName: currentUser.FirstName,
      Birthdate: currentUser.Birthdate,
      StudentNum: currentUser.StudentNum,
      isActive: currentUser.isActive,
      AccessLevelID: currentUser.AccessLevelID,
    };

    this.http
      .put(
        `https://ccjeflabsolutions.online:3000/api/users/update/${currentUser.AccountID}`,
        bodyData
      )
      .subscribe((resultData: any) => {
        alert('User Updated Successfully!');
      });
  }

  save(user: any) {
    if (!user.AccountID) {
      this.addUser();
    } else {
      this.UpdateRecords(user);
    }
  }

  deleteUser(user: any) {
      const confirmation = window.confirm(
        'Are you sure you want to delete this record?'
      );
  
      if (confirmation) {
        this.http
          .delete(
            'https://ccjeflabsolutions.online:3000/api/users/delete' +
              '/' +
              user.AccountID
          )
          .subscribe(
            (resultData: any) => {
              alert('Record Deleted');
              this.getAllUsers();
            },
            (error) => {
              console.error('Error deleting record: ', error);
            }
          );
      }
    
  }

  setCurrentUser(user: any) {
    this.currentUser = { ...user };
    this.currentUser.AccountID = user.AccountID;
    this.isUpdateFormActive = true;
  }

  cancelUpdate() {
    this.currentUser = {
      UserName: '',
      Password: '',
      LastName: '',
      FirstName: '',
      Birthdate: '',
      StudentNum: '',
      isActive: false,
      AccountID: '',
    };
    this.isUpdateFormActive = false;
  }

  loadAccessLevels() {
    this.http
      .get('https://ccjeflabsolutions.online:3000/api/access')
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;

        this.AccessLevels = resultData.data;
      });
  }

  updateAccessLevel(currentUser: any) {
    this.UpdateRecords(currentUser);
  }

  searchUserByStudentNum() {
    if (this.searchStudentNum.trim() !== '') {
      const searchTerm = this.searchStudentNum.trim();
      this.http.get(`https://ccjeflabsolutions.online:3000/api/users/search/${searchTerm}`)
        .subscribe((resultData: any) => {
          if (resultData.status && resultData.user) {

            this.filteredUsers = [resultData.user];
          } else {
            alert(resultData.message);
            this.filteredUsers = []; 
          }

          this.p = 1;
        }, (error) => {
          console.error('Error searching user by StudentNum:', error);
          alert('Error searching user by StudentNum. Please try again later.');
        });
    } else {
      alert('Please enter a Student Number to search.');
    }
  }

  clearSearch() {
    this.searchStudentNum = ''; 
    this.filteredUsers = []; 
    this.p = 1; 
  }
}