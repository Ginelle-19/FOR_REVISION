
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, of, throwError } from 'rxjs';
import {catchError, map} from 'rxjs/operators'


@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'https://ccjeflabsolutions.online:3000/api/equipments';
  private conUrl = 'https://ccjeflabsolutions.online:3000/api/consumables'
  private Url = 'https://ccjeflabsolutions.online:3000/api/users';

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type':  'application/json',
  //     "Access-Control-Allow-Origin": "*",
      
  //   } )
  // };

  constructor(private http: HttpClient) {}

  getEquipmentsByCourseId(CourseID: number): Observable<any> {
    const url = `${this.apiUrl}/${CourseID}`;
    return this.http.get(url);
  }
  getConsumablesByCourseId(CourseID: number): Observable<any> {
    const url = `${this.conUrl}/${CourseID}`;
    return this.http.get(url);
  }
  getUsersByAccountID(AccountID: number): Observable<any> {
    const url = `${this.Url}/${AccountID}`;
    return this.http.get<any>(url);
  }
  getCourses(): Observable<any> {
    const url = 'https://ccjeflabsolutions.online:3000/api/courses';
    return this.http.get(url);
  }

  addUser(newUser: { UserName: string, Password: string }): Observable<any> {
    return this.http.post(`${this.Url}/register`, newUser);
  }
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.Url ).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return response;
        } else if (typeof response === 'object') {
          return Object.keys(response).map(key => response[key]);
        } else {
          return [];
        }
      }),
      catchError(this.handleError)
    );
  }

private handleError(error: any): Observable<never> {
  console.error('An error occurred:', error);
  return throwError('Something went wrong. Please try again later.');
}
}


