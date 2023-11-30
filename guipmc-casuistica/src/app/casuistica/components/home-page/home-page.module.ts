import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageUiComponent } from './home-page-ui/home-page-ui.component';
import { ComponentsUXModule } from 'src/app/components-ux/components-ux.module';
import { LayoutModule } from 'src/app/layout/layout.module';

@NgModule({
  declarations: [HomePageUiComponent],
  imports: [
    CommonModule,
    ComponentsUXModule,
    LayoutModule
  ]
})

export class HomePageModule { }