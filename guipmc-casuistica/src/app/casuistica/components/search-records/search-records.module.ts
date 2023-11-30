import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchRecordsUiComponent } from './search-records-ui/search-records-ui.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DialogUiComponent } from 'src/app/common/components/dialog/dialog-ui/dialog-ui.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatSelectModule } from '@angular/material/select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomPipesModule } from 'src/app/common/pipe/custom-pipes.module';


@NgModule({
  declarations: [SearchRecordsUiComponent],
  imports: [CommonModule, BrowserModule, FormsModule, ReactiveFormsModule, AppRoutingModule, MatDatepickerModule,
    NgxSpinnerModule, MatSelectModule, NgbModule, CustomPipesModule],
  exports: [SearchRecordsUiComponent],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'es-ES'}, FormsModule, ReactiveFormsModule, MatDatepickerModule],
  bootstrap: [SearchRecordsUiComponent],
  entryComponents: [DialogUiComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SearchRecordsModule { }
