import {
  Component,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ConsumableReportService } from '../services/consumable-reports.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxPrintModule } from 'ngx-print';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-consumable-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxPrintModule,
    NgxPaginationModule,
    MatIconModule,
  ],
  providers: [DatePipe, HttpClientModule],
  templateUrl: './consumable-reports.component.html',
  styleUrl: './consumable-reports.component.css',
})
export class ConsumableReportsComponent {
  TransactionArray: any[] = [];
  CourseArray: any[] = [];
  ConsumableArray: any[] = [];
  AccountsArray: any[] = [];

  TransactionConsumeID: number | null = null;
  CourseID: number | null = null;
  ConsumableID: number | null = null;
  AccountID: number | null = null;
  Quantity: number | null = null;
  DateCreated: Date = new Date();

  currentID = '';
  minDate!: string;
  SelectedCourseID: number | null = null;
  ConsumableArrayForSelectedCourse: any[] = [];

  isResultLoaded = false;

  p: number = 1;
  itemsPerPage: number = 7;

  isPDF: boolean = false; 

  @ViewChild('content') content!: ElementRef;
  public SavePDF(): void {
    this.isPDF = true;
  
    const content = this.content.nativeElement.cloneNode(true); 
  

    const actionsColumnHeader = content.querySelector('th:last-child');
    if (actionsColumnHeader) {
      actionsColumnHeader.remove(); 
    
      const rows = content.querySelectorAll('tr'); 
      rows.forEach((row: any) => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) { 
          cells[cells.length - 1].remove(); 
        }
      });
    }
  
    const doc = new jsPDF();
    const title = 'Monthly Consumable Requisition Report';
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
    private ConsumableReportService: ConsumableReportService,
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
    this.loadConsumables();
    this.loadUsers();

    this.isPDF = false;
  }

  fetchTransactions() {
    this.http
      .get('https://ccjeflabsolutions.online:3000/api/consumableTrans/')
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        this.TransactionArray = resultData.data;
        this.TransactionArray.forEach((transaction: any) => {
          transaction.CourseName = this.getCourseName(transaction.CourseID);
          transaction.ConsumableName = this.getConsumableName(
            transaction.ConsumableID
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
      this.ConsumableID !== null &&
      this.AccountID !== null &&
      this.Quantity !== null &&
      this.DateCreated !== null 
    );
  }

  register() {
    if (this.validateInputs()) {
    let bodyData = {
      CourseID: this.CourseID,
      ConsumableID: this.ConsumableID,
      AccountID: this.AccountID,
      Quantity: this.Quantity,
      DateCreated: this.datePipe.transform(this.DateCreated, 'yyyy-MM-dd'),
    };

    this.http
      .post('https://ccjeflabsolutions.online:3000/api/consumableTrans/add', bodyData)
      .subscribe((resultData: any) => {
        alert('Transaction Created!');
        this.fetchTransactions();
        this.clearDropdownSelections();
      });
    this.clearInputs();
  }
}
  clearDropdownSelections() {
    this.CourseID = null;
    this.ConsumableID = null;
    this.AccountID = null;
    this.Quantity = null;
  }

  setUpdate(data: any) {
    this.TransactionConsumeID = data.TransactionConsumeID;
    this.CourseID = data.CourseID;
    this.ConsumableID = data.ConsumableID;
    this.AccountID = data.AccountID;
    this.Quantity = data.Quantity;
    this.DateCreated = data.DateCreated;
    this.currentID = data.TransactionConsumeID;

    if (this.ConsumableArray.length === 0) {
      this.loadConsumables();
    }
  }

  UpdateRecords() {
    let bodyData = {
      TransactionConsumeID: this.TransactionConsumeID,
      CourseID: this.CourseID,
      ConsumableID: this.ConsumableID,
      AccountID: this.AccountID,
      Quantity: this.Quantity,
      DateCreated: this.datePipe.transform(this.DateCreated, 'yyyy-MM-dd'),
    };
    this.http
      .put(
        'https://ccjeflabsolutions.online:3000/api/consumableTrans/update' +
          '/' +
          this.currentID,
        bodyData
      )
      .subscribe((resultData: any) => {
        alert('Transaction Updated Successfully!');
        this.fetchTransactions();
      });
    this.clearInputs;
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
    this.CourseID = 0;
    this.ConsumableID = 0;
    this.AccountID = 0;
    this.Quantity = 0;
  }

  setDelete(data: any) {
    const confirmation = window.confirm(
      'Are you sure you want to delete this record?'
    );

    if (confirmation) {
      this.http
        .delete(
          'https://ccjeflabsolutions.online:3000/api/consumableTrans/delete' +
            '/' +
            data.TransactionConsumeID
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
    this.ConsumableReportService.getCourses().subscribe(
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

      this.ConsumableReportService.getConsumablesByCourseId(
        this.CourseID
      ).subscribe(
        (response: any) => {

          this.ConsumableArrayForSelectedCourse = response.data;
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error fetching consumables by course:', error);
        }
      );
    }
  }

  loadConsumables(): void {
    this.ConsumableReportService.getConsumables().subscribe(
      (response: any) => {
        this.ConsumableArray = response.data;
      },
      (error) => {
        console.error('Error fetching equipment:', error);
      }
    );
  }

  loadUsers(): void {
    this.ConsumableReportService.getUsers().subscribe(
      (response: any) => {
        // Check if response.data is defined and an array
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

  getConsumableName(ConsumableID: number): string {
    const equipment = this.ConsumableArray.find(
      (e) => e.ConsumableID === ConsumableID
    );
    return equipment ? equipment.ConsumableName : '';
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
}