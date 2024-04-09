import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConsumableReportService {
  private apiUrl = 'https://ccjeflabsolutions.online:3000';

  constructor(private http: HttpClient) { }


  getTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/consumableTrans`)
      .pipe(
        map(transactions => {
          return transactions.map(transaction => ({
            ...transaction,
            StudentNum: transaction.account ? transaction.account.StudentNum : '' 
          }));
        }),
        catchError(error => this.handleError(error))
      );
  }

  getCourses(): Observable<any[]> {
    const url = `${this.apiUrl}/api/courses`;
    return this.http.get<any[]>(url)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  getConsumables(): Observable<any[]> {
    const url = `${this.apiUrl}/api/consumables`;
    return this.http.get<any[]>(url)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  getUsers(): Observable<any[]> {
    const url = `${this.apiUrl}/api/users`;
    return this.http.get<any[]>(url)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }
  getConsumablesByCourseId(CourseID: number): Observable<any[]> {
    const url = `${this.apiUrl}/api/consumables/${CourseID}`;
    return this.http.get<any[]>(url)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
  
}
