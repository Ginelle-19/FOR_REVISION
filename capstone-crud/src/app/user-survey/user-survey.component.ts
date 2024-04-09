import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../app.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { DataService } from '../data.service';

import { DatePipe } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-user-survey',
  standalone: true,
  imports: [
    HttpClientModule,
    RouterOutlet,
    CommonModule,
    AppComponent,
    FormsModule,
    RouterModule,
    NgxPaginationModule,
    MatIconModule
  ],
  providers: [HttpClientModule, DatePipe],
  templateUrl: './user-survey.component.html',
  styleUrl: './user-survey.component.css',
})
export class UserSurveyComponent {
  isResultLoaded = false;
}