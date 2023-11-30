import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApproveModificationsUiComponent } from './approve-modifications-ui/approve-modifications-ui.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ApproveModificationsUiComponent],
  imports: [
    CommonModule, FormsModule
  ]
})
export class ApproveModificationsModule { }
