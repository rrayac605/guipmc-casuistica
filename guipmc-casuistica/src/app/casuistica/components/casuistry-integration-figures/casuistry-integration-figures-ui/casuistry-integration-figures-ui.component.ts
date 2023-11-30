import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetalleConsultaSRecordsDTO } from 'src/app/casuistica/models/control-figures/detalleConsultaSRecordsDTO';
import { DetalleConsultaDTO } from 'src/app/casuistica/models/control-figures/detalleConsultaDTO';

import { Router } from '@angular/router';
import { Login } from 'src/app/common/models/security/login';
import { NgxSpinnerService } from 'ngx-spinner';
// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-casuistry-integration-figures-ui',
  templateUrl: './casuistry-integration-figures-ui.component.html',
  styleUrls: ['./casuistry-integration-figures-ui.component.scss'],

})
export class CasuistryIntegrationFiguresUiComponent implements OnInit, AfterViewInit {

  // public formGroup: FormGroup;
  public formGroup: FormGroup;
  public from: FormControl;
  public to: FormControl;
  public registrationCase: FormControl;

  public delegacion: FormControl;
  public subdelagacion: FormControl;
  public tipoRiesgo: FormControl;

  public titDialogo: string;
  public messDialogo: string;
  public detalleConsultaSRecordsDTO: DetalleConsultaSRecordsDTO[] = [];
  detalleConsultaArrayDTO: DetalleConsultaDTO[] = [];
  public fechaMostrar: string;
  public periodoMostrar: string;
  public fechaInicioEjemplo: Date;
  public fechaInicioEjeplo2: string;
  public user: Login = new Login();
  public titulo = " / Consulta CICs";

  // ******************    BORRAR   ***************************/
  public mostrar = false;
  constructor(private formBuilder: FormBuilder,
    private modalService: NgbModal, private router: Router, private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.buildForm();
    this.generarMock();
    this.fechaMostrar = '03/02/2019';
    this.periodoMostrar = '01/2019 al 02/2019';
  }

  // ****************   SACAMOS EL NUMERO DE DIAS DEL MES     ********************
  ngAfterViewInit() {
    this.chargeCalendar();
  }

  public chargeCalendar() {
    const self = this;

    let yMause = 0;

    $('#dateCasInte').mousemove(function (event) {
      yMause = 0;
      yMause = event.pageY - this.offsetTop;
    });
    $('#dateCasInt2').mousemove(function (event) {
      yMause = 0;
      yMause = event.pageY - this.offsetTop;
    });
    $('#dateCasInte').datepicker({

      closeText: 'Cerrar',
      prevText: '<Ant',
      nextText: 'Sig>',
      currentText: 'Hoy',
      // tslint:disable-next-line: max-line-length
      monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      changeMonth: true,
      changeYear: true,
      showButtonPanel: true,
      dateFormat: 'MM yy',

      onClose(dateText, inst) {
        $(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));

        self.formGroup.get('date').setValue($(this).val());

        self.fechaInicioEjemplo = new Date(inst.selectedYear, inst.selectedMonth, 1);
        self.fechaInicioEjeplo2 = inst.selectedMonth;
      },

      onChangeMonthYear(input, inst) {
        $('#dateCasInte .ui-datepicker-calendar').css('display', 'none');
        // tslint:disable-next-line: only-arrow-functions
        setTimeout(function () {
          $('.ui-datepicker-calendar').hide();
          $('.ui-datepicker-header').css('width', '300px');
          $('.ui-datepicker-month').css('color', '#333');
        }, 0);

      },

      beforeShow(input, inst) {

        // tslint:disable-next-line: only-arrow-functions
        setTimeout(function () {
          inst.dpDiv.css({ top: yMause + 25 });
          $('.ui-datepicker-calendar').hide();
          $('.ui-datepicker-header').css('width', '300px');
          $('.ui-datepicker-month').css('color', '#333');

        }, 0);
      },
    });


    $('#dateCasInt2').datepicker({

      closeText: 'Cerrar',
      prevText: '<Ant',
      nextText: 'Sig>',
      currentText: 'Hoy',
      // tslint:disable-next-line: max-line-length
      monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      changeMonth: true,
      changeYear: true,
      showButtonPanel: true,
      dateFormat: 'MM yy',

      onClose(dateText, inst) {
        $(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));
        self.formGroup.get('date2').setValue($(this).val());
      },

      onChangeMonthYear(input, inst) {

        $('#dateCasInt2 .ui-datepicker-calendar').css('display', 'none');
        // tslint:disable-next-line: only-arrow-functions
        setTimeout(function () {

          $('.ui-datepicker-calendar').hide();

          $('.ui-datepicker-header').css('width', '300px');
          $('.ui-datepicker-month').css('color', '#333');
        }, 0);
      },

      beforeShow(input, inst) {
        // tslint:disable-next-line: only-arrow-functions
        setTimeout(function () {
          inst.dpDiv.css({ top: yMause + 25 });
          $('.ui-datepicker-calendar').hide();
          $('.ui-datepicker-header').css('width', '300px');
          $('.ui-datepicker-month').css('color', '#333');

        }, 0);
      },

    });

  }

  private buildForm() {
    const dateLength = 10;
    const today = new Date().toISOString().substring(0, dateLength);
    this.formGroup = this.formBuilder.group({
      date: [],
      date2: [],
      delegacion: [-1],
      subdelagacion: [-1],

    });
    this.formGroup.get('date')
      .valueChanges
      .subscribe(value => {
        //  alert("EN EL FORMULACIO REACTIVO date: "+value);
      });

    this.formGroup.get('date2')
      .valueChanges
      .subscribe(value => {
        //  alert("EN EL FORMULACIO REACTIVO date2: "+value);
      });
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

  public validateFormSearch() {
    let result = 1;
    console.log(this.formGroup.get('date').value);
    console.log(this.formGroup.get('date2').value);

    if (this.formGroup.get('date').value === null && this.formGroup.get('date2').value === null
      || this.formGroup.get('date').value === null || this.formGroup.get('date2').value === null) {
      result = 0;
    }

    return result;
  }

  guardarCambios() {

    this.mostrar = true;
    console.log(this.formGroup.value);
    if (this.formGroup.valid) {
      console.log('VALIDACION CON EXITO ');
      this.formGroup.reset;
    } else {
      console.log('VALIDACION CON FALLO');
    }
  }

  clean() {
    this.mostrar = false;
  }

  flujoAlterno() {
    this.showMessage('No se encontraron resultados con los criterios ingresados.', 'Atención');
  }

  generarMock() {
    const detalleConsultaDTO = new DetalleConsultaDTO();
    detalleConsultaDTO.tipoArchivo = 'RIT';
    detalleConsultaDTO.numTotalRegistros = 350;
    detalleConsultaDTO.numRegistrosCorrectos = 20;
    detalleConsultaDTO.numRegistrosError = 10;
    detalleConsultaDTO.numRegistrosDup = 10;
    detalleConsultaDTO.numRegistrosBaja = 10;
    detalleConsultaDTO.numRegistrosSus = 10;
    detalleConsultaDTO.numRegistrosCorrectos = 15;
    detalleConsultaDTO.numRegistrosCorrectosOtras = 20;
    detalleConsultaDTO.numRegistrosDupOtras = 20;
    detalleConsultaDTO.numRegistrosSusOtras = 20;
    detalleConsultaDTO.numRegistrosBajaOtras = 20;

    this.detalleConsultaArrayDTO.push(detalleConsultaDTO);
    const detalleConsultaDTO2 = new DetalleConsultaDTO();
    detalleConsultaDTO2.tipoArchivo = 'ST3';
    detalleConsultaDTO2.numTotalRegistros = 350;
    detalleConsultaDTO2.numRegistrosCorrectos = 20;
    detalleConsultaDTO2.numRegistrosError = 10;
    detalleConsultaDTO2.numRegistrosDup = 10;
    detalleConsultaDTO2.numRegistrosBaja = 10;
    detalleConsultaDTO2.numRegistrosSus = 10;
    detalleConsultaDTO2.numRegistrosCorrectos = 15;
    detalleConsultaDTO2.numRegistrosCorrectosOtras = 20;
    detalleConsultaDTO2.numRegistrosDupOtras = 20;
    detalleConsultaDTO2.numRegistrosSusOtras = 20;
    detalleConsultaDTO2.numRegistrosBajaOtras = 20;

    this.detalleConsultaArrayDTO.push(detalleConsultaDTO2);

  }

  public clearLocalStorage() {
    localStorage.removeItem('detail');
    localStorage.removeItem('selected');
    localStorage.removeItem('form');
    localStorage.removeItem('info');

  }

}