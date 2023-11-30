import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetControlFiguresUiComponent } from './get-control-figures-ui/get-control-figures-ui.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DialogUiComponent } from 'src/app/common/components/dialog/dialog-ui/dialog-ui.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { LayoutModule } from 'src/app/layout/layout.module';
import { NgxSpinnerModule } from 'ngx-spinner';

import {ComponentsUXModule} from '../../../components-ux/components-ux.module';

@NgModule({
  declarations: [GetControlFiguresUiComponent],
  imports: [CommonModule, BrowserModule, FormsModule,
    ReactiveFormsModule, AppRoutingModule, MatDatepickerModule, LayoutModule, NgxSpinnerModule,ComponentsUXModule],
  exports: [GetControlFiguresUiComponent],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'es-ES'}, FormsModule, ReactiveFormsModule],
  bootstrap: [GetControlFiguresUiComponent],
  entryComponents: [DialogUiComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class GetControlFiguresModule { }
