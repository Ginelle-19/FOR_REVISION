import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../services/auth.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  providers: [LoginComponent],
})
export class MenuComponent {
  imageUrl: string = '/assets/ccjef_logo.png';

  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    this.authService.confirmLogoutOnRefresh();
  }
}