import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { default as _rollupMoment, Moment } from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogUiComponent } from 'src/app/common/components/dialog/dialog-ui/dialog-ui.component';
import { DelegationService } from 'src/app/common/services/catalogs/delegation.service';
import { SubDelegationService } from 'src/app/common/services/catalogs/sub-delegation.service';
import { Delegacion } from 'src/app/common/models/delegation.model';
import { SubDelegacion } from 'src/app/common/models/subdelegation.model';
import { Catalogs } from 'src/app/common/models/catalogs.model';
import { CatalogsService } from 'src/app/common/services/catalogs/catalogs.service';
import { ResultControlFigure } from 'src/app/casuistica/models/control-figures/result-control-figure';
import { CifrasControlTotales } from 'src/app/casuistica/models/control-figures/cifrasControlTotales';
import { FindControlFiguresCausiticaService } from 'src/app/casuistica/services/get-control-figures-causitica/find-control-figures-causitica.service';
import { FindTypeReportService } from 'src/app/casuistica/services/get-type-report/find-type-report.service';


import { DetalleConsultaDTO } from 'src/app/casuistica/models/control-figures/detalleConsultaDTO';
import { DetalleConsultaCodErrorDTO } from 'src/app/casuistica/models/control-figures/detalleConsultaCodErrorDTO';
import { DetalleTotalesCodErrorDTO } from 'src/app/casuistica/models/control-figures/detalleTotalesCodErrorDTO';
import { DetalleConsultaTipoRiesgoDTO } from 'src/app/casuistica/models/control-figures/detalleConsultaTipoRiesgoDTO';
import { DetalleConsultaConsecuenciaDTO } from 'src/app/casuistica/models/control-figures/detalleConsultaConsecuenciaDTO';

import { ActivationEnd } from '@angular/router';


import { FormControlFigure } from 'src/app/casuistica/models/control-figures/form-control-figure';
import { Login } from 'src/app/common/models/security/login';
import { SecurityService } from 'src/app/common/services/security/security.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateUtils } from 'src/app/common/functions/DateUtils';
import { CodigoErrorUtil } from 'src/app/common/functions/CodigoErrorUtil';
import { ReporteCodigoErrorComponent } from '../report-type-risk-ui/tiposReporte/reporte-codigo-error/reporte-codigo-error.component';
import { BreadcrumbUxComponent } from '../../../../components-ux/breadcrumb-ux/breadcrumb-ux.component';
import { Subject, Observable } from 'rxjs';
import { filter, map, switchMap, mapTo, tap } from 'rxjs/operators';
import { timer } from 'rxjs';
import * as FileSaver from 'file-saver';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent, Event, NavigationStart, NavigationError } from '@angular/router';
import { ValidateSelect } from 'src/app/common/validators/common.validator';
import { event } from 'jquery';
import { chargeBeginCalendar, chargeEndCalendar, months } from 'src/app/common/utils/date-picker.util';


declare var $: any;
@Component({
  selector: 'app-report-type-risk',
  templateUrl: './report-type-risk.component.html',
  styleUrls: ['./report-type-risk.component.scss']
})
export class ReportTypeRiskComponent implements OnInit {
  constructor(private formBuilder: FormBuilder,
    private findDelegation: DelegationService, private findSubDelegation: SubDelegationService,
    private findCatalogo: CatalogsService, private findTypeReportService: FindTypeReportService,
    private modalService: NgbModal, private securityService: SecurityService, private spinner: NgxSpinnerService,
    private router: Router, private activatedRoute: ActivatedRoute) {
  }
  //public titulo: string = "Reporte Tipo de Riesgo";
  public titulo = "Reportes/Distribución de la casuística por tipo de error, riesgo y consecuencia";
  public visualizaPerfil2;
  public tituloReporte = "";
  public formGroup: FormGroup;
  public from: FormControl;
  public to: FormControl;
  public registrationCase: FormControl;
  public fileType: FormControl;
  public delegation: FormControl;
  public subDelegation: FormControl;
  public resultControlFigure: ResultControlFigure;

  public detalleConsultaDTO: DetalleConsultaDTO[] = [];
  public detalleConsultaCodErrorDTO: DetalleConsultaCodErrorDTO[] = [];
  public conteoAnteriorNuevo = new Map<string, DetalleConsultaCodErrorDTO>();

  //************************  TIPO DE RIESGO   1 Y 2 ***********************

  detalleRegistroTGRegistroDTO: DetalleConsultaTipoRiesgoDTO;
  detalleRegistroTGDiasDTO: DetalleConsultaTipoRiesgoDTO;
  detalleRegistroTGPorcentajeDTO: DetalleConsultaTipoRiesgoDTO;
  detalleRegistroTGDefuncionesDTO: DetalleConsultaTipoRiesgoDTO;

  // **********************   TIPO DE RIESGO 3 Y 4 ************************
  public detalleRegistroTGRegistro2DTO: DetalleConsultaTipoRiesgoDTO;
  public detalleRegistroTGDias2DTO: DetalleConsultaTipoRiesgoDTO;
  public detalleRegistroTGPorcentaje2DTO: DetalleConsultaTipoRiesgoDTO;
  public detalleRegistroTGDefunciones2DTO: DetalleConsultaTipoRiesgoDTO;

  // *******************   CONCECUENCIA   *******************************
  public detalleConsultaConsecuencia1DTO: DetalleConsultaConsecuenciaDTO[] = [];
  public detalleConsultaConsecuencia2DTO: DetalleConsultaConsecuenciaDTO[] = [];
  public detalleConsultaConsecuencia3DTO: DetalleConsultaConsecuenciaDTO[] = [];
  public detalleConsultaConsecuencia4DTO: DetalleConsultaConsecuenciaDTO[] = [];
  public detalleTotalesCodErrorDTO: DetalleTotalesCodErrorDTO;


  public cifrasControlTotales: CifrasControlTotales = new CifrasControlTotales();
  public selectDelegacion: Delegacion[] = [];
  public selectSubDelegacion: SubDelegacion[] = [];



  public registrationCaseSelect: Catalogs[] = [];
  public fileTypeSelect: Catalogs[] = [];
  public user: Login = new Login();
  public titDialogo: string;
  public messDialogo: string;
  public tipoReporte: string = "0";

  private areCatalogsLoaded = [false, false];

  public formToMemory: any;
  @ViewChild(ReporteCodigoErrorComponent) hijoCodigoError: ReporteCodigoErrorComponent;
  @ViewChild(BreadcrumbUxComponent) hijoBread: BreadcrumbUxComponent;


  ngOnInit(): void {
    setTimeout(() => {
      this.spinner.show();
    }, 0);
    console.log("NICIO DE REPORTES AAA1");
    this.user = JSON.parse(localStorage.getItem('user'));
    this.buildForm();
    this.formToMemory = JSON.parse(localStorage.getItem('form'));
    this.chargeDelegation();
    if (this.user.userInfo.businessCategory !== null) {
      this.chargeSubDelegation(this.user.userInfo.businessCategory.toString());
    } else {
      this.areCatalogsLoaded[1] = true;
      this.validateIfCatalogsAreLoaded();
    }
    this.visualizaPerfil2 = this.securityService.visualizaPerfil2(this.user);



    this.chargeCalendar();
    //*********  borrar  */


  }

  private validateIfCatalogsAreLoaded() {
    if (this.areCatalogsLoaded.reduce((prev, current) => prev && current)) {
      this.spinner.hide();
    }
  }

  get fromDateForm() { return this.formGroup.get('date') as FormControl; }
  get toDateForm() { return this.formGroup.get('date2') as FormControl; }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      date: [],
      date2: [],
      tipoReporte: [0],
      delegation: [-1],
      subDelegation: [-1]
    });
    this.formGroup.get('tipoReporte')
      .valueChanges
      .subscribe(value => {
        //  alert(" EL CAMBIO DE LA VARIAB LES ES  "+value);

        //  if(value == "1"){
        //      this.tipoReporte="1";
        //  }
        //  if(value == "2"){
        //      this.tipoReporte="2";
        //  }
        //  if(value == "3"){
        //      this.tipoReporte="3";
        //  }
      });

  }



  //********************  SE VERIFICA EL CAMBIO DEL SUBDELEGACION  ****************/
  public chargeDelegation() {
    this.findDelegation.find().subscribe(
      (data) => { // Success
        this.areCatalogsLoaded[0] = true;
        this.validateIfCatalogsAreLoaded();
        this.selectDelegacion = data;
        this.filterDelegation(this.user);
        console.log(this.selectDelegacion);
      },
      (error) => {
        this.areCatalogsLoaded[0] = true;
        this.validateIfCatalogsAreLoaded();
        console.error(error);
      }
    );

  }

  public filterDelegation(user: Login) {
    if (user !== null) {
      if (user.userInfo.businessCategory !== undefined && user.userInfo.businessCategory !== null) {
        const result = this.selectDelegacion.filter(delegacion => delegacion.id === user.userInfo.businessCategory);
        if (result.length > 0) {
          this.selectDelegacion = result;
          const contador = timer(700);
          contador.subscribe((n) => {
            this.formGroup.get('delegation').setValue(this.formToMemory !== null ?
              this.formToMemory.delegation.toString() : this.user.userInfo.businessCategory.toString());
          });
          this.formGroup.get('delegation').setValidators(Validators.compose([
            Validators.required, ValidateSelect]));
        }
      }
      if (user.userInfo.departmentNumber !== undefined && user.userInfo.departmentNumber !== null) {
        const result = this.selectSubDelegacion.filter(subDelegacion => subDelegacion.id === user.userInfo.departmentNumber);
        if (result.length > 0) {
          this.selectSubDelegacion = result;
          const contador = timer(700);
          contador.subscribe((n) => {
            this.formGroup.get('subDelegation').setValue(this.formToMemory !== null ?
              this.formToMemory.subDelegation.toString() : result[0].clave);
          });
          this.formGroup.get('subDelegation').setValidators(Validators.compose([
            Validators.required, ValidateSelect]));
        }
      }
    }
  }

  public chargeSubDelegation(clave: string) {
    this.findSubDelegation.find(clave).subscribe(
      (data) => { // Success
        this.areCatalogsLoaded[1] = true;
        this.validateIfCatalogsAreLoaded();
        this.selectSubDelegacion = data;
        this.filterDelegation(this.user);
        console.log(this.selectSubDelegacion);
      },
      (error) => {
        this.areCatalogsLoaded[1] = true;
        this.validateIfCatalogsAreLoaded();
        console.error(error);
      }
    );

  }

  ngAfterViewInit() {
    this.chargeCalendar();
    //this.hijoBread.ngOnInit();
  }

  public chargeCalendar() {
    chargeBeginCalendar('#fechaInicioReporte', this.toDateForm, this.fromDateForm, this.showMessage.bind(this));
    chargeEndCalendar('#fechaFinReporte', this.toDateForm, this.fromDateForm, this.showMessage.bind(this));
    const f = new Date();
    this.formGroup.get('date2').setValue(months[f.getMonth()] + ' ' + f.getFullYear());
    this.formGroup.get('date').setValue(months[f.getMonth()] + ' ' + f.getFullYear());
  }


  public clear() {
    // tslint:disable-next-line: max-line-length
    const meses = new Array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
    const f = new Date();
    this.formGroup.get('date2').setValue(meses[f.getMonth()] + ' ' + f.getFullYear());
    this.formGroup.get('date').setValue(meses[f.getMonth()] + ' ' + f.getFullYear());
    this.formGroup.get('subDelegation').setValue(-1);
    this.formGroup.get('delegation').setValue(-1);
    this.formGroup.get('tipoReporte').setValue(0);

    this.resultControlFigure = new ResultControlFigure();
    this.detalleConsultaDTO = [];
    this.cifrasControlTotales = new CifrasControlTotales();
    this.tipoReporte = "0";
  }

  public validateFormSearch() {
    let result = 1;
    const res = this.formGroup.value;
    // tslint:disable-next-line: ban-types
    const arrayDate: string[] = res.date.split(' ');
    const arrayDate2: string[] = res.date2.split(' ');
    const fDate: Date = new Date(Date.parse(DateUtils.monthToEnglish(arrayDate[0].toString()) + ',' + arrayDate[1]));
    const toDate: Date = new Date(Date.parse(DateUtils.monthToEnglish(arrayDate2[0].toString()) + ',' + arrayDate2[1]));
    console.log(fDate.getMonth() + 1 + '-' + fDate.getFullYear());
    console.log(toDate.getMonth() + 1 + '-' + toDate.getFullYear());

    if ((fDate === null && toDate === null)
      || fDate === null || toDate === null || ($('#fechaInicio1causitica').val() === '' || $('#fechaFin1causitica').val() === '')) {
      result = 0;
    }
    if (fDate > toDate) {
      this.showMessage('Validar fechas ingresadas', 'Atención');
      result = 0;
    }

    if (res.tipoReporte === 0) {
      result = 0;
    }
    return result;
  }

  public obtenerForm(): FormControlFigure {
    const result = this.formGroup.value;
    const formData = new FormControlFigure();
    const arrayDate: string[] = result.date.split(' ');
    const arrayDate2: string[] = result.date2.split(' ');
    if (arrayDate.length > 0) {
      const fDate: Date = new Date(Date.parse(DateUtils.monthToEnglish(arrayDate[0].toString()) + ',' + arrayDate[1]));
      const toDate: Date = new Date(Date.parse(DateUtils.monthToEnglish(arrayDate2[0].toString()) + ',' + arrayDate2[1]));
      console.log(fDate.getMonth() + 1 + '-' + fDate.getFullYear());
      console.log(toDate.getMonth() + 1 + '-' + toDate.getFullYear());
      formData.fromMonth = (fDate.getMonth() + 1) + '';
      formData.fromYear = (fDate.getFullYear()) + '';
      formData.toMonth = (toDate.getMonth() + 1) + '';
      formData.toYear = (toDate.getFullYear()) + '';
    }

    formData.cveDelegation = result.delegation <= 0 ? '' : result.delegation;
    formData.delRegPat = result.delegation <= 0 ? false : true;
    formData.cveSubdelegation = result.subDelegation <= 0 ? '' : result.subDelegation;
    for (let delegacionNssUnitaria of this.selectDelegacion) {
      if (Number(delegacionNssUnitaria.clave) === Number(formData.cveDelegation)) {
        formData.desDelegation = delegacionNssUnitaria.descripcion;
        break;
      }
    }
    for (let subdelegacionNssUnitaria of this.selectSubDelegacion) {
      if (Number(subdelegacionNssUnitaria.clave) === Number(formData.cveSubdelegation)) {
        formData.desSubdelegation = subdelegacionNssUnitaria.descripcion;
        break;
      }
    }
    formData.page = null;
    return formData;
  }

  public search() {

    const valid = this.validateFormSearch();
    const formData = new FormControlFigure();
    console.log('is valid: ' + valid);
    if (valid === 1) {
      const result = this.formGroup.value;
      if (result.delegation <= 0) {
        this.tituloReporte = "Nacional";
      } else {
        var tituloDelegacion: string = "";
        var tituloSubdelegacion: string = "";
        this.selectDelegacion.forEach(function (item) {
          const itemJ = item;

          if (itemJ.clave === result.delegation) {
            tituloDelegacion = itemJ.descripcion;
          }

        });
        this.tituloReporte = tituloDelegacion;

        if (0 <= result.subDelegation) {
          console.log("ENTRA EL ELEGACION " + this.tituloReporte);
          this.selectSubDelegacion.forEach(function (item) {
            const itemJ = item;
            console.log("CLACE:::" + JSON.stringify(itemJ));
            if (itemJ.clave === result.subDelegation) {
              tituloSubdelegacion = itemJ.descripcion;
            }

          });

          this.tituloReporte = this.tituloReporte + "/" + tituloSubdelegacion;

        }

      }
      const formData = this.obtenerForm();
      console.log(formData);
      this.spinner.show();

      if (result.tipoReporte === "1") {


        this.findReporteCodigoError(formData);

      }

      if (result.tipoReporte === "2") {


        this.findReporteTipoRiesgo(formData);
      }


      if (result.tipoReporte === "3") {


        this.findReporteConsecuencia(formData);

      }






    } else {
      this.showMessage('Ingresar datos requeridos.', 'Atención');
      // tslint:disable-next-line: max-line-length
      const meses = new Array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
      const f = new Date();
      this.formGroup.get('date2').setValue(meses[f.getMonth()] + ' ' + f.getFullYear());
      this.formGroup.get('date').setValue(meses[f.getMonth()] + ' ' + f.getFullYear());
    }
  }


  public findReporteCodigoErrorPDF() {
    const formData = this.obtenerForm();
    console.log(formData);

    if (this.user.userInfo.businessCategory || this.user.userInfo.departmentNumber) {
      formData.isDelegacional = true;
    }

    this.spinner.show();

    this.findTypeReportService.findPDF(formData).subscribe(
      (data) => { // Success
        this.spinner.hide();
        const contentType = 'application/pdf';
        this.b64toBlob(data, contentType);
      },
      (error) => {
        const contentType = 'application/pdf';
        this.b64toBlob(error.error.text, contentType);
        this.spinner.hide();
      }
    );
  }

  public findReporteCodigoError(formData: FormControlFigure) {
    this.tipoReporte = "0";
    this.findTypeReportService.find(formData).subscribe(
      (data) => { // Success
        this.spinner.hide();
        let detalle: DetalleConsultaCodErrorDTO;
        this.detalleConsultaCodErrorDTO = [];
        this.detalleTotalesCodErrorDTO = new DetalleTotalesCodErrorDTO();
        const mapError = new Map<string, DetalleConsultaCodErrorDTO>();
        let listaError = null;
        const valores:DetalleConsultaCodErrorDTO[] = Object.values(data.body);
        this.conteoAnteriorNuevo = new Map<string, DetalleConsultaCodErrorDTO>();
        Object.keys(data.body).forEach((k, i) => {
          if(k != "conteoAnterior" && k != "conteoNuevos"){
            mapError.set(k, valores[i]);
          }else{
            this.conteoAnteriorNuevo.set(k, valores[i]);
          }
        });
        listaError = Object.fromEntries(mapError);
        this.detalleTotalesCodErrorDTO.numTotalRTT = 0;
        this.detalleTotalesCodErrorDTO.numTotalST3 = 0;
        this.detalleTotalesCodErrorDTO.numTotalST5 = 0;
        this.detalleTotalesCodErrorDTO.numTotalAJU = 0;
        this.detalleTotalesCodErrorDTO.numTotalCOD = 0;
        this.detalleTotalesCodErrorDTO.numTotalROD = 0;
        //Otras
        this.detalleTotalesCodErrorDTO.numTotalRTTOtras = 0;
        this.detalleTotalesCodErrorDTO.numTotalST3Otras = 0;
        this.detalleTotalesCodErrorDTO.numTotalST5Otras = 0;
        this.detalleTotalesCodErrorDTO.numTotalAJUOtras = 0;
        this.detalleTotalesCodErrorDTO.numTotalCODOtras = 0;
        this.detalleTotalesCodErrorDTO.numTotalRODOtras = 0;
        this.detalleTotalesCodErrorDTO.numTotalTipoError = 0;
        this.detalleTotalesCodErrorDTO.numTotalTipoErrorOtras = 0;
        var values = Object.keys(listaError).map(function (e) {
          return listaError[e];
        })
        values.forEach(value => {
          detalle = new DetalleConsultaCodErrorDTO();
          var codUtil = CodigoErrorUtil.buscarCodigo(value['numError']);
          console.log("____________ EL CDIGO " + codUtil);
          //Errores
          detalle.descripcion = codUtil;
          detalle.numError = value['numError'];
          //Misma delegacion
          detalle.numRTT = value['numRTT'];
          this.detalleTotalesCodErrorDTO.numTotalRTT = this.detalleTotalesCodErrorDTO.numTotalRTT + value['numRTT'];

          detalle.numST3 = value['numST3'];
          this.detalleTotalesCodErrorDTO.numTotalST3 = this.detalleTotalesCodErrorDTO.numTotalST3 + value['numST3'];

          detalle.numST5 = value['numST5'];
          this.detalleTotalesCodErrorDTO.numTotalST5 = this.detalleTotalesCodErrorDTO.numTotalST5 + value['numST5'];

          detalle.numAJU = value['numAJU'];
          this.detalleTotalesCodErrorDTO.numTotalAJU = this.detalleTotalesCodErrorDTO.numTotalAJU + value['numAJU'];

          detalle.numCOD = value['numCOD'];
          this.detalleTotalesCodErrorDTO.numTotalCOD = this.detalleTotalesCodErrorDTO.numTotalCOD + value['numCOD'];

          detalle.numROD = value['numROD'];
          this.detalleTotalesCodErrorDTO.numTotalROD = this.detalleTotalesCodErrorDTO.numTotalROD + value['numROD'];
          //Otras
          detalle.numRTTOtras = value['numRTTOtras'];
          this.detalleTotalesCodErrorDTO.numTotalRTTOtras = this.detalleTotalesCodErrorDTO.numTotalRTTOtras + value['numRTTOtras'];

          detalle.numST3Otras = value['numST3Otras'];
          this.detalleTotalesCodErrorDTO.numTotalST3Otras = this.detalleTotalesCodErrorDTO.numTotalST3Otras + value['numST3Otras'];

          detalle.numST5Otras = value['numST5Otras'];
          this.detalleTotalesCodErrorDTO.numTotalST5Otras = this.detalleTotalesCodErrorDTO.numTotalST5Otras + value['numST5Otras'];

          detalle.numAJUOtras = value['numAJUOtras'];
          this.detalleTotalesCodErrorDTO.numTotalAJUOtras = this.detalleTotalesCodErrorDTO.numTotalAJUOtras + value['numAJUOtras'];

          detalle.numCODOtras = value['numCODOtras'];
          this.detalleTotalesCodErrorDTO.numTotalCODOtras = this.detalleTotalesCodErrorDTO.numTotalCODOtras + value['numCODOtras'];

          detalle.numRODOtras = value['numRODOtras'];
          this.detalleTotalesCodErrorDTO.numTotalRODOtras = this.detalleTotalesCodErrorDTO.numTotalRODOtras + value['numRODOtras'];
          //Totales
          detalle.numTotal = value['numTotal'];
          this.detalleTotalesCodErrorDTO.numTotalTipoError = this.detalleTotalesCodErrorDTO.numTotalTipoError + value['numTotal'];

          detalle.numTotalOtras = value['numTotalOtras'];
          this.detalleTotalesCodErrorDTO.numTotalTipoErrorOtras = this.detalleTotalesCodErrorDTO.numTotalTipoErrorOtras + value['numTotalOtras'];

          this.detalleConsultaCodErrorDTO.push(detalle);
        });
        if (this.detalleConsultaCodErrorDTO.length <= 0) {
          this.tipoReporte = "0";
          this.showMessage('No se encontraron resultados con los criterios ingresados', 'Atención');
        }else {
          this.tipoReporte = "1";
        }
      },
      (error) => {
        this.spinner.hide();
        console.error(error);
      }
    );
  }

  public findReporteTipoRiesgoPDF() {
    const formData = this.obtenerForm();
    console.log(formData);
    this.spinner.show();
    this.findTypeReportService.findTipoRiesgoPDF(formData).subscribe(
      (data) => { // Success
        this.spinner.hide();
        const contentType = 'application/pdf';
        this.b64toBlob(data, contentType);
      },
      (error) => {
        const contentType = 'application/pdf';
        this.b64toBlob(error.error.text, contentType);
        this.spinner.hide();
      }
    );
  }
  public findReporteTipoRiesgo(formData: FormControlFigure) {
    this.tipoReporte = "0";
    this.findTypeReportService.findTipoRiesgo(formData).subscribe(
      (data) => { // Success
        this.spinner.hide();
        //this.resultControlFigure = data.body;
        console.log("---------- TIPO DE RIESGO   --------------------- ");
        console.log(JSON.stringify(data.body));
        var listaError = data.body;
        console.log("---------- OBJETO 1 ------ ");
        console.log(JSON.stringify(listaError['1']));
        //*************  VALIDAMOS QUE EL OBJETO QUE TRAEMOS TRAIGA ALGO  */

        if (typeof listaError != "undefined") {

          this.detalleRegistroTGRegistroDTO = new DetalleConsultaTipoRiesgoDTO();
          this.detalleRegistroTGDiasDTO = new DetalleConsultaTipoRiesgoDTO();
          this.detalleRegistroTGPorcentajeDTO = new DetalleConsultaTipoRiesgoDTO();
          this.detalleRegistroTGDefuncionesDTO = new DetalleConsultaTipoRiesgoDTO();

          this.detalleRegistroTGRegistro2DTO = new DetalleConsultaTipoRiesgoDTO();
          this.detalleRegistroTGDias2DTO = new DetalleConsultaTipoRiesgoDTO();
          this.detalleRegistroTGPorcentaje2DTO = new DetalleConsultaTipoRiesgoDTO();
          this.detalleRegistroTGDefunciones2DTO = new DetalleConsultaTipoRiesgoDTO();

          this.detalleRegistroTGRegistroDTO = this.cifrasTipoRiesgo(listaError, 1);
          this.detalleRegistroTGDiasDTO = this.cifrasTipoRiesgo(listaError, 2);
          this.detalleRegistroTGPorcentajeDTO = this.cifrasTipoRiesgo(listaError, 3);
          this.detalleRegistroTGDefuncionesDTO = this.cifrasTipoRiesgo(listaError, 4);



          this.detalleRegistroTGRegistro2DTO = this.cifrasTipoRiesgo2(listaError, 1);
          this.detalleRegistroTGDias2DTO = this.cifrasTipoRiesgo2(listaError, 2);
          this.detalleRegistroTGPorcentaje2DTO = this.cifrasTipoRiesgo2(listaError, 3);
          this.detalleRegistroTGDefunciones2DTO = this.cifrasTipoRiesgo2(listaError, 4);

          // this.detalleRegistroTGDiasDTO= this.cifrasTipoRiesgo(listaError,2);


          this.tipoReporte = "2";

        } else {
          this.tipoReporte = "0";
          this.showMessage('No se encontraron resultados con los criterios ingresados', 'Atención');


        }
      },
      (error) => {
        this.spinner.hide();
        this.tipoReporte = "0";
        console.error(error);
      }
    );

  }


  public cifrasTipoRiesgo(listaError: any, clave: number) {



    var detalle: DetalleConsultaTipoRiesgoDTO = new DetalleConsultaTipoRiesgoDTO();
    var desClave = "";
    if (clave == 1) {
      desClave = "Registros";
    }

    if (clave == 2) {
      desClave = "Dias subsidiados";
    }

    if (clave == 3) {
      desClave = "Porcentaje de incapacidad";
    }
    if (clave == 4) {
      desClave = "Defunciones";
    }

    var values = Object.keys(listaError).map(function (e) {
      return listaError[e];
    })
    //console.log("LAS VALORES A111 :::::: "+JSON.stringify(listaError['0'] ));
    //console.log("LAS VALORES A222 :::::: "+JSON.stringify(values['0'] ));




    if (typeof values['0'] != "undefined") {
      values['0'].forEach(value => {
        //  console.log("-------------------------------ENTRO AL IF CON 1------------------------- ");
        //  console.log(JSON.stringify(value));
        if (value['clave'] == clave) {
          //  console.log("LA DESCRIPCIONE ES ==" + value['descripcion']);
          detalle.descripcion = value['descripcion'];
          detalle.numAnteriores = value['numAnteriores'];
          detalle.numInmediato = value['numInmediato'];
          detalle.numActual = value['numActual'];
          detalle.numPosterior = value['numPosterior'];
          detalle.numTotal = value['numTotal'];

        }

      });
    } else {
      //  console.log("-------------------------------ENTRO AL ELSE ------------------------- ");
      detalle.descripcion = desClave;
      detalle.numAnteriores = 0;
      detalle.numInmediato = 0;
      detalle.numActual = 0;
      detalle.numPosterior = 0;
      detalle.numTotal = 0;

    }


    if (typeof values['1'] != "undefined") {
      values['1'].forEach(value => {
        // console.log("-------------------------------------------------------- ");
        // console.log(JSON.stringify(value));
        if (value['clave'] === clave) {
          detalle.descripcion = value['descripcion'];
          detalle.numAnterioresOtras = value['numAnteriores'];
          detalle.numInmediatoOtras = value['numInmediato'];
          detalle.numActualOtras = value['numActual'];
          detalle.numPosteriorOtras = value['numPosterior'];
          detalle.numTotalOtras = value['numTotal'];

        }

      })
    } else {
      detalle.descripcion = desClave;
      detalle.numAnterioresOtras = 0;
      detalle.numInmediatoOtras = 0;
      detalle.numActualOtras = 0;
      detalle.numPosteriorOtras = 0;
      detalle.numTotalOtras = 0;


    }


    return detalle;
  }


  //*************** PARA EL TIPO DE REPORTE 2  **********************/
  public cifrasTipoRiesgo2(listaError: any, clave: number) {
    var detalle: DetalleConsultaTipoRiesgoDTO = new DetalleConsultaTipoRiesgoDTO();
    var desClave = "";
    if (clave == 1) {
      desClave = "Registros";
    }

    if (clave == 2) {
      desClave = "Dias subsidiados";
    }

    if (clave == 3) {
      desClave = "Porcentaje de incapacidad";
    }

    if (clave == 4) {
      desClave = "Defunciones";
    }

    var values = Object.keys(listaError).map(function (e) {
      return listaError[e];
    })
    console.log("LAS VALORES A111  cifrasTipoRiesgo2:::::: " + JSON.stringify(listaError['3']));
    console.log("VALIUE 2 :::::: " + JSON.stringify(values['2']));
    console.log("VALIUE 3 :::::: " + JSON.stringify(values['3']));




    //  if (typeof values['1']  != "undefined") {
    if (typeof values['2'] != "undefined") {
      values['2'].forEach(value => {
        //console.log("-------------------------------ENTRO AL IF CON 1------------------------- ");
        //  console.log(JSON.stringify(value));
        if (value['clave'] == clave) {
          console.log("LA DESCRIPCIONE ES ==" + value['descripcion']);
          detalle.descripcion = value['descripcion'];
          detalle.numAnteriores = value['numAnteriores'];
          detalle.numInmediato = value['numInmediato'];
          detalle.numActual = value['numActual'];
          detalle.numPosterior = value['numPosterior'];
          detalle.numTotal = value['numTotal'];

        }


      });
    } else {
      console.log("-------------------------------ENTRO AL ELSE ------------------------- ");

      detalle.descripcion = desClave;
      detalle.numAnteriores = 0;
      detalle.numInmediato = 0;
      detalle.numActual = 0;
      detalle.numPosterior = 0;
      detalle.numTotal = 0;

    }


    if (typeof values['3'] != "undefined") {
      values['3'].forEach(value => {
        // console.log("-------------------------------------------------------- ");
        // console.log(JSON.stringify(value));
        if (value['clave'] === clave) {
          detalle.descripcion = value['descripcion'];
          detalle.numAnterioresOtras = value['numAnteriores'];
          detalle.numInmediatoOtras = value['numInmediato'];
          detalle.numActualOtras = value['numActual'];
          detalle.numPosteriorOtras = value['numPosterior'];
          detalle.numTotalOtras = value['numTotal'];

        }

      })
    } else {
      detalle.descripcion = desClave;
      detalle.numAnterioresOtras = 0;
      detalle.numInmediatoOtras = 0;
      detalle.numActualOtras = 0;
      detalle.numPosteriorOtras = 0;
      detalle.numTotalOtras = 0;


    }


    return detalle;
  }

  public findReporteConsecuenciaPDF() {
    const formData = this.obtenerForm();
    console.log(formData);
    this.spinner.show();
    this.findTypeReportService.findConcecuenciaPDF(formData).subscribe(
      (data) => { // Success
        this.spinner.hide();
        const contentType = 'application/pdf';
        this.b64toBlob(data, contentType);
      },
      (error) => {
        const contentType = 'application/pdf';
        this.b64toBlob(error.error.text, contentType);
        this.spinner.hide();
      }
    );
  }


  public findReporteConsecuencia(formData: FormControlFigure) {
    this.tipoReporte = "0";
    this.findTypeReportService.findConcecuencia(formData).subscribe(
      (data) => { // Success
        this.spinner.hide();
        //this.resultControlFigure = data.body;
        console.log("---------- VEMOS EL OBJETO DE CONCECUECUENCIA ------ ");
        console.log(JSON.stringify(data.body));
        var listaConce = data.body;
        console.log("---------- OBJETO 1 DE CONCECUECIA ------ ");
        console.log(JSON.stringify(listaConce['1']));
        //*************  VALIDAMOS QUE EL OBJETO QUE TRAEMOS TRAIGA ALGO  */

        if (typeof listaConce != "undefined") {

          this.detalleConsultaConsecuencia1DTO = this.consultaConcecuenciasRiesgo(listaConce, "0");
          this.detalleConsultaConsecuencia2DTO = this.consultaConcecuenciasRiesgo(listaConce, "1");
          this.detalleConsultaConsecuencia3DTO = this.consultaConcecuenciasRiesgo(listaConce, "2");
          this.detalleConsultaConsecuencia4DTO = this.consultaConcecuenciasRiesgo(listaConce, "3");


          this.tipoReporte = "3";

        } else {
          this.tipoReporte = "0";
          this.showMessage('No se encontraron resultados con los criterios ingresados', 'Atención');


        }

      },
      (error) => {
        this.spinner.hide();
        this.tipoReporte = "0";
        console.error(error);
      }
    );
  }

  public consultaConcecuenciasRiesgo(listaConcecuenias: any, riesgo: string) {
    var detalleRetorno: DetalleConsultaConsecuenciaDTO[] = [];
    //console.log("-------------------------------------------------------- ");
    //console.log("---PARA RIESGO "+riesgo);


    var values = Object.keys(listaConcecuenias).map(function (e) {
      return listaConcecuenias[e];
    })
    // console.log("LAS VALORES CONCECUECNIA 1 :::::: "+JSON.stringify(listaConcecuenias[riesgo] ));
    //console.log("LAS VALORES CONCECUECNIA 2 :::::: "+JSON.stringify(values[riesgo] ));



    if (typeof values[riesgo] != "undefined") {
      values[riesgo].forEach(value => {
        //  console.log("-------------------------------------------------------- ");
        // console.log(JSON.stringify(value));
        var detalle: DetalleConsultaConsecuenciaDTO = new DetalleConsultaConsecuenciaDTO();
        detalle.clave = value['clave'];
        detalle.descripcion = value['descripcion'];
        detalle.numRegistro = value['numRegistro'];
        detalle.numDias = value['numDias'];
        detalle.porcentaje = value['porcentaje'];
        detalleRetorno.push(detalle);
      })

    }
    return detalleRetorno;

  }

  public showMessage(message: string, title: string) {
    console.log('showmessa');
    this.titDialogo = title;
    this.messDialogo = message;
    $('#dialogMessage').modal('show');
  }

  public hideMessage() {
    $('#dialogMessage').modal('hide');
  }

  public fechaDentroPeriodoValido(fecha: any) {
    const meses = new Array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
      'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');

    const arrayDateAc: string[] = fecha.split(' ');
    const fDateInput: Date = new Date(Date.parse(DateUtils.monthToEnglish(arrayDateAc[0].toString()) + ',' + arrayDateAc[1]));

    const spplitedFromDate: string[] = (this.fromDateForm.value as string).split(' ');
    const fDateFrom = new Date(Date.parse(`${DateUtils.monthToEnglish(spplitedFromDate[0].toString())},${spplitedFromDate[1]}`));

    if (fDateInput < fDateFrom) {
      this.showMessage('La fecha fin no puede ser menor a la fecha de inicio', 'Atención');
      this.toDateForm.setValue(`${meses[fDateFrom.getMonth()]} ${fDateFrom.getFullYear()}`);
    }

  }

  public diasEnUnMes(año, mes, tipoAnio: number) {
    let retornoAnio = new Date;
    if (tipoAnio === 1) {
      let dia: number = 15;
      retornoAnio = new Date(año, mes, 1);
    }
    if (tipoAnio === 2) {
      let dia: number = 15;
      //alert("ANTRA A MAYOR ");
      retornoAnio = new Date(año, mes, 31);
    }

    return new Date(año, mes, 1);
  }

  public downloadPDFReport() {


  }

  b64toBlob = (data, contentType, sliceSize = 512) => {
    const byteCharacters = atob(data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    const fileName = 'ConsultaGeneralCasuistica.pdf';
    FileSaver.saveAs(blob, fileName);
  }





}
