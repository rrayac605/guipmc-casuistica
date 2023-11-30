import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultMovementsCasuistryUiComponent } from './consult-movements-casuistry-ui/consult-movements-casuistry-ui.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LayoutModule } from 'src/app/layout/layout.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ComponentsUXModule } from 'src/app/components-ux/components-ux.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DialogUiComponent } from 'src/app/common/components/dialog/dialog-ui/dialog-ui.component';



@NgModule({
  declarations: [ConsultMovementsCasuistryUiComponent],
  imports: [CommonModule, BrowserModule, FormsModule,
    ReactiveFormsModule, AppRoutingModule, MatDatepickerModule, LayoutModule, NgxSpinnerModule, ComponentsUXModule],
  exports: [ConsultMovementsCasuistryUiComponent],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'es-ES'}, FormsModule, ReactiveFormsModule],
  bootstrap: [ConsultMovementsCasuistryUiComponent],
  entryComponents: [DialogUiComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ConsultMovementsCasuistryModule { }
