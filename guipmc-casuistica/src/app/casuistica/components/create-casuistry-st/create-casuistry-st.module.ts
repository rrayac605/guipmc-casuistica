import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCasuistryStUiComponent } from './create-casuistry-st-ui/create-casuistry-st-ui.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { LoadingSpinnerModule } from 'src/app/common/components/loading-spinner/loading-spinner.module';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [CreateCasuistryStUiComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    LoadingSpinnerModule,
    MatTooltipModule
  ]
})
export class CreateCasuistryStModule { }
