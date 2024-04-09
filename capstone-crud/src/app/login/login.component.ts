import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    RouterModule,
    FormsModule,
    MatIconModule
  ],
  standalone: true,
})
export class LoginComponent {
  imageUrl: string = '/assets/ccjef_logo.png'
  termsAgreed: boolean = false;

  @ViewChild('UserName') UserName!: ElementRef;
  @ViewChild('Password') Password!: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.activeRoute.queryParamMap.subscribe((queries) => {
      const logout = Boolean(queries.get('logout'));
      if (logout) {
        this.authService.logout();
        this.snackbar.open('You are now logged out.', 'Close', {duration:3000});
      }
    });
  }

  OnLoginClicked() {
    if (!this.termsAgreed) {
      this.snackbar.open('You must agree to the Terms and Conditions to log in.', 'Close', { duration: 3000 });
      return;
    }
    
    const UserName = this.UserName.nativeElement.value;
    const Password = this.Password.nativeElement.value;
  
    this.authService.login(UserName, Password).subscribe(
      (user) => {
        if (user) {
          if (user === 'not_approved') {
            alert('Your account has not been approved yet. Please contact the administrator.');
          } else {
            alert('Welcome ' + user.FirstName + '. You are logged in.');
            switch (user.AccessLevelID) {
              case 1: // Student
                this.router.navigate(['/user-menu/user-profile']);
                break;
              case 2: // Super Admin
                this.router.navigate(['/menu/profile']);
                break;
              case 3: // Super Admin
                this.router.navigate(['/admin-menu/profile']);
                break;
              default:
                this.router.navigate(['']);
                break;
            }
          }
        } else {
          alert('The login credentials you have entered are not correct.');
        }
      },
      (error) => {
        console.error('Error during login:', error);
        alert('An error occurred during login.');
      }
    );
  }
}

