import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConsumableReportsComponent } from './consumable-reports.component';

@NgModule({
    declarations: [
        ConsumableReportsComponent
    ],
    imports: [FormsModule, ReactiveFormsModule],
    exports: [
        ConsumableReportsComponent
    ],
    providers: [],
  })
  export class ConsumableReportsComponentModule { }