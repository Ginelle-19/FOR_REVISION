import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-facility-crud',
  templateUrl: './facility-crud.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    MatIconModule,
  ],
  styleUrls: ['./facility-crud.component.css'],
  standalone: true,
})
export class FacilityCrudComponent {
  FacilityArray: any[] = [];
  RoomsArray: any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;

  RoomName: string = '';
  RoomDesc: string = '';
  RoomStatus!: number;
  RoomID: string | null = null;
  currentRoom: any;

  p: number = 1;
  itemsPerPage: number = 7;

  constructor(private http: HttpClient) {
    this.getAllRooms();
  }

  getAllRooms() {
    this.http
      .get('https://ccjeflabsolutions.online:3000/api/room')
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        this.RoomsArray = resultData.data;
      });
  }

  addRooms() {
    let bodyData = {
      RoomName: this.RoomName,
      RoomDesc: this.RoomDesc,
    };

    this.http
      .post('https://ccjeflabsolutions.online:3000/api/room/add', bodyData)
      .subscribe((resultData: any) => {
        alert('Room Added Successfully!');
        this.getAllRooms();
      });
    this.clearInputs();
  }

  setUpdate(data: any) {
    this.RoomName = data.RoomName;
    this.RoomDesc = data.RoomDesc;
    this.RoomStatus = data.RoomStatus;
    this.RoomID = data.RoomID;
  }

  UpdateRecords(data: any) {
    let bodyData = {
      RoomName: data.RoomName,
      RoomDesc: data.RoomDesc,
      RoomStatus: data.RoomStatus,
      RoomID: data.RoomID,
    };

    this.http
      .put(
        'https://ccjeflabsolutions.online:3000/api/room/update' + '/' + data.RoomID,
        bodyData
      )
      .subscribe((resultData: any) => {
        alert('Room Updated Successfully!');
        this.getAllRooms();
      });
    this.clearInputs();
  }

  toggleActive(data: any) {
    if (data && data.RoomStatus !== undefined) {
      data.RoomStatus = data.RoomStatus === 1 ? 0 : 1;
      this.UpdateRecords(data);
    } else {
      console.error(
        'currentRoom is undefined or does not have an RoomStatus property'
      );
    }
  }

  save() {
    if (this.RoomID && this.RoomID !== '') {
      const roomData = {
        RoomName: this.RoomName,
        RoomDesc: this.RoomDesc,
        RoomStatus: this.RoomStatus,
        RoomID: this.RoomID,
      };
      this.UpdateRecords(roomData);
    } else {
      this.addRooms();
    }
    this.clearInputs();
  }

  clearInputs() {
    this.RoomName = '';
    this.RoomDesc = '';
  }

  deleteRoom(room: any) {
    const confirmation = window.confirm(
      'Are you sure you want to delete this record?'
    );

    if (confirmation) {
      this.http
        .delete('https://ccjeflabsolutions.online:3000/api/room/delete/' + room.RoomID)
        .subscribe(
          (resultData: any) => {
            alert('Record Deleted');
            this.getAllRooms();
          },
          (error) => {
            console.error('Error deleting room:', error);
            alert('Failed to delete room. Please try again later.');
          }
        );
    }
  }
}