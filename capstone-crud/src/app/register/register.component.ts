import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { RegisterService } from '../services/register.service';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, RouterModule],
})
export class RegisterComponent implements OnInit {
  public registerForm!: FormGroup;
  public isRegistering: boolean = false;

  constructor(
    private registerService: RegisterService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const today = new Date();
    const minDateString = today.toISOString().split('T')[0];

    this.registerForm = new FormGroup({
      FirstName: new FormControl('', Validators.required),
      LastName: new FormControl('', Validators.required),
      Birthdate: new FormControl('', [
        Validators.required,
        this.validateBirthday(minDateString),
      ] as any),
      StudentNum: new FormControl('', [
        Validators.required,
        Validators.maxLength(8), 
        Validators.pattern("^[0-9]*$")
      ])
    });
  }

  validateName() {
    const nameControl = this.registerForm.get('FirstName');
    if (!nameControl?.value) return;
  
    const nameRegex = /^[a-zA-Z\s]*$/;
    if (!nameRegex.test(nameControl.value)) {
      alert('Please enter a valid name (only letters and spaces)');
      nameControl.setErrors({ invalidName: true });
    } else {
      nameControl.setErrors(null);
    }
  }

  onStudentNumInput(event: any) {
    let input = event.target.value;
    input = input.replace(/[^\d]/g, '');
    if (input.length > 8) {
      alert('Please enter only 8 digits for the student number.');
      input = input.slice(0, 8);
    }
    this.registerForm.get('StudentNum')!.setValue(input);
  }

  validateBirthday(minDate: string) {
    return (control: FormControl) => {
      const selectedDate = control.value;

      if (selectedDate) {
        if (selectedDate > minDate) {
          return { invalidBirthday: true };
        }
      }

      return null;
    };
  }

  onSubmit() {
    this.validateName();
    if (this.registerForm.invalid) {
      this.snackBar.open('Please fill in all required fields.', 'Close', {
        duration: 5000,
        panelClass: 'error-snackbar',
      });
      return;
    }

    const FirstName = this.registerForm.get('FirstName')!.value;
    const LastName = this.registerForm.get('LastName')!.value;
    const Birthdate = this.registerForm.get('Birthdate')!.value;
    const StudentNum = this.registerForm.get('StudentNum')!.value;

    const UserName = StudentNum;
    const Password = this.formatPassword(Birthdate);

    this.registerService.checkStudentNumber(StudentNum).subscribe(
      (isRegistered) => {
        if (isRegistered) {
          this.snackBar.open('Student number is already registered.', 'Close', {
            duration: 5000,
            panelClass: 'error-snackbar',
          });
        } else {
          this.isRegistering = true;
          this.registerService
            .register(
              UserName,
              Password,
              FirstName,
              LastName,
              Birthdate,
              StudentNum
            )
            .subscribe(
              (response) => {
                this.snackBar.open('Registration successful!', 'Close', {
                  duration: 5000,
                  panelClass: 'success-snackbar',
                });
                this.router.navigate(['']);
              },
              (error) => {
                console.error('Registration error:', error);
              }
            )
            .add(() => {
              this.isRegistering = false;
            });
        }
      },
      (error) => {
        console.error('Error checking student number:', error);
      }
    );
  }

  private formatPassword(birthdate: string): string {
    const dateParts = birthdate.split('-');
    const month = dateParts[1];
    const day = dateParts[2];
    const year = dateParts[0];
    return month + day + year;
  }
}