import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { default as _rollupMoment } from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogUiComponent } from 'src/app/common/components/dialog/dialog-ui/dialog-ui.component';
import { DelegationService } from 'src/app/common/services/catalogs/delegation.service';
import { SubDelegationService } from 'src/app/common/services/catalogs/sub-delegation.service';
import { Delegacion } from 'src/app/common/models/delegation.model';
import { SubDelegacion } from 'src/app/common/models/subdelegation.model';
import { FormStatusFile } from 'src/app/casuistica/models/status-file/form-status-file';
import { ResultStatusFile } from 'src/app/casuistica/models/status-file/result-status-file';
import { FindStatusFileService } from 'src/app/casuistica/services/status-file/find-status-file.service';
import { GetCatalogs } from 'src/app/common/models/getcatalogs.model';
import { Catalogs } from 'src/app/common/models/catalogs.model';
import { CatalogsService } from 'src/app/common/services/catalogs/catalogs.service';
import { Login } from 'src/app/common/models/security/login';
import { SecurityService } from 'src/app/common/services/security/security.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateUtils } from 'src/app/common/functions/DateUtils';
import { Validators } from '@angular/forms';
import { ValidateSelect } from 'src/app/common/validators/common.validator';
import { chargeBeginCalendar, chargeEndCalendar, months } from 'src/app/common/utils/date-picker.util';

declare var $: any;
@Component({
  selector: 'app-search-status-file',
  templateUrl: './search-status-file.component.html',
  styleUrls: ['./search-status-file.component.css']
})

export class SearchStatusFileComponent implements OnInit, AfterViewInit {



  public formGroup: FormGroup;
  public from: FormControl;
  public to: FormControl;
  public statusFile: FormControl;
  public delegation: FormControl;
  public subDelegation: FormControl;

  public resultStatusFile: ResultStatusFile = new ResultStatusFile();
  public selectDelegacion: Delegacion[] = [];
  public selectSubDelegacion: SubDelegacion[] = [];


  public titDialogo: string;
  public messDialogo: string;
  public estadoArchivo: Catalogs[] = [];
  public catalogoInput: GetCatalogs = new GetCatalogs();
  public user: Login = new Login();

  public page;
  public pageSize = 9;
  public collectionSize = 300;
  public titulo = "Reportes / Estatus de archivos";
  //*********************  BORRAR   ************************/

  config: any;
  public maxSize: number = 7;
  public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public responsive: boolean = true;
  public labels: any = {
    previousLabel: ' Anterior ',
    nextLabel: ' Siguiente',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'page',
    screenReaderCurrentLabel: `You're on page`
  };

  private areCatalogsLoaded = [false, false];

  //****************  EJEMPLO  DE PAGINADOR BORRAR  ************/


  constructor(private formBuilder: FormBuilder, private findStatusFileService: FindStatusFileService,
    private findDelegation: DelegationService, private findSubDelegation: SubDelegationService,
    private modalService: NgbModal, private findCatalogo: CatalogsService, private securityService: SecurityService,
    private spinner: NgxSpinnerService) {
    this.page = 0;
    this.pageSize = 9;
    this.collectionSize = 300;
  }


  ngOnInit() {
    setTimeout(() => {
      this.spinner.show();
      console.log('Lanza el spinner');
    }, 0);
    this.resultStatusFile.content = [];
    this.user = JSON.parse(localStorage.getItem('user'));
    this.buildForm();

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

    this.catalogoInput.nameCatalog = 'MccEstadoArchivo';
    console.log(this.catalogoInput);
    this.findCatalogo.find(this.catalogoInput).subscribe(
      (data) => { // Success
        this.areCatalogsLoaded[1] = true;
        this.validateIfCatalogsAreLoaded();
        this.estadoArchivo = data.body;
        console.log(data);
        console.log(this.estadoArchivo);
      },
      (error) => {
        this.areCatalogsLoaded[1] = true;
        this.validateIfCatalogsAreLoaded();
        console.error(error);
      }
    );

    this.chargeCalendar();
    this.page = 0;

    //***************  BOORRAR    ********************/


    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.resultStatusFile.size
    };


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
      statusFile: [-1],
      delegation: [-1, this.user.userInfo.businessCategory !== null ? Validators.compose([
        Validators.required, ValidateSelect]) : ''],
      subDelegation: [-1, this.user.userInfo.departmentNumber !== null ? Validators.compose([
        Validators.required, ValidateSelect]) : ''],
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
      || fDate === null || toDate === null || ($('#fechaInicio2').val() === '' || $('#fechaFin2').val() === '')) {
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
  pageChanged(event) {
    this.config.currentPage = event;
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
    const formData = new FormStatusFile();

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
      formData.statusFile = result.statusFile <= 0 ? '' : result.statusFile;
      formData.cveDelegation = result.delegation <= 0 ? '' : result.delegation;
      formData.cveSubdelegation = result.subDelegation <= 0 ? '' : result.subDelegation;
      formData.page = this.page === 0 ? this.page : this.page - 1;

      console.log(formData);
      this.spinner.show();
      this.findStatusFileService.find(formData).subscribe(
        (data) => { // Success
          this.spinner.hide();
          this.resultStatusFile = data.body;
          for (var i = 0; i < this.resultStatusFile.content.length; i++) {
            this.resultStatusFile.content[i].numRegistro = i + 1;
          }
          console.log(this.resultStatusFile);
          if (this.resultStatusFile === undefined || this.resultStatusFile === null
            || (this.resultStatusFile !== null && this.resultStatusFile.size === 0)) { //|| data.content.length <= 0
            this.showMessage('No se encontraron resultados con los criterios ingresados', 'Atención');
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
    this.formGroup.get('statusFile').setValue(-1);
    this.formGroup.get('delegation').setValue(-1);
    this.formGroup.get('subDelegation').setValue(-1);
    this.resultStatusFile.content = [];
    this.page = 0;

  }

  public chargeSubDelegation(clave: string) {
    this.findSubDelegation.find(clave).subscribe(
      (data) => { // Success
        this.selectSubDelegacion = data;
        this.filterDelegation(this.user);
        console.log(this.selectSubDelegacion);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  ngAfterViewInit() {
    this.chargeCalendar();
  }

  public chargeCalendar() {

    chargeBeginCalendar('#fechaInicio2', this.toDateForm, this.fromDateForm, this.showMessage.bind(this));
    chargeEndCalendar('#fechaFin2', this.toDateForm, this.fromDateForm, this.showMessage.bind(this));

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

  public filterDelegation(user: Login) {
    if (user !== null) {
      if (user.userInfo.businessCategory !== undefined && user.userInfo.businessCategory !== null) {
        //this.formGroup.get('delegation').setValue(user.userInfo.businessCategory);
        const result = this.selectDelegacion.filter(delegacion => delegacion.id === user.userInfo.businessCategory);
        if (result.length > 0) {
          this.selectDelegacion = result;
          this.formGroup.get('delegation').setValidators(Validators.compose([
            Validators.required, ValidateSelect]));
        }
      }
      if (user.userInfo.departmentNumber !== undefined && user.userInfo.departmentNumber !== null) {
        //this.formGroup.get('subDelegation').setValue(user.userInfo.departmentNumber);
        const result = this.selectSubDelegacion.filter(subDelegacion => subDelegacion.id === user.userInfo.departmentNumber);
        if (result.length > 0) {
          this.selectSubDelegacion = result;
          this.formGroup.get('subDelegation').setValidators(Validators.compose([
            Validators.required, ValidateSelect]));
        }
      }
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

}





