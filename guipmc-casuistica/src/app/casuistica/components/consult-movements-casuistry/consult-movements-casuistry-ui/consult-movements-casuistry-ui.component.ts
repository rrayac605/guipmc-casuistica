import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CifrasControlTotales } from 'src/app/casuistica/models/control-figures/cifrasControlTotales';
import { DetalleConsultaDTO } from 'src/app/casuistica/models/control-figures/detalleConsultaDTO';
import { FormControlFigure } from 'src/app/casuistica/models/control-figures/form-control-figure';
import { DialogUiComponent } from 'src/app/common/components/dialog/dialog-ui/dialog-ui.component';
import { DateUtils } from 'src/app/common/functions/DateUtils';
import { Catalogs } from 'src/app/common/models/catalogs.model';
import { Delegacion } from 'src/app/common/models/delegation.model';
import { Login } from 'src/app/common/models/security/login';
import { SubDelegacion } from 'src/app/common/models/subdelegation.model';
import { CatalogsService } from 'src/app/common/services/catalogs/catalogs.service';
import { DelegationService } from 'src/app/common/services/catalogs/delegation.service';
import { SubDelegationService } from 'src/app/common/services/catalogs/sub-delegation.service';
import { SecurityService } from 'src/app/common/services/security/security.service';

// tslint:disable-next-line: max-line-length
import { FindControlFiguresCausiticaService } from 'src/app/casuistica/services/get-control-figures-causitica/find-control-figures-causitica.service';
import { GetCatalogs } from 'src/app/common/models/getcatalogs.model';
import { MovimientoCasuisticaOutput } from '../../../models/consult-movements-casuistry/movimientoCasuisticaOutput';
import { timer } from 'rxjs';
import { Validators } from '@angular/forms';
import { ValidateSelect } from 'src/app/common/validators/common.validator';
import * as FileSaver from 'file-saver';
import { chargeBeginCalendar, chargeEndCalendar, months } from 'src/app/common/utils/date-picker.util';


declare var $: any;

@Component({
  selector: 'app-consult-movements-casuistry-ui',
  templateUrl: './consult-movements-casuistry-ui.component.html',
  styleUrls: ['./consult-movements-casuistry-ui.component.scss']
})
export class ConsultMovementsCasuistryUiComponent implements OnInit {
  config: any;
  public maxSize = 7;
  public directionLinks = true;
  public autoHide = false;
  public responsive = true;
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
  public titulo = 'Reportes / Indicador de movimientos realizados por el usuario';
  public formGroup: FormGroup;
  public from: FormControl;
  public to: FormControl;
  public registrationCase: FormControl;
  public fileType: FormControl;
  public delegation: FormControl;
  public subDelegation: FormControl;

  public movimientoCasuistica: MovimientoCasuisticaOutput = new MovimientoCasuisticaOutput();
  public detalleConsultaDTO: DetalleConsultaDTO[] = [];
  public cifrasControlTotales: CifrasControlTotales = new CifrasControlTotales();

  public selectDelegacion: Delegacion[] = [];
  public selectSubDelegacion: SubDelegacion[] = [];
  public catalogoInput: GetCatalogs = new GetCatalogs();

  public tipoEntradaStr;


  // ****************  EJEMPLO  DE PAGINADOR BORRAR  ************/
  public listaDelegacion: Delegacion[] = [];
  public delegacionTest: Delegacion;


  // ****************  BORRAR  ************/
  public titDialogo: string;
  public messDialogo: string;
  public tipoEntrada: string;


  public registrationCaseSelect: Catalogs[] = [];
  public fileTypeSelect: Catalogs[] = [];
  public user: Login = new Login();

  public desDelegation;
  public desSubDelegation;
  public alcance;

  // page: number;
  previousPage: number;
  showPagination: boolean;
  page = 1;
  pageSize = 7;

  private areCatalogsLoaded = [false, false, false];

  ngOnInit(): void {
    setTimeout(() => {
      this.spinner.show();
    }, 0);
    this.tipoEntradaStr = 'General';
    this.user = JSON.parse(localStorage.getItem('user'));

    this.buildForm();

    this.chargeDelegation();
    if (this.user.userInfo.businessCategory !== null) {
      this.chargeSubDelegation(this.user.userInfo.businessCategory.toString());
    } else {
      this.areCatalogsLoaded[1] = true;
      this.validateIfCatalogsAreLoaded();
    }

    this.config = {
      itemsPerPage: 20,
      currentPage: 1,
      totalItems: this.detalleConsultaDTO.length
    };


    this.catalogoInput.nameCatalog = 'MccTipoArchivo';
    console.log(this.catalogoInput);
    this.findCatalogo.find(this.catalogoInput).subscribe(
      (data) => { // Success
        this.areCatalogsLoaded[2] = true;
        this.validateIfCatalogsAreLoaded();
        const manual: Catalogs = new Catalogs();
        manual.cveCatalogo = '0';
        manual.descCatalogo = 'Alta manual';
        this.fileTypeSelect = data.body;
        this.fileTypeSelect.push(manual);
        console.log(this.fileTypeSelect);
      },
      (error) => {
        this.areCatalogsLoaded[2] = true;
        this.validateIfCatalogsAreLoaded();
        console.error(error);
      }
    );



    // *********************************************** */

    this.chargeCalendar();


  }

  private validateIfCatalogsAreLoaded() {
    if (this.areCatalogsLoaded.reduce((prev, current) => prev && current)) {
      this.spinner.hide();
    }
  }

  pageChanged(event) {
    this.config.currentPage = event;
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

  get fromDateForm() { return this.formGroup.get('date') as FormControl; }
  get toDateForm() { return this.formGroup.get('date2') as FormControl; }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      date: [],
      date2: [],
      tipoEntrada: [-1],
      delegation: ['-1'],
      subDelegation: ['-1']
    });
  }

  openDialog(message: string) {
    const modalRef = this.modalService.open(DialogUiComponent);
    modalRef.componentInstance.name = message;
  }

  public validateFormSearch() {
    let result = 1;
    const res = this.formGroup.value;
    const arrayDate: string[] = res.date.split(' ');
    const arrayDate2: string[] = res.date2.split(' ');
    const fDate: Date = new Date(Date.parse(DateUtils.monthToEnglish(arrayDate[0].toString()) + ',' + arrayDate[1]));
    const toDate: Date = new Date(Date.parse(DateUtils.monthToEnglish(arrayDate2[0].toString()) + ',' + arrayDate2[1]));
    console.log(fDate.getMonth() + 1 + '-' + fDate.getFullYear());
    console.log(toDate.getMonth() + 1 + '-' + toDate.getFullYear());

    if ((fDate === null && toDate === null) || fDate === null || toDate === null ||
      ($('#fechaInicio2causitica').val() === '' || $('#fechaFin2causitica').val() === '')) {
      result = 0;
    }
    if (fDate > toDate) {
      this.showMessage('Validar fechas ingresadas', 'Atención');
    }
    if (!this.formGroup.valid) {
      this.showMessage('Ingresa datos requeridos', 'Atención');
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

    this.validarAlcance();

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

      formData.cveDelegation = this.formGroup.get('delegation').value !== '-1' ? this.formGroup.get('delegation').value : '';
      formData.cveSubdelegation = this.formGroup.get('subDelegation').value !== '-1' ? this.formGroup.get('subDelegation').value : '';
      formData.page = null;
      formData.cveTipoArchivo = result.tipoEntrada !== '-1' ? result.tipoEntrada : '';

      console.log(formData);
      this.spinner.show();
      this.findControlFiguresCausiticaService.findMovimientos(formData).subscribe(
        (data) => { // Success
          this.spinner.hide();
          this.movimientoCasuistica = data.body;
          console.log(this.movimientoCasuistica);
          //this.detalleConsultaDTO = this.movimientoCasuistica.content[0].detalleConsultaDTO;
          //this.cifrasControlTotales = this.movimientoCasuistica.content[0].cifrasControlTotales;

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



    formData.cveDelegation = this.formGroup.get('delegation').value !== '-1' ? this.formGroup.get('delegation').value : '';
    const result0 = this.selectDelegacion.filter(delegacion => delegacion.id === Number(formData.cveDelegation));
    if (result0.length > 0) {
      formData.desDelegation = result0[0].descripcion;
    }
    formData.cveSubdelegation = this.formGroup.get('subDelegation').value !== '-1' ? this.formGroup.get('subDelegation').value : '';
    const result1 = this.selectSubDelegacion.filter(subDelegacion => String(subDelegacion.clave) === formData.cveSubdelegation);
    if (result1.length > 0) {
      formData.desSubdelegation = result1[0].descripcion;
    }
    formData.page = null;
    formData.cveTipoArchivo = this.tipoEntradaStr;


    console.log(formData);
    this.spinner.show();
    this.findControlFiguresCausiticaService.exportMovimientosPDF(formData).subscribe(
      (data) => { // Success
        this.spinner.hide();
        const contentType = 'application/pdf';
        this.b64toBlob(data, contentType);
      },
      (error) => {
        const contentType = 'application/pdf';
        this.b64toBlob(error.error.text, contentType);
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
    const fileName = 'ConsultarMovimientosCIC.pdf';
    FileSaver.saveAs(blob, fileName);
  }


  public clear() {
    // tslint:disable-next-line: max-line-length
    const meses = new Array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
    const f = new Date();
    this.formGroup.get('date2').setValue(meses[f.getMonth()] + ' ' + f.getFullYear());
    this.formGroup.get('date').setValue(meses[f.getMonth()] + ' ' + f.getFullYear());
    this.formGroup.get('tipoEntrada').setValue('-1');
    this.formGroup.get('delegation').setValue('-1');
    this.formGroup.get('subDelegation').setValue('-1');
    this.movimientoCasuistica = new MovimientoCasuisticaOutput();
    this.detalleConsultaDTO = [];
  }

  ngAfterViewInit() {
    this.chargeCalendar();
  }

  public chargeCalendar() {
    chargeBeginCalendar('#fechaInicio2causitica', this.toDateForm, this.fromDateForm, this.showMessage.bind(this));
    chargeEndCalendar('#fechaFin2causitica', this.toDateForm, this.fromDateForm, this.showMessage.bind(this));
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

  public diasEnUnMes(año, mes, tipoAnio: number) {
    let retornoAnio = new Date();
    if (tipoAnio === 1) {
      const dia = 15;
      retornoAnio = new Date(año, mes, 1);
    }
    if (tipoAnio === 2) {
      const dia = 15;
      retornoAnio = new Date(año, mes, 31);
    }

    return new Date(año, mes, 1);
  }


  public filterDelegation(user: Login) {
    if (user !== null) {
      if (user.userInfo.businessCategory !== undefined && user.userInfo.businessCategory !== null) {
        const result = this.selectDelegacion.filter(delegacion => delegacion.id === user.userInfo.businessCategory);
        if (result.length > 0) {
          this.selectDelegacion = result;
          const contador = timer(700);
          contador.subscribe((n) => {
            this.formGroup.get('delegation').setValue(this.user.userInfo.businessCategory.toString());
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
            this.formGroup.get('subDelegation').setValue(result[0].clave);
          });
          this.formGroup.get('subDelegation').setValidators(Validators.compose([
            Validators.required, ValidateSelect]));
        }
      }
    }
  }

  public selectTipoEntrada(entrada: any) {
    console.log(entrada);
    if (entrada === '-1') {
      this.tipoEntradaStr = 'General';
    } else if (entrada === -1) {
      this.tipoEntradaStr = 'General';
    } else {
      this.tipoEntradaStr = entrada;
    }
  }

  public validarAlcance() {
    this.alcance = '';
    if (this.formGroup.get('delegation').value !== '-1' && this.formGroup.get('subDelegation').value !== '-1') {
      this.alcance = 'Subdelegacional';
    } else if (this.formGroup.get('delegation').value !== '-1' && this.formGroup.get('subDelegation').value === '-1') {
      this.alcance = 'Delegacional';
    } else if (this.formGroup.get('delegation').value === '-1' && this.formGroup.get('subDelegation').value === '-1') {
      this.alcance = 'Nacional';
    }

  }

}

