import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../app.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EquipmentCrudComponent } from '../equipment-crud/equipment-crud.component';
import { ConsumableCrudComponent } from '../consumable-crud/consumable-crud.component';
import { error } from 'console';
import { MatIconModule } from '@angular/material/icon';
import { NgxPaginationModule } from 'ngx-pagination';

// --------------------------------

@Component({
  selector: 'app-course-crud',
  standalone: true,
  imports: [
    HttpClientModule,
    RouterOutlet,
    CommonModule,
    AppComponent,
    FormsModule,
    RouterModule,
    EquipmentCrudComponent,
    ConsumableCrudComponent,
    MatIconModule,
    NgxPaginationModule,
  ],
  templateUrl: './course-crud.component.html',
  styleUrl: './course-crud.component.css',
})
export class CourseCrudComponent {
  CourseID: number = 1;
  EquipmentArray: any[] = [];
  CourseArray: any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;

  currentID: any;
  CourseCode: string = '';
  CourseName: string = '';

  p: number = 1;
  itemsPerPage: number = 7;
  constructor(private http: HttpClient) {
    this.getAllCourses();
  }

  ngOnInit(): void {}

  getAllCourses() {
    this.http
      .get('https://ccjeflabsolutions.online:3000/api/courses')
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        this.CourseArray = resultData.data;
      });
  }

  register() {
    let bodyData = {
      CourseCode: this.CourseCode,
      CourseName: this.CourseName,
    };

    this.http
      .post('https://ccjeflabsolutions.online:3000/api/courses/add', bodyData)
      .subscribe((resultData: any) => {
        alert('Course Added Successfully!');
        this.getAllCourses();
      });
    this.clearInputs();
  }

  setUpdate(data: any) {
    this.CourseCode = data.CourseCode;
    this.CourseName = data.CourseName;

    this.currentID = data.CourseID;
  }

  UpdateRecords() {
    let bodyData = {
      CourseCode: this.CourseCode,
      CourseName: this.CourseName,
    };

    this.http
      .put(
        'https://ccjeflabsolutions.online:3000/api/courses/update' + '/' + this.currentID,
        bodyData
      )
      .subscribe((resultData: any) => {
        alert('Course Updated Successfully!');
        this.getAllCourses();
      });
  }

  save() {
    if (this.currentID == '') {
      this.register();
    } else {
      this.UpdateRecords();
    }
    this.clearInputs();
  }
  clearInputs() {
    this.CourseCode = '';
    this.CourseName = '';
  }

  setDelete(data: any) {
    const confirmation = window.confirm(
      'Are you sure you want to delete this record?'
    );

    if (confirmation) {
      this.http
        .delete(
          'https://ccjeflabsolutions.online:3000/api/courses/delete' + '/' + data.CourseID
        )
        .subscribe(
          (resultData: any) => {
            alert('Record Deleted');
            this.getAllCourses();
          },
          (error) => {
            console.error('Error deleting record: ', error);
          }
        );
    }
  }

  filterEquipments(): void {
    const apiUrl = 'https://ccjeflabsolutions.online:3000/api/equipments/${this.CourseID}';

    this.http.get(apiUrl).subscribe(
      (resultData: any) => {
        this.EquipmentArray = resultData.data;
      },
      (error) => {
        console.error('Error Connecting to API', error);
      }
    );
  }
  filterEquipment(): void {
    this.filterEquipments();
  }
}