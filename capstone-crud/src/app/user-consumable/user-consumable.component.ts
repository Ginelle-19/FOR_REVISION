import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { FormsModule } from '@angular/forms';
import { Data, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataService } from '../data.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-consumable',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, NgxPaginationModule, MatIconModule,],
  templateUrl: './user-consumable.component.html',
  styleUrl: './user-consumable.component.css',
})
export class UserConsumableComponent {
  ConsumableArray: any[] = [];
  CourseArray: any[] = [];

  isResultLoaded = false;
  currentID = '';
  ConsumableName: string = '';
  Quantity?: number;
  ConsumableStat: string = '';

  SelectedCourseID: number | null = null;

  p: number = 1;
  itemsPerPage: number = 9;

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.getAllConsumables();
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  getAllConsumables() {
    this.http
      .get('https://ccjeflabsolutions.online:3000/api/consumables')
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;

        this.ConsumableArray = resultData.data;
      });
  }

  setUpdate(data: any) {
    this.ConsumableName = data.ConsumableName;
    this.Quantity = data.Quantity;

    this.currentID = data.ConsumableID;
  }

  getStatusClass(Quantity: number): string {
    if (Quantity <= 0) {
      return 'Not-Available';
    } else if (Quantity < 5) {
      return 'Low-on-Stock';
    } else {
      return 'Available';
    }
  }

  getStatusString(Quantity: number): string {
    if (Quantity <= 0) {
      return 'Not Available';
    } else if (Quantity < 5) {
      return 'Low on Stock';
    } else {
      return 'Available';
    }
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

  clearFilter(): void {
    this.SelectedCourseID = null;

    this.changeDetectorRef.detectChanges();
    this.filterConsumables();
  }

  filterConsumables(): void {
    if (this.SelectedCourseID !== null) {
      this.dataService
        .getConsumablesByCourseId(this.SelectedCourseID)
        .subscribe(
          (response: any) => {
            this.ConsumableArray = response.data;
          },
          (error) => {
            console.error('Error connecting to API: ', error);
          }
        );
    } else {
      this.http.get('https://ccjeflabsolutions.online:3000/api/consumables').subscribe(
        (response: any) => {
          this.ConsumableArray = response.data;
        },
        (error) => {
          console.error('Error connecting to API: ', error);
        }
      );
    }
  }
  assignCourse(): void {
    if (this.SelectedCourseID !== null) {
      this.dataService
        .getConsumablesByCourseId(this.SelectedCourseID)
        .subscribe(
          (response: any) => {
            this.ConsumableArray = response.data;
          },
          (error) => {
            console.error('Error connecting to API: ', error);
          }
        );
    }
  }
}