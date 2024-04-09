import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-equipment',
  standalone: true,
  imports: [NgxPaginationModule, FormsModule, CommonModule, RouterModule, MatIconModule],
  templateUrl: './user-equipment.component.html',
  styleUrl: './user-equipment.component.css',
})
export class UserEquipmentComponent {
  EquipmentArray: any[] = [];
  CourseArray: any[] = [];

  EquipmentName: string = '';
  Quantity: string = '';
  CourseID!: number;

  SelectedCourseID: number | null = null;
  searchValue: string = '';
  searchResult: any[] = [];
  isResultLoaded = false;

  p: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.getAllEquipments();
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  getAllEquipments() {
    this.http
      .get('https://ccjeflabsolutions.online:3000/api/equipments/')
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;

        this.EquipmentArray = resultData.data.map((item: any) => ({
          EquipmentName: item.EquipmentName,
          Quantity: item.Quantity,
        }));
      });
  }

  filterEquipments(): void {
    if (this.SelectedCourseID !== null) {
      this.dataService.getEquipmentsByCourseId(this.SelectedCourseID).subscribe(
        (response: any) => {
          this.EquipmentArray = response.data;
        },
        (error) => {
          console.error('Error connecting to API: ', error);
        }
      );
    } else {
      this.http.get('https://ccjeflabsolutions.online:3000/api/equipments').subscribe(
        (response: any) => {
          this.EquipmentArray = response.data;
        },
        (error) => {
          console.error('Error connecting to API: ', error);
        }
      );
    }
  }

  clearFilter(): void {
    this.SelectedCourseID = null;

    this.changeDetectorRef.detectChanges();
    this.filterEquipments();
  }

  loadCourses(): void {
    this.dataService.getCourses().subscribe(
      (response: any) => {
        this.CourseArray = response.data;
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }
}