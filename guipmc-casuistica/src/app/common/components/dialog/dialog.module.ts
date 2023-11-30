import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogUiComponent } from './dialog-ui/dialog-ui.component';



@NgModule({
  declarations: [DialogUiComponent],
  imports: [
    CommonModule
  ],
  exports: [
    DialogUiComponent
  ]
})
export class DialogModule { }
