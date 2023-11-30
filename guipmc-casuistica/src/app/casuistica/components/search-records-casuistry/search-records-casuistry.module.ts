import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchRecordsCasuistryUiComponent } from './search-records-casuistry-ui/search-records-casuistry-ui.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DialogUiComponent } from 'src/app/common/components/dialog/dialog-ui/dialog-ui.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSpinnerModule } from 'ngx-spinner';

import { ComponentsUXModule } from 'src/app/components-ux/components-ux.module';
import { LayoutModule } from 'src/app/layout/layout.module';
import { MatSelectModule } from '@angular/material/select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [SearchRecordsCasuistryUiComponent],
  imports: [CommonModule, BrowserModule, FormsModule, ReactiveFormsModule, AppRoutingModule, MatDatepickerModule,
    NgxSpinnerModule,ComponentsUXModule,LayoutModule, MatSelectModule, NgbModule],
  exports: [SearchRecordsCasuistryUiComponent],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'es-ES'}, FormsModule, ReactiveFormsModule, MatDatepickerModule],
  bootstrap: [SearchRecordsCasuistryUiComponent],
  entryComponents: [DialogUiComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SearchRecordsCasuistryModule { }
