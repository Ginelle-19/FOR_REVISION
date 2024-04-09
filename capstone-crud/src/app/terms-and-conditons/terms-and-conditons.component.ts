import { Component } from '@angular/core';
import { Router, RouterModule} from '@angular/router'
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-terms-and-conditons',
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule
  ],
  templateUrl: './terms-and-conditons.component.html',
  styleUrl: './terms-and-conditons.component.css'
})
export class TermsAndConditonsComponent {

}
