import {
  Component,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ReportService } from '../services/reports.service';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxPrintModule } from 'ngx-print';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { MatIconModule } from '@angular/material/icon';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxPrintModule,
    MatIconModule,
    NgxPaginationModule,
  ],
  providers: [DatePipe, HttpClientModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent {
  TransactionArray: any[] = [];
  CourseArray: any[] = [];
  EquipmentArray: any[] = [];
  AccountsArray: any[] = [];

  originalTransactionArray: any[] = [];

  CourseID: number | null = null;
  EquipmentID: number | null = null;
  AccountID: number | null = null;
  Quantity: number | null = null;
  DateCreated: Date = new Date();
  DateReturned: Date | null = null;
  DueDate: Date | null = null;

  currentID = '';
  minDate!: string;
  SelectedCourseID: number | null = null;
  EquipmentArrayForSelectedCourse: any[] = [];

  isResultLoaded = false;

  p: number = 1;
  itemsPerPage: number = 7;

  isPDF: boolean = false; 

  @ViewChild('content') content!: ElementRef;


  public SavePDF(): void {
    this.isPDF = true;
  
    const content = this.content.nativeElement.cloneNode(true);
  

    const actionsColumn = content.querySelector('th:nth-child(11)');
    if (actionsColumn) {
      actionsColumn.remove();
  
      const rows = content.querySelectorAll('tr'); 
      rows.forEach((row: { querySelectorAll: (arg0: string) => any; }) => {
        const cells = row.querySelectorAll('td');
        if (cells.length === 11) {
          cells[10].remove();
        }
      });
    }
  
    const doc = new jsPDF();
    const title = 'Monthly Equipment Requisition Report';
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
  
    doc.text(title, 14, 10);
    doc.text(`Generated on: ${formattedDate}`, 14, 18);
  
    autoTable(doc, {
      html: content,
      margin: { top: 30 },
    });
  
    doc.save('reports.pdf');
  
    this.isPDF = false;
  }
  

  constructor(
    private http: HttpClient,
    private reportService: ReportService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {
    this.fetchTransactions();

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.isPDF = false;
  }

  ngOnInit(): void {
    this.loadCourses();
    this.loadEquipments();
    this.loadUsers();

    this.isPDF = false;
  }

  fetchTransactions() {
    this.http
      .get('https://ccjeflabsolutions.online:3000/api/equipmentTrans/')
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        this.TransactionArray = resultData.data;
        this.TransactionArray.forEach((transaction: any) => {
          transaction.CourseName = this.getCourseName(transaction.CourseID);
          transaction.EquipmentName = this.getEquipmentName(
            transaction.EquipmentID
          );
          transaction.AccountName = this.getAccountName(transaction.AccountID);
          const accountDetails = this.getAccountDetails(transaction.AccountID);
          if (accountDetails) {
            transaction.StudentNum = accountDetails.StudentNum;
          } else {
            transaction.StudentNum = '';
          }
        });
      });
  }

  validateInputs(): boolean {
    return (
      this.CourseID !== null &&
      this.EquipmentID !== null &&
      this.AccountID !== null &&
      this.Quantity !== null &&
      this.DateCreated !== null &&
      this.DueDate !== null
    );
  }

  register() {
    if (this.validateInputs()) {
    let bodyData = {
      CourseID: this.CourseID,
      EquipmentID: this.EquipmentID,
      AccountID: this.AccountID,
      Quantity: this.Quantity,
      DateCreated: this.datePipe.transform(this.DateCreated, 'yyyy-MM-dd'),
      DueDate: this.datePipe.transform(this.DueDate, 'yyyy-MM-dd'),
      DateReturned: this.datePipe.transform(this.DateReturned, 'yyyy-MM-dd'),
    };

    this.http
      .post('https://ccjeflabsolutions.online:3000/api/equipmentTrans/add', bodyData)
      .subscribe((resultData: any) => {
        alert('Transaction Created!');
        this.fetchTransactions();
        this.clearDropdownSelections();
      });
  }
}
  clearDropdownSelections() {
    this.CourseID = null;
    this.EquipmentID = null;
    this.AccountID = null;
    this.Quantity = null;
    this.DateReturned = null;
    this.DueDate = null;
  }
  // -------------------------------------
  setUpdate(data: any) {
    this.CourseID = data.CourseID;
    this.EquipmentID = data.EquipmentID;
    this.AccountID = data.AccountID;
    this.Quantity = data.Quantity;
    this.DateCreated = data.DateCreated;
    this.DueDate = data.DueDate;
    this.DateReturned = data.DateReturned;

    this.currentID = data.TransactionEquipID;
  }

  UpdateRecords() {
    let bodyData = {
      CourseID: this.CourseID,
      EquipmentID: this.EquipmentID,
      AccountID: this.AccountID,
      Quantity: this.Quantity,
      DateCreated: this.datePipe.transform(this.DateCreated, 'yyyy-MM-dd'),
      DueDate: this.datePipe.transform(this.DueDate, 'yyyy-MM-dd'),
      DateReturned: this.datePipe.transform(this.DateReturned, 'yyyy-MM-dd'),
    };
    this.http
      .put(
        'https://ccjeflabsolutions.online:3000/api/equipmentTrans/update' +
          '/' +
          this.currentID,
        bodyData
      )
      .subscribe((resultData: any) => {
        alert('Transaction Updated Successfully!');
        this.fetchTransactions();
      });
  }
  save() {
    if (this.currentID == '') {
      this.register();
    } else {
      this.UpdateRecords();
    }
  }

  setDelete(data: any) {
    const confirmation = window.confirm(
      'Are you sure you want to delete this record?'
    );

    if (confirmation) {
      this.http
        .delete(
          'https://ccjeflabsolutions.online:3000/api/equipmentTrans/delete' +
            '/' +
            data.TransactionEquipID
        )
        .subscribe(
          (resultData: any) => {
            alert('Record Deleted');
            this.fetchTransactions();
          },
          (error) => {
            console.error('Error deleting record: ', error);
          }
        );
    }
  }

  loadCourses(): void {
    this.reportService.getCourses().subscribe(
      (response: any) => {
        this.CourseArray = response.data;
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }

  onCourseChange(): void {
    if (this.CourseID) {
      this.reportService.getEquipmentsByCourseId(this.CourseID).subscribe(
        (response: any) => {

          this.EquipmentArrayForSelectedCourse = response.data;
          this.cdr.detectChanges(); 
        },
        (error) => {
          console.error('Error fetching equipments by course:', error);
        }
      );
    }
  }
  loadEquipments(): void {
    this.reportService.getEquipment().subscribe(
      (response: any) => {
        this.EquipmentArray = response.data;
      },
      (error) => {
        console.error('Error fetching equipment:', error);
      }
    );
  }
  loadUsers(): void {
    this.reportService.getUsers().subscribe(
      (response: any) => {

        if (response && Array.isArray(response)) {
          this.AccountsArray = response;
          this.AccountsArray.forEach((user: any) => {
            user.FullName = `${user.LastName} ${user.FirstName}`;
          });
        } else {
          console.error('Error: response.data is not an array or is undefined');
        }
      },
      (error) => {
        console.error('Error fetching Users:', error);
      }
    );
  }
  
  getCourseName(CourseID: number): string {
    const course = this.CourseArray.find((c) => c.CourseID === CourseID);
    return course ? course.CourseName : '';
  }

  getEquipmentName(EquipmentID: number): string {
    const equipment = this.EquipmentArray.find(
      (e) => e.EquipmentID === EquipmentID
    );
    return equipment ? equipment.EquipmentName : '';
  }

  getAccountName(AccountID: number): string {
    const account = this.AccountsArray.find((a) => a.AccountID === AccountID);
    return account ? `${account.FirstName} ${account.LastName}` : '';
  }

  getAccountDetails(AccountID: number): any {
    const account = this.AccountsArray.find((a) => a.AccountID === AccountID);
    return account
      ? {
          name: `${account.FirstName} ${account.LastName}`,
          StudentNum: account.StudentNum,
        }
      : null;
  }

  getStatus(DateReturned: Date | null): string {
    return DateReturned ? 'Returned' : 'Unreturned';
  }

  selectedStatus: string = 'all';


  applyFilter() {

    this.p = 1;
  

    if (this.selectedStatus === 'Unreturned') {
      this.TransactionArray = this.TransactionArray.filter(
        transaction => !transaction.DateReturned
      );
    } else if (this.selectedStatus === 'Returned') {
      this.TransactionArray = this.TransactionArray.filter(
        transaction => transaction.DateReturned
      );
    } else {

      this.fetchTransactions();
    }
  }
  
  
}