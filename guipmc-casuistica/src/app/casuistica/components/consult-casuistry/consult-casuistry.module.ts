import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultCasuistryUiComponent } from './consult-casuistry-ui/consult-casuistry-ui.component';
import { LayoutModule } from 'src/app/layout/layout.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TooltipModule } from 'ng2-tooltip-directive';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [ConsultCasuistryUiComponent],
  imports: [
    CommonModule, LayoutModule, NgxSpinnerModule, BrowserModule

  ]
})
export class ConsultCasuistryModule { }
