import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogUiComponent } from 'src/app/common/components/dialog/dialog-ui/dialog-ui.component';
import { Delegacion } from 'src/app/common/models/delegation.model';
import { SubDelegacion } from 'src/app/common/models/subdelegation.model';
import { GetCatalogs } from 'src/app/common/models/getcatalogs.model';
import { Catalogs } from 'src/app/common/models/catalogs.model';
import { CatalogsService } from 'src/app/common/services/catalogs/catalogs.service';
import { CifrasControlTotales } from 'src/app/casuistica/models/control-figures/cifrasControlTotales';
import { FindControlFiguresService } from 'src/app/casuistica/services/get-control-figures/find-control-figures.service';
import { CifrasControlMovimientosResponseDTO } from 'src/app/casuistica/models/control-figures/detalleConsultaDTO';
import { FormControlFigure } from 'src/app/casuistica/models/control-figures/form-control-figure';
import { Login } from 'src/app/common/models/security/login';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateUtils } from 'src/app/common/functions/DateUtils';
import * as FileSaver from 'file-saver';
import { chargeBeginCalendar, chargeEndCalendar, months } from 'src/app/common/utils/date-picker.util';


declare var $: any;
@Component({
  selector: 'app-get-control-figures-ui',
  templateUrl: './get-control-figures-ui.component.html',
  styleUrls: ['./get-control-figures-ui.component.scss']
})

export class GetControlFiguresUiComponent implements OnInit, AfterViewInit {

  constructor(private formBuilder: FormBuilder,
    private findCatalogo: CatalogsService, private findControlFiguresService: FindControlFiguresService,
    private modalService: NgbModal, private spinner: NgxSpinnerService) { }
  public titulo = 'Reportes / Distribución de la casuística por tipo de archivo';
  public formGroup: FormGroup;
  public from: FormControl;
  public to: FormControl;
  public registrationCase: FormControl;
  public fileType: FormControl;
  public delegation: FormControl;
  public subDelegation: FormControl;

  public detalleConsultaDTO: CifrasControlMovimientosResponseDTO[] = [];
  public cifrasControlTotales: CifrasControlTotales = new CifrasControlTotales();

  public selectDelegacion: Delegacion[] = [];
  public selectSubDelegacion: SubDelegacion[] = [];

  public titDialogo: string;
  public messDialogo: string;

  public catalogoInput: GetCatalogs = new GetCatalogs();


  public registrationCaseSelect: Catalogs[] = [];
  public fileTypeSelect: Catalogs[] = [];
  public user: Login = new Login();

  page: number;
  previousPage: number;
  showPagination: boolean;

  ngOnInit(): void {

    setTimeout(() => {
      this.spinner.show();
    }, 0);

    this.user = JSON.parse(localStorage.getItem('user'));
    this.buildForm();

    this.catalogoInput.nameCatalog = 'MccTipoArchivo';
    console.log(this.catalogoInput);
    this.findCatalogo.find(this.catalogoInput).subscribe(
      (data) => { // Success
        this.spinner.hide();
        this.fileTypeSelect = data.body;
        console.log(this.fileTypeSelect);
      },
      (error) => {
        this.spinner.hide();
        console.error(error);
      }
    );

    this.chargeCalendar();
    //console.log('estas en el componente controlFigures');

  }

  get fromDateForm() { return this.formGroup.get('date') as FormControl; }
  get toDateForm() { return this.formGroup.get('date2') as FormControl; }
  get delRegPatForm() { return this.formGroup.get('delRegPat') as FormControl; }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      date: [],
      date2: [],
      registrationCase: [-1],
      fileType: ['-1'],
      delRegPat: [false]

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
      || fDate === null || toDate === null || ($('#fechaInicio1').val() === '' || $('#fechaFin1').val() === '')) {
      result = 0;
    }
    if (fDate > toDate) {
      this.showMessage('Validar fechas ingresadas', 'Atención');
    }
    if ((this.formGroup.get('delRegPat').value === true || this.formGroup.get('delRegPat').value === "true") && this.formGroup.get('fileType').value === '-1') {
      this.showMessage('Seleccione un valor para Tipo de archivo', 'Atención');
      result = 0;
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
      formData.delRegPat = result.delRegPat === '-1' ? false :
        (!result.delRegPat || result.delRegPat === 'false') ? false : true;
      this.formGroup.get('delRegPat').setValue(result.delRegPat === '-1' ? false :
        (!result.delRegPat || result.delRegPat === 'false') ? false : true);
      this.formGroup.get('delRegPat').updateValueAndValidity();
      formData.cveTipoArchivo = result.fileType === '-1' ? null : result.fileType;
      formData.page = null;
      console.log(formData);
      this.spinner.show();
      this.findControlFiguresService.find(formData).subscribe(
        (data) => { // Success
          this.detalleConsultaDTO = data.body;
          this.spinner.hide();
          if (this.detalleConsultaDTO.length <= 0) {
            this.detalleConsultaDTO = [];
            this.cifrasControlTotales = new CifrasControlTotales();
            this.showMessage('No se encontraron resultados con los criterios ingresados', 'Atención');
          } else {
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

  public clear() {
    // tslint:disable-next-line: max-line-length
    const meses = new Array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
    const f = new Date();
    this.formGroup.get('date2').setValue(meses[f.getMonth()] + ' ' + f.getFullYear());
    this.formGroup.get('date').setValue(meses[f.getMonth()] + ' ' + f.getFullYear());
    this.formGroup.get('delRegPat').setValue(-1);
    this.formGroup.get('fileType').setValue('-1');
    this.detalleConsultaDTO = [];
    this.cifrasControlTotales = new CifrasControlTotales();
  }

  ngAfterViewInit() {
    this.chargeCalendar();
  }

  public chargeCalendar() {
    chargeBeginCalendar('#fechaInicio1', this.toDateForm, this.fromDateForm, this.showMessage.bind(this));
    chargeEndCalendar('#fechaFin1', this.toDateForm, this.fromDateForm, this.showMessage.bind(this));
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

  public hideMessageReporte() {
    $('#dialogMessageReporte').modal('hide');
  }

  public checkTipoArchivo(delRegPat: string) {
    this.detalleConsultaDTO = [];
    this.cifrasControlTotales = new CifrasControlTotales();
    if (delRegPat === 'true' && this.formGroup.get('fileType').value === '-1') {
      this.showMessage('Seleccione un valor para Tipo de archivo', 'Atención');
    }
    if (delRegPat === 'false') {
      this.formGroup.get('fileType').setValue('-1');
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
    formData.delRegPat = result.delRegPat === '-1' ? false : result.delRegPat;
    formData.isPdfReport = true;
    formData.cveTipoArchivo = result.fileType === '-1' ? null : result.fileType;
    formData.page = null;
    console.log(formData);
    console.log('mandas a llamar a imprimir pdf ');
    this.spinner.show();
    this.findControlFiguresService.exportPDF(formData).subscribe(
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

  /*     b64toBlob = (data, contentType, sliceSize= 512) => {
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
        const blob = new Blob(byteArrays, {type: contentType});
        const downloadLink = document.createElement('a');
        const fileName = 'CifrasControl.pdf';
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = fileName;
        downloadLink.click();
        window.URL.revokeObjectURL(URL.createObjectURL(blob));
    } */

  public downloadXlsReport() {
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
    formData.delRegPat = result.delRegPat === '-1' ? false : result.delRegPat;
    formData.isPdfReport = true;
    formData.cveTipoArchivo = result.fileType === '-1' ? null : result.fileType;
    formData.page = null;
    console.log(formData);
    console.log('mandas a llamar al excel');
    this.spinner.show();
    this.findControlFiguresService.getExportar3(formData, this.spinner, 'CifrasControl.xlsx');
  }
  downloadFile = (data, contentType) => {
    const fileName = 'CifrasControl.xlsx';
    FileSaver.saveAs(data.body, fileName);


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

}
