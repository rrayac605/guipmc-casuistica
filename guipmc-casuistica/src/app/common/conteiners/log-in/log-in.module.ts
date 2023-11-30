import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogInUiComponent } from './log-in-ui/log-in-ui.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DialogUiComponent } from 'src/app/common/components/dialog/dialog-ui/dialog-ui.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CounterDirective } from './counter.directive';

@NgModule({
  declarations: [LogInUiComponent],
  exports: [LogInUiComponent],
  imports: [CommonModule, BrowserModule, FormsModule, ReactiveFormsModule, AppRoutingModule, MatDatepickerModule, NgxSpinnerModule],
    providers: [{provide: MAT_DATE_LOCALE, useValue: 'es-ES'}, FormsModule, ReactiveFormsModule, MatDatepickerModule],
  bootstrap: [LogInUiComponent],
  entryComponents: [DialogUiComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class LogInModule { }
