import { Component, OnInit, AfterViewInit } from '@angular/core';
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
import { FindStatusFileService } from 'src/app/casuistica/services/status-file/find-status-file.service';

import { FindControlFiguresCausiticaService } from 'src/app/casuistica/services/get-control-figures-causitica/find-control-figures-causitica.service';


import { ValidateSelect } from 'src/app/common/validators/common.validator';
import { CifrasControlMovimientosResponseDTO, DetalleConsultaDTO } from 'src/app/casuistica/models/control-figures/detalleConsultaDTO';
import { FormControlFigure } from 'src/app/casuistica/models/control-figures/form-control-figure';
import { Login } from 'src/app/common/models/security/login';
import { SecurityService } from 'src/app/common/services/security/security.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateUtils } from 'src/app/common/functions/DateUtils';
import * as FileSaver from 'file-saver';
import { timer } from 'rxjs';
import { chargeBeginCalendar, chargeEndCalendar, months } from 'src/app/common/utils/date-picker.util';
declare var $: any;
@Component({
  selector: 'app-search-records-causitica-ui',
  templateUrl: './search-records-causitica-ui.component.html',
  styleUrls: ['./search-records-causitica-ui.component.scss']
})
export class SearchRecordsCausiticaUiComponent implements OnInit, AfterViewInit {
  config: any;
  public maxSize: number = 7;
  public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public responsive: boolean = true;
  public formToMemory: any;
  public labels: any = {
    previousLabel: '<-- Atras ',
    nextLabel: ' Sig -->',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'page',
    screenReaderCurrentLabel: `You're on page`
  };




  constructor(private formBuilder: FormBuilder,
    private findDelegation: DelegationService, private findSubDelegation: SubDelegationService,
    private findCatalogo: CatalogsService, private findControlFiguresCausiticaService: FindControlFiguresCausiticaService,
    private modalService: NgbModal, private securityService: SecurityService, private spinner: NgxSpinnerService) {
  }
  public titulo: string = "Reportes / Distribución de la casuística por OOAD";
  public visualizaPerfil2;
  public formGroup: FormGroup;
  public from: FormControl;
  public to: FormControl;
  public registrationCase: FormControl;
  public fileType: FormControl;
  public delegation: FormControl;
  public subDelegation: FormControl;

  public resultControlFigure: ResultControlFigure;
  public detalleConsultaDTO: CifrasControlMovimientosResponseDTO[] = [];
  public cifrasControlTotales: CifrasControlTotales = new CifrasControlTotales();

  public selectDelegacion: Delegacion[] = [];
  public selectSubDelegacion: SubDelegacion[] = [];

  //****************  EJEMPLO  DE PAGINADOR BORRAR  ************/
  public listaDelegacion: Delegacion[] = [];
  public delegacionTest: Delegacion;


  //****************  BORRAR  ************/
  public titDialogo: string;
  public messDialogo: string;

  //**************  VARIBALE PARA VER SI MOSTRAMOS EL BOTON DE PDF  */
  public verPdf: boolean = false;

  public registrationCaseSelect: Catalogs[] = [];
  public fileTypeSelect: Catalogs[] = [];
  public user: Login = new Login();

  //page: number;
  previousPage: number;
  showPagination: boolean;
  page = 1;
  pageSize = 7;

  private areCatalogsLoaded = [false, false];

  ngOnInit(): void {
    setTimeout(() => {
      this.spinner.show();
    }, 0);
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log(" ----- EL JSON DEL LOGIN ES " + JSON.stringify(this.user));
    this.formToMemory = JSON.parse(localStorage.getItem('form'));
    this.buildForm();


    this.chargeDelegation();
    if (this.user.userInfo.businessCategory !== null) {
      this.chargeSubDelegation(this.user.userInfo.businessCategory.toString());
    } else {
      this.areCatalogsLoaded[1] = true;
      this.validateIfCatalogsAreLoaded();
    }
    this.visualizaPerfil2 = this.securityService.visualizaPerfil2(this.user);

    this.config = {
      itemsPerPage: 20,
      currentPage: 1,
      totalItems: this.detalleConsultaDTO.length
    };
    //*********************************************** */
    this.chargeCalendar();
  }

  private validateIfCatalogsAreLoaded() {
    if (this.areCatalogsLoaded.reduce((prev, current) => prev && current)) {
      this.spinner.hide();
    }
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


  pageChanged(event) {
    this.config.currentPage = event;
  }

  // chargeDelegation(){

  //   if (this.user.userInfo.businessCategory !== null) {
  //     console.log("EL CATEGORY ES BUSSINES ==0 "+this.user.userInfo.businessCategory);
  //     this.chargeSubDelegation(this.user.userInfo.businessCategory.toString());
  //     this.selectDelegacion.forEach(value => {

  //    // console.log("EL ITEM DE LA DELEGACION "+value['clave']);
  //     if(value['clave'] == this.user.userInfo.businessCategory){
  //       this.selectDelegacion = [];
  //       this.selectDelegacion.push(value);
  //     }



  //  });


  // }

  // }


  public chargeSubDelegation(clave: string) {
    if(clave !== '-1'){
      this.findSubDelegation.find(clave).subscribe(
        (data) => { // Success
          this.areCatalogsLoaded[1] = true;
          this.validateIfCatalogsAreLoaded();
          this.selectSubDelegacion = data;
          this.filterDelegation(this.user);
          console.log("CAMBIO DE LA SUBDELEGATION :::" + this.selectSubDelegacion);
        },
        (error) => {
          this.areCatalogsLoaded[1] = true;
          this.validateIfCatalogsAreLoaded();
          console.error(error);
        }
      );
    }
  }

  get fromDateForm() { return this.formGroup.get('date') as FormControl; }
  get toDateForm() { return this.formGroup.get('date2') as FormControl; }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      date: [],
      date2: [],
      registrationCase: [-1],
      fileType: [-1],
      delegation: ['-1', this.user.userInfo.businessCategory !== null ? Validators.compose([
        Validators.required, ValidateSelect]) : ''],
      subDelegation: ['-1', this.user.userInfo.departmentNumber !== null ? Validators.compose([
        Validators.required, ValidateSelect]) : '']
    });
  }

  openDialog(message: string) {
    const modalRef = this.modalService.open(DialogUiComponent);
    modalRef.componentInstance.name = message;
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
    }

    return result;
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

  public search() {


    const valid = this.validateFormSearch();
    const formData = new FormControlFigure();

    console.log('is valid: ' + valid);
    if (valid === 1) {
      const result = this.formGroup.value;
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
      formData.page = null;
      console.log(formData);
      this.spinner.show();
      console.log("LA SUBDELEGACION QUE MANDO ES " + formData.cveSubdelegation);
      this.findControlFiguresCausiticaService.find(formData).subscribe(
        (data) => { // Success
          this.spinner.hide();
          this.resultControlFigure = data.body;
          console.log(this.resultControlFigure);
          if (data.body.length <= 0) {
            this.resultControlFigure = new ResultControlFigure();
            this.detalleConsultaDTO = [];
            this.cifrasControlTotales = new CifrasControlTotales();
            this.showMessage('No se encontraron resultados con los criterios ingresados', 'Atención');
            this.verPdf = false;
          } else {
            this.detalleConsultaDTO = data.body;
            this.cifrasControlTotales.numTotalRegistros = 0;
            this.cifrasControlTotales.numRegistrosCorrectos = 0;
            this.cifrasControlTotales.numRegistrosError = 0;
            this.cifrasControlTotales.numRegistrosDup = 0;
            this.cifrasControlTotales.numRegistrosSus = 0;
            this.cifrasControlTotales.numRegistrosBaja = 0;
            this.cifrasControlTotales.numRegistrosCorrectosOtras = 0;
            this.cifrasControlTotales.numRegistrosErrorOtras = 0;
            this.cifrasControlTotales.numRegistrosDupOtras = 0;
            this.cifrasControlTotales.numRegistrosSusOtras = 0;
            this.cifrasControlTotales.numRegistrosBajaOtras = 0;
            this.detalleConsultaDTO.forEach(detalle => {
              this.cifrasControlTotales.numTotalRegistros = this.cifrasControlTotales.numTotalRegistros + detalle.total;
              this.cifrasControlTotales.numRegistrosCorrectos = this.cifrasControlTotales.numRegistrosCorrectos + detalle.correcto;
              this.cifrasControlTotales.numRegistrosError = this.cifrasControlTotales.numRegistrosError + detalle.erroneo;
              this.cifrasControlTotales.numRegistrosDup = this.cifrasControlTotales.numRegistrosDup + detalle.duplicado;
              this.cifrasControlTotales.numRegistrosSus = this.cifrasControlTotales.numRegistrosSus + detalle.susceptible;
              this.cifrasControlTotales.numRegistrosBaja = this.cifrasControlTotales.numRegistrosBaja + detalle.baja;
              this.cifrasControlTotales.numRegistrosCorrectosOtras =
                this.cifrasControlTotales.numRegistrosCorrectosOtras + detalle.correctoOtras;
              this.cifrasControlTotales.numRegistrosErrorOtras = this.cifrasControlTotales.numRegistrosErrorOtras + detalle.erroneoOtras;
              this.cifrasControlTotales.numRegistrosDupOtras = this.cifrasControlTotales.numRegistrosDupOtras + detalle.duplicadoOtras;
              this.cifrasControlTotales.numRegistrosSusOtras = this.cifrasControlTotales.numRegistrosSusOtras + detalle.susceptibleOtras;
              this.cifrasControlTotales.numRegistrosBajaOtras =
                this.cifrasControlTotales.numRegistrosBajaOtras + detalle.bajaOtrasDelegaciones;
            });
            this.verPdf = true;
          }
        },
        (error) => {
          this.spinner.hide();
          console.error(error);
        }
      );

    } else {
      this.showMessage('Ingresar datos requeridos.', 'Atención');
      // tslint:disable-next-line: max-line-length
      const meses = new Array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
      const f = new Date();
      this.formGroup.get('date2').setValue(meses[f.getMonth()] + ' ' + f.getFullYear());
      this.formGroup.get('date').setValue(meses[f.getMonth()] + ' ' + f.getFullYear());
    }
  }



  public downloadPDFReport() {
    const formData = new FormControlFigure();
    const result = this.formGroup.value;
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
    const result3 = this.selectDelegacion.filter(Delegacion => String(Delegacion.clave) === formData.cveDelegation);
    if (result3.length > 0) {
      formData.desDelegation = result3[0].descripcion;
    }
    formData.delRegPat = result.delegation <= 0 ? false : true;
    formData.cveSubdelegation = result.subDelegation <= 0 ? '' : result.subDelegation;
    const result1 = this.selectSubDelegacion.filter(subDelegacion => String(subDelegacion.clave) === formData.cveSubdelegation);
    if (result1.length > 0) {
      formData.desSubdelegation = result1[0].descripcion;
    }

    formData.isPdfReport = true;

    formData.page = null;
    console.log(formData);
    this.spinner.show();
    this.findControlFiguresCausiticaService.getExportPDF(formData).subscribe(
      (data) => { // Success

        this.spinner.hide();
        const contentType = 'application/pdf';
        this.b64toBlob(data, contentType);
      },
      (error) => {

        const contentType = 'application/pdf';
        this.b64toBlob(error.error.text, contentType);
        // console.log(error.error.text);
        this.spinner.hide();
        console.error(error);
      }
    );

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
    const fileName = 'CifrasControl.pdf';
    FileSaver.saveAs(blob, fileName);
  }

  public clear() {
    // tslint:disable-next-line: max-line-length
    const meses = new Array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
    const f = new Date();
    this.formGroup.get('date2').setValue(meses[f.getMonth()] + ' ' + f.getFullYear());
    this.formGroup.get('date').setValue(meses[f.getMonth()] + ' ' + f.getFullYear());
    this.formGroup.get('registrationCase').setValue(-1);
    this.formGroup.get('fileType').setValue(-1);
    this.formGroup.get('delegation').setValue(-1);
    this.formGroup.get('subDelegation').setValue(-1);
    this.resultControlFigure = new ResultControlFigure();
    this.detalleConsultaDTO = [];
    this.cifrasControlTotales = new CifrasControlTotales();
  }

  ngAfterViewInit() {
    this.chargeCalendar();
  }

  public chargeCalendar() {
    chargeBeginCalendar('#fechaInicio1causitica', this.toDateForm, this.fromDateForm, this.showMessage.bind(this));
    chargeEndCalendar('#fechaFin1causitica', this.toDateForm, this.fromDateForm, this.showMessage.bind(this));
    const f = new Date();
    this.formGroup.get('date2').setValue(months[f.getMonth()] + ' ' + f.getFullYear());
    this.formGroup.get('date').setValue(months[f.getMonth()] + ' ' + f.getFullYear());
  }

  public clearLocalStorage() {
    localStorage.removeItem('detail');
    localStorage.removeItem('selected');
    localStorage.removeItem('form');
    localStorage.removeItem('info');

  }

  public reporte() {
    this.showMessageReporte('Elija el formato en que desea descargar el reporte actual', 'Atención');
  }

  public showMessageReporte(message: string, title: string) {
    console.log('showmessa');
    this.titDialogo = title;
    this.messDialogo = message;
    $('#dialogMessageReporte').modal('show');
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
  public convertDate(inputFormat: Date) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    // alert("FECHA FORMATEADA "+[pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/'));
    return [pad(d.getDay() + 1), pad(d.getMonth() + 1), d.getFullYear()].join('/')
  }

  public hideMessageReporte() {
    $('#dialogMessageReporte').modal('hide');
  }
}




