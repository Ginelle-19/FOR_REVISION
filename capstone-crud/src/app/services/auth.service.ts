
  import { Injectable } from '@angular/core';
  import { DataService } from '../data.service';
  import { Observable, of, throwError } from 'rxjs';
  import { catchError, map, tap } from 'rxjs/operators';
  import { HttpClient } from '@angular/common/http';
  
  @Injectable({
    providedIn: 'root'
  })
  export class AuthService {
  
    public currentUser: any = null;
    private isAuthenticated: boolean = false;

    private apiUrl = 'https://ccjeflabsolutions.online:3000/api/login'; 
  
    constructor(private dataService: DataService, private http: HttpClient) { }
  
    // login(UserName: string, Password: string): Observable<any | null> {
    //   return this.dataService.getUsers().pipe(
    //     map((response: any[]) => {
    //       if (Array.isArray(response) && response.length > 0) {
    //         const users = response;
    //         const user = users.find((u: any) => u.UserName === UserName && u.Password === Password);
    //         if (user) {
    //           if (user.isActive === 1) {
    //             this.currentUser = { ...user, AccountID: user.AccountID }; 
    //             this.isAuthenticated = true; 
    //             return user;
    //           } else {
    //             console.log('User found but not active. Cannot login.');
    //             return 'not_approved';
    //           }
    //         } else {
    //           console.log('User not found or invalid credentials');
    //           return null;
    //         }
    //       } else {
    //         console.error('Invalid response from DataService:', response);
    //         return null;
    //       }
    //     }),
    //     catchError((error) => {
    //       console.error('Error fetching users:', error);
    //       return of(null);
    //     })
    //   );
    // }
    
    login(UserName: string, Password: string): Observable<any | null> {
      return this.http.post<any>(this.apiUrl, { UserName, Password }).pipe(
        map((response: any) => {
          if (response && response.status === true) {
            const user = response.user;
            if (user.isActive === 1) {
              this.currentUser = { ...user, AccountID: user.AccountID }; 
              this.isAuthenticated = true; 
              return user;
            } else {
              console.log('User found but not active. Cannot login.');
              return 'not_approved';
            }
          } else {
            console.log('User not found or invalid credentials');
            return null;
          }
        }),
        catchError((error) => {
          console.error('Error logging in:', error);
          return of(null);
        })
      );
    }
    
    logout(): void {
      const confirmLogout = confirm('Are you sure you want to log out?');
      if (confirmLogout) {
        this.currentUser = null;
        this.isAuthenticated = false; 
      }
    }
  
   getCurrentUser(AccountID?: number): Observable<any> {
    if (this.currentUser && this.currentUser.AccountID) {

    return of(this.currentUser);
  } else {
    const userID = AccountID || (this.currentUser && this.currentUser.AccountID);
    if (!userID) {
      console.error('No valid current user or AccountID');
      return throwError('No valid current user or AccountID');
    }
    return this.dataService.getUsersByAccountID(userID).pipe(
      tap((user) => {
        this.currentUser = user;
      }),
      catchError(error => {
        console.error('Error fetching current user:', error);
        return throwError(error);
      })
    );
  }
}
    


    getUserByAccountID(AccountID: number): Observable<any> {
      return this.dataService.getUsersByAccountID(AccountID).pipe(
        map(users => {
          if (Array.isArray(users) && users.length > 0) {
            return users[0]; 
          } else {
            throw new Error('No user found for the given AccountID');
          }
        }),
        catchError(error => {
          console.error('Error fetching user data:', error);
          throw error; 
        })
      );
    }
  
    getIsAuthenticated(): boolean {
      return this.isAuthenticated;
    }

    updateCurrentUser(updatedUserData: any): void {

      this.currentUser = { ...this.currentUser, ...updatedUserData };
    }

    private beforeUnloadListener: EventListenerOrEventListenerObject | null = null;
confirmLogoutOnRefresh(): void {
  this.beforeUnloadListener = (event: BeforeUnloadEvent) => {
    const confirmationMessage = 'Are you sure you want to refresh? You will be logged out.';
    (event || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
  };
  window.addEventListener('beforeunload', this.beforeUnloadListener);
}

removeLogoutConfirmation(): void {
  if (this.beforeUnloadListener) {
    window.removeEventListener('beforeunload', this.beforeUnloadListener);
    this.beforeUnloadListener = null;
  }
}
    
  }
  




