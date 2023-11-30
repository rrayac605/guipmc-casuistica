import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DialogUiComponent } from 'src/app/common/components/dialog/dialog-ui/dialog-ui.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReportTypeRiskComponent } from './report-type-risk-ui/report-type-risk.component';



@NgModule({
  declarations: [ReportTypeRiskComponent],
  imports: [CommonModule, BrowserModule, FormsModule, ReactiveFormsModule, AppRoutingModule, MatDatepickerModule, NgxSpinnerModule],
  exports: [ReportTypeRiskComponent],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'es-ES'}, FormsModule, ReactiveFormsModule, MatDatepickerModule],
  bootstrap: [ReportTypeRiskComponent],
  entryComponents: [DialogUiComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ReportTypeRiskModule { }
