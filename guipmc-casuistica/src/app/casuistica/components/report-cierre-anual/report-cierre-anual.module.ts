import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReportCierreAnualComponent} from './report-cierre-anual/report-cierre-anual.component';
import {NgxSpinnerModule} from 'ngx-spinner';



@NgModule({
  declarations: [ReportCierreAnualComponent],
  imports: [
    CommonModule, NgxSpinnerModule
  ]
})
export class ReportCierreAnualModule { }
