import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SearchStatusFileComponent } from './search-status-file/search-status-file.component';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LayoutModule } from 'src/app/layout/layout.module';
import { BreadcrumbUxComponent } from 'src/app/components-ux/breadcrumb-ux/breadcrumb-ux.component';
import { ComponentsUXModule } from 'src/app/components-ux/components-ux.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DialogUiComponent } from 'src/app/common/components/dialog/dialog-ui/dialog-ui.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
  declarations: [SearchStatusFileComponent],
  imports: [CommonModule, BrowserModule, FormsModule,
    ReactiveFormsModule, AppRoutingModule, MatDatepickerModule,
     LayoutModule, 
     NgxSpinnerModule,
     ComponentsUXModule,NgxPaginationModule
    ],
  exports: [SearchStatusFileComponent],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'es-ES'}, FormsModule, ReactiveFormsModule],
  bootstrap: [SearchStatusFileComponent],
  entryComponents: [DialogUiComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class StatusFileModule { }
