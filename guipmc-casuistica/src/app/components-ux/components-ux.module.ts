import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbUxComponent } from './breadcrumb-ux/breadcrumb-ux.component';
import { StorageServiceModule } from 'ngx-webstorage-service';


@NgModule({
  declarations: [BreadcrumbUxComponent],
  imports: [
    CommonModule,
    StorageServiceModule 
  ], exports: [
    BreadcrumbUxComponent
  ]
})
export class ComponentsUXModule { }
