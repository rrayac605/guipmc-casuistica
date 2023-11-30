import { NgModule } from '@angular/core';
import { DateStringPipe } from 'src/app/common/pipe/date-string.pipe';



@NgModule({
  declarations: [DateStringPipe],
  exports: [
    DateStringPipe
  ]
})
export class CustomPipesModule { }
