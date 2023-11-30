import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordsDetailUiComponent } from './records-detail-ui/records-detail-ui.component';
import { CustomPipesModule } from 'src/app/common/pipe/custom-pipes.module';



@NgModule({
  declarations: [RecordsDetailUiComponent],
  imports: [
    CommonModule,
    CustomPipesModule
  ]
})
export class RecordsDetailModule { }
