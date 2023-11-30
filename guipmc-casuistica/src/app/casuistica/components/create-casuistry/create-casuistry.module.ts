import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCasuistryUiComponent } from './create-casuistry-ui/create-casuistry-ui.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoadingSpinnerModule } from 'src/app/common/components/loading-spinner/loading-spinner.module';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [CreateCasuistryUiComponent],
  imports: [
    CommonModule,
    TypeaheadModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    LoadingSpinnerModule,
    MatTooltipModule
  ]
})
export class CreateCasuistryModule { }
