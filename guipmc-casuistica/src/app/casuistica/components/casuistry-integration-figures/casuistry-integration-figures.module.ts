import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CasuistryIntegrationFiguresUiComponent } from './casuistry-integration-figures-ui/casuistry-integration-figures-ui.component';
import { LayoutModule } from 'src/app/layout/layout.module';
import { NgxSpinnerModule } from 'ngx-spinner';



@NgModule({
  declarations: [CasuistryIntegrationFiguresUiComponent],
  imports: [
    CommonModule, LayoutModule, NgxSpinnerModule
  ]
})
export class CasuistryIntegrationFiguresModule { }
