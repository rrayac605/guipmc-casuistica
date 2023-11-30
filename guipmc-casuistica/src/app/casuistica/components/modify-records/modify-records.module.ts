import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModifyRecordsUiComponent } from './modify-records-ui/modify-records-ui.component';
import { CustomPipesModule } from 'src/app/common/pipe/custom-pipes.module';



@NgModule({
  declarations: [ModifyRecordsUiComponent],
  imports: [
    CommonModule,
    CustomPipesModule
  ]
})
export class ModifyRecordsModule { }
