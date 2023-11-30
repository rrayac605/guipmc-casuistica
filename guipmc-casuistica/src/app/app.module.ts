import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LayoutModule } from './layout/layout.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StatusFileModule } from './casuistica/components/status-file/status-file.module';
import { GetControlFiguresModule } from './casuistica/components/get-control-figures/get-control-figures.module';
import { RecordsDetailUiComponent } from './casuistica/components/records-detail/records-detail-ui/records-detail-ui.component';
// tslint:disable-next-line: max-line-length
import { CasuistryIntegrationFiguresUiComponent } from './casuistica/components/casuistry-integration-figures/casuistry-integration-figures-ui/casuistry-integration-figures-ui.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { SearchRecordsUiComponent } from './casuistica/components/search-records/search-records-ui/search-records-ui.component';
import { SearchRecordsCasuistryUiComponent } from './casuistica/components/search-records-casuistry/search-records-casuistry-ui/search-records-casuistry-ui.component'
import {ComponentsUXModule} from '././components-ux/components-ux.module';
import { PruebaUXComponent } from './casuistica/components/prueba-ux/prueba-ux.component';
import { ModifyRecordsUiComponent } from './casuistica/components/modify-records/modify-records-ui/modify-records-ui.component';
// tslint:disable-next-line: max-line-length
import { ApproveModificationsUiComponent } from './casuistica/components/approve-modifications/approve-modifications-ui/approve-modifications-ui.component';
import { LogInUiComponent } from './common/conteiners/log-in/log-in-ui/log-in-ui.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TokenInterceptor } from './common/interceptor/token-interceptor.service';
import { CreateCasuistryUiComponent } from './casuistica/components/create-casuistry/create-casuistry-ui/create-casuistry-ui.component';
import { DeleteMovementsUiComponent } from './casuistica/components/delete-movements/delete-movements-ui/delete-movements-ui.component';
import { ConsultCasuistryUiComponent } from './casuistica/components/consult-casuistry/consult-casuistry-ui/consult-casuistry-ui.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import {SearchRecordsCausiticaUiComponent} from './casuistica/components/search-records-causitica/search-records-causitica-ui/search-records-causitica-ui/search-records-causitica-ui.component';
import { NgxPaginationModule } from 'ngx-pagination';
import {ReportTypeRiskComponent} from './casuistica/components/report-type-risk/report-type-risk-ui/report-type-risk.component';
import { ReporteCodigoErrorComponent } from './casuistica/components/report-type-risk/report-type-risk-ui/tiposReporte/reporte-codigo-error/reporte-codigo-error.component';
import { ReporteTipoRiesgoComponent } from './casuistica/components/report-type-risk/report-type-risk-ui/tiposReporte/reporte-tipo-riesgo/reporte-tipo-riesgo.component';
import { ReporteConsecuenciaComponent } from './casuistica/components/report-type-risk/report-type-risk-ui/tiposReporte/reporte-consecuencia/reporte-consecuencia.component';
import { ConsultMovementsCasuistryModule } from './casuistica/components/consult-movements-casuistry/consult-movements-casuistry.module';
import { MatSelectModule } from '@angular/material/select';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { CreateCasuistryStUiComponent } from './casuistica/components/create-casuistry-st/create-casuistry-st-ui/create-casuistry-st-ui.component';
import { HomePageUiComponent } from './casuistica/components/home-page/home-page-ui/home-page-ui.component';
import { DatosPatronComponent } from './common/components/datos-patron/datos-patron.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoadingSpinnerModule } from './common/components/loading-spinner/loading-spinner.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import { CustomPipesModule } from './common/pipe/custom-pipes.module';
import { ReportCierreAnualComponent } from './casuistica/components/report-cierre-anual/report-cierre-anual/report-cierre-anual.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import { registerLocaleData } from '@angular/common';
import localePy from '@angular/common/locales/es';
import { VersionComponent } from './casuistica/components/version/version.component';

registerLocaleData(localePy, 'es');
@NgModule({
  declarations: [
    AppComponent,
    RecordsDetailUiComponent,
    CasuistryIntegrationFiguresUiComponent,
    SearchRecordsUiComponent,
    SearchRecordsCasuistryUiComponent,
    LogInUiComponent,
    PruebaUXComponent,
    ModifyRecordsUiComponent,
    ApproveModificationsUiComponent,
    CreateCasuistryUiComponent,
    CreateCasuistryStUiComponent,
    DeleteMovementsUiComponent,
    ConsultCasuistryUiComponent,
    SearchRecordsCausiticaUiComponent,
    ReportTypeRiskComponent,
    ReporteCodigoErrorComponent,
    ReporteTipoRiesgoComponent,
    ReporteConsecuenciaComponent,
    DatosPatronComponent,
    HomePageUiComponent,
    ReportCierreAnualComponent,
    VersionComponent
  ],
    imports: [
        NgxSpinnerModule,
        BrowserModule,
        AppRoutingModule,
        LayoutModule,
        HttpClientModule,
        BrowserAnimationsModule,
        TooltipModule,
        NgbModule,
        StatusFileModule,
        GetControlFiguresModule,
        MatProgressSpinnerModule, FormsModule, ReactiveFormsModule, MatDatepickerModule, MatSelectModule,
        MatTooltipModule,
        ComponentsUXModule,
        NgxPaginationModule,
        ConsultMovementsCasuistryModule,
        MatAutocompleteModule, MatInputModule, MatFormFieldModule,
        LoadingSpinnerModule,
        CustomPipesModule,
        TypeaheadModule.forRoot(), MatCheckboxModule
    ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
}],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }

