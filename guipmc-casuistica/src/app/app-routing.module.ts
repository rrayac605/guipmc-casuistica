import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogInUiComponent } from './common/conteiners/log-in/log-in-ui/log-in-ui.component';
// tslint:disable-next-line: max-line-length
import { GetControlFiguresUiComponent } from './casuistica/components/get-control-figures/get-control-figures-ui/get-control-figures-ui.component';
import { SearchStatusFileComponent } from './casuistica/components/status-file/search-status-file/search-status-file.component';
import { SearchRecordsUiComponent } from './casuistica/components/search-records/search-records-ui/search-records-ui.component';
import {RecordsDetailUiComponent} from './casuistica/components/records-detail/records-detail-ui/records-detail-ui.component';
// tslint:disable-next-line: max-line-length
import {CasuistryIntegrationFiguresUiComponent} from './casuistica/components/casuistry-integration-figures/casuistry-integration-figures-ui/casuistry-integration-figures-ui.component';
import {PruebaUXComponent} from './casuistica/components/prueba-ux/prueba-ux.component';
import { ModifyRecordsUiComponent } from './casuistica/components/modify-records/modify-records-ui/modify-records-ui.component';
// tslint:disable-next-line: max-line-length
import { ApproveModificationsUiComponent } from './casuistica/components/approve-modifications/approve-modifications-ui/approve-modifications-ui.component';
import { AdminGuard } from './common/services/guards/admin.guard';
import { Perfil2Guard } from './common/services/guards/perfil2.guard';
import { Perfil3Guard } from './common/services/guards/perfil3.guard';
import { Perfil4Guard } from './common/services/guards/perfil4.guard';
import { Perfil5Guard } from './common/services/guards/perfil5.guard';
import { CreateCasuistryUiComponent } from './casuistica/components/create-casuistry/create-casuistry-ui/create-casuistry-ui.component';
import { DeleteMovementsUiComponent } from './casuistica/components/delete-movements/delete-movements-ui/delete-movements-ui.component';
import { Perfil1Guard } from './common/services/guards/perfil1.guard';
import { ConsultCasuistryUiComponent } from './casuistica/components/consult-casuistry/consult-casuistry-ui/consult-casuistry-ui.component';

import { SearchRecordsCasuistryUiComponent } from './casuistica/components/search-records-casuistry/search-records-casuistry-ui/search-records-casuistry-ui.component';
import {SearchRecordsCausiticaUiComponent} from './casuistica/components/search-records-causitica/search-records-causitica-ui/search-records-causitica-ui/search-records-causitica-ui.component';
import {ReportTypeRiskComponent} from './casuistica/components/report-type-risk/report-type-risk-ui/report-type-risk.component';
import { ConsultMovementsCasuistryUiComponent } from './casuistica/components/consult-movements-casuistry/consult-movements-casuistry-ui/consult-movements-casuistry-ui.component';

import { Perfil6Guard } from './common/services/guards/perfil6.guard';
// tslint:disable-next-line: max-line-length
import { CreateCasuistryStUiComponent } from './casuistica/components/create-casuistry-st/create-casuistry-st-ui/create-casuistry-st-ui.component';
// tslint:disable-next-line: max-line-length
import { HomePageUiComponent } from './casuistica/components/home-page/home-page-ui/home-page-ui.component';
// tslint:disable-next-line: max-line-length
import { ConsultaCasuisticaGuard } from './common/services/guards/consultaCasuistica.guard';
import {ReportCierreAnualComponent} from './casuistica/components/report-cierre-anual/report-cierre-anual/report-cierre-anual.component';
import {PerfilReporteAnualGuard} from './common/services/guards/perfil-reporte-anual.guard';
import { VersionComponent } from './casuistica/components/version/version.component';

const routes: Routes = [
  { path: 'searchRecords', component: SearchRecordsUiComponent, canActivate: [AdminGuard, Perfil2Guard] },
  { path: 'searchRecordsCasuistry', component: SearchRecordsCasuistryUiComponent, canActivate: [AdminGuard, ConsultaCasuisticaGuard] },
  { path: 'searchRecords/:id', component: SearchRecordsUiComponent, canActivate: [AdminGuard, Perfil2Guard] },
  { path: 'recordsDetailUiComponent', component: RecordsDetailUiComponent, canActivate: [AdminGuard, Perfil2Guard] },
  { path: 'modifyRecords', component: ModifyRecordsUiComponent, canActivate: [AdminGuard, Perfil3Guard],
    data : {title: 'Modificación movimiento'} },
  { path: 'approveModifications', component: ApproveModificationsUiComponent, canActivate: [AdminGuard, Perfil4Guard],
    data : {title: 'Aprobar movimiento'} },

  { path: 'searchStatusFiles', component: SearchStatusFileComponent, canActivate: [AdminGuard, Perfil5Guard] },
  { path: 'controlFigures', component: GetControlFiguresUiComponent, canActivate: [AdminGuard, Perfil5Guard],
    data : {title: 'Consultar cifras de control'} },
  { path: 'searchRecordsCausiticaUiComponent', component: SearchRecordsCausiticaUiComponent, canActivate: [AdminGuard] },
  { path: 'reportTypeRiskComponent', component: ReportTypeRiskComponent,canActivate: [AdminGuard] },
  { path: 'casuistryIntegrationFig', component: CasuistryIntegrationFiguresUiComponent, canActivate: [AdminGuard],
    data : {title: 'Consulta CIC'} },
  { path: 'pruebaUX', component: PruebaUXComponent },
  { path: 'login', component: LogInUiComponent },
  { path: 'createCasuistry', component: CreateCasuistryUiComponent, canActivate: [AdminGuard, Perfil1Guard] },
  { path: 'createCasuistrySt', component: CreateCasuistryStUiComponent, canActivate: [AdminGuard, Perfil6Guard] },
  { path: 'deleteCasuistry', component: DeleteMovementsUiComponent, canActivate: [AdminGuard] },
  { path: 'homePage', component: HomePageUiComponent },

  { path: 'consultCasuistry', component: ConsultCasuistryUiComponent, canActivate: [AdminGuard] },
  { path: 'movementsCasuistry', component: ConsultMovementsCasuistryUiComponent, canActivate: [AdminGuard] },
  { path: 'reportCierreAnual', component: ReportCierreAnualComponent, canActivate: [AdminGuard, PerfilReporteAnualGuard]},
  { path: 'version', component: VersionComponent },
  { path: '**', redirectTo: 'login' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
