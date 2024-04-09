import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-course',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxPaginationModule, MatIconModule],
  templateUrl: './user-course.component.html',
  styleUrl: './user-course.component.css',
})
export class UserCourseComponent {
  CourseArray: any[] = [];
  isResultLoaded = false;
  p: number = 1;
  itemsPerPage: number = 10;
  constructor(private http: HttpClient) {
    this.getAllCourses();
  }

  getAllCourses() {
    this.http
      .get('https://ccjeflabsolutions.online:3000/api/courses')
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;

        this.CourseArray = resultData.data;
      });
  }
}