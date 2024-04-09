import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private apiUrl = 'https://ccjeflabsolutions.online:3000'; 

  constructor(private http: HttpClient) {}

  register(UserName: string, Password: string, FirstName: string, LastName: string, Birthdate: string, StudentNum: number): Observable<any> {
    const newUser = {
      UserName: UserName,
      Password: Password,
      FirstName: FirstName,
      LastName: LastName,
      Birthdate: Birthdate,
      StudentNum: StudentNum
    };
    

    return this.http.post(`${this.apiUrl}/api/users/add`, newUser).pipe(
      catchError((error) => {
        console.error('Registration error:', error);
        return throwError('Something went wrong. Please try again later.');
      })
    );
  }

  checkStudentNumber(StudentNum: number): Observable<boolean> {
    return this.http.get<{ status: boolean, isRegistered: boolean }>(`${this.apiUrl}/api/users/check/${StudentNum}`).pipe(
      map(response => response.isRegistered), 
      catchError((error) => {
        console.error('Error checking student number:', error);
        return throwError('Something went wrong. Please try again later.');
      })
    );
  }
}
