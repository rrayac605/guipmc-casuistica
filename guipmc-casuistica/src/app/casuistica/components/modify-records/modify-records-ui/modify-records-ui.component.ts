import { Component, OnInit , AfterViewInit, LOCALE_ID, ElementRef, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DetailSearchRecordsDTO } from 'src/app/casuistica/models/search-records/detailSearchRecordsDTO';
import { FormSearchDetailRecords } from 'src/app/casuistica/models/records-detail/form-search-detail-records';
import { RecordsDetailInfo } from 'src/app/casuistica/models/records-detail/recordsDetailInfo';
import { MovementsService } from 'src/app/casuistica/services/movements/movements.service';
import { Login } from 'src/app/common/models/security/login';
import { Catalogs } from 'src/app/common/models/catalogs.model';
import { GetCatalogs } from 'src/app/common/models/getcatalogs.model';
import { CatalogsService } from 'src/app/common/services/catalogs/catalogs.service';
import { ValidateSelect } from 'src/app/common/validators/common.validator';
import { LocalValidationService } from 'src/app/casuistica/services/validation/local-validation.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ValidationForm } from 'src/app/casuistica/models/validation/validationForm';
import { ResponseValidation } from 'src/app/casuistica/models/validation/responseValidation';
import { WharehouseValidationService } from 'src/app/casuistica/services/validation/wharehouse-validation.service';
import { ResponseWhareHouseValidation } from 'src/app/casuistica/models/validation/responseWharehouseValidation';
import { DuplicateValidationService } from 'src/app/casuistica/services/validation/duplicate-validation.service';
import { DetalleRegistroDTO } from 'src/app/casuistica/models/validation/detalleRegistroDTO';
import { SaveMovementService } from 'src/app/casuistica/services/saveMovement/save-movement.service';
import { CamposOriginalesDTO } from '../../../models/camposOriginalesDTO';
import { Auditorias } from 'src/app/casuistica/models/auditorias';
import { PatronesService } from 'src/app/casuistica/services/bdtu/patrones.service';
import { AseguradosService } from 'src/app/casuistica/services/bdtu/asegurados.service';
import { formatDate } from '@angular/common';
import { map } from 'rxjs/operators';
import { BitacoraDictamenDTO } from 'src/app/casuistica/models/BitacoraDictamenDTO';
import { ReporteService } from 'src/app/common/services/reportes/reporte.service';
import { RequestConsultDictamenSist } from 'src/app/common/models/reporte/RequestConsultDictamenSist';
import * as FileSaver from 'file-saver';

// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-modify-records-ui',
  templateUrl: './modify-records-ui.component.html',
  styleUrls: ['./modify-records-ui.component.scss']
})
export class ModifyRecordsUiComponent implements OnInit, AfterViewInit {
  public formGroup: FormGroup;
  public titDialogo: string;
  public messDialogo: string;
  public titDialogoSave: string;
  public messDialogoSave: string;
  public mostrarSi: boolean;
  public insertado: boolean;
  public dateCambio = false;
  public dateCambio2 = false;

  public form: any;
  public details: DetailSearchRecordsDTO[] = [];
  public selectedItem: DetailSearchRecordsDTO;
  public formDetail: FormSearchDetailRecords = new FormSearchDetailRecords();
  public info: RecordsDetailInfo = new RecordsDetailInfo();
  public user: Login = new Login();

  public catTipoRiesgo: Catalogs[] = [];
  public catConsecuencia: Catalogs[] = [];
  public catalogoInput: GetCatalogs = new GetCatalogs();
  public catalogoInput1: GetCatalogs = new GetCatalogs();
  public responseValidation: ResponseValidation[] = [];
  public responseWharehouseValidation: ResponseWhareHouseValidation;
  public responseSearch: ResponseWhareHouseValidation;
  public originalNSS: string;
  public originalRP: string;
  public isValidateOk: boolean;
  public camposOriginales: CamposOriginalesDTO;
  public disableSublime: boolean = false;

  public formDetalleReg: DetalleRegistroDTO;
  public showDictamen: boolean = false;

  public pdfContent: any;
  @ViewChild('pdfview') pdfview: ElementRef;
  @ViewChild('pdfviewSIST') pdfviewSIST: ElementRef;
  public showBtnDictamen: boolean = false;

  public numFolio: "";
  public adjDictamen: "";
  public file: any;
  public blob: any;
  public ditamenName: string;
  public ditamenNameSIST: string;
  titulo = 'Realizar movimientos / Modificar movimiento';

  constructor(private formBuilder: FormBuilder,
              private modalService: NgbModal , private router: Router, private findMovements: MovementsService,
              private findCatalogo: CatalogsService, private localValidationService: LocalValidationService,
              private spinner: NgxSpinnerService, private wharehouseValidationService: WharehouseValidationService,
              private duplicateValidationService: DuplicateValidationService, private saveMovementService: SaveMovementService,
              private patronesService: PatronesService, private aseguradosService: AseguradosService,
              private reporteService: ReporteService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.selectedItem = JSON.parse(localStorage.getItem('selected'));
    this.form = JSON.parse(localStorage.getItem('form'));
    console.log('selected: ' + JSON.stringify(this.selectedItem));
    console.log('form: ' + this.form);
    this.insertado = false;

    this.formDetail.objectId = this.selectedItem.objectId;
    this.formDetail.numNss = this.selectedItem.numNss;
    this.formDetail.position = this.selectedItem.position;
    this.formDetail.numFolioMovtoOriginal = this.selectedItem.numFolioMovtoOriginal;
    this.formDetail.objectIdOrigen = this.info.objectIdOrigen;

    if (localStorage.getItem('info') !== null) {
      this.info = JSON.parse(localStorage.getItem('info'));
      this.viewBtnDictamen();
    } else {

      this.spinner.show();
      this.findMovements.getDetalleMovimientos(this.formDetail).subscribe(
        (response: any) => {
          this.spinner.hide();
          switch (response.status) {
            case 200:
            case 206:
              this.info = response.body;
              const nombre = this.info.aseguradoDTO.nomAsegurado !== null ? this.info.aseguradoDTO.nomAsegurado : '';
              const app = this.info.aseguradoDTO.refPrimerApellido !== null ? this.info.aseguradoDTO.refPrimerApellido : '';
              const apm = this.info.aseguradoDTO.refSegundoApellido !== null ? this.info.aseguradoDTO.refSegundoApellido : '';
              this.info.aseguradoDTO.nombreCompleto = nombre + ' ' + app + ' ' + apm;
              this.viewBtnDictamen();
              break;
            case 204:
              this.info = new RecordsDetailInfo();
              break;
            case 504:
              this.info = new RecordsDetailInfo();
              break;
            case 500:
              this.info = new RecordsDetailInfo();
              break;
          }
          if (this.info.aseguradoDTO === null || this.info.incapacidadDTO === null || this.info.patronDTO === null) {
            this.showMessage('No se encontraron resultados con los criterios ingresados', 'Atención');
          }
        }, err => {
          this.spinner.hide();
          this.showMessage('Problemas con el servicio ' + err.message, 'Atención');
        }, () => {
          // window.scrollTo(0, 600);
        });      

    }

    this.buildForm();

    this.catalogoInput.nameCatalog = 'MccTipoRiesgo';
    console.log(this.catalogoInput);
    this.findCatalogo.find(this.catalogoInput).subscribe(
      (data) => { // Success
        this.catTipoRiesgo = data.body;
        this.catTipoRiesgo = this.catTipoRiesgo.sort((a, b) => {
          if (a.cveCatalogo > b.cveCatalogo) {
            return 1;
          }
          if (a.cveCatalogo < b.cveCatalogo) {
            return -1;
          }
          return 0;
        });
        console.log(this.catTipoRiesgo);
        // tslint:disable-next-line: max-line-length
        const result = this.catTipoRiesgo.filter(tipoRiesgo => tipoRiesgo.cveCatalogo === (this.info.incapacidadDTO.cveTipoRiesgo + ''));
        if (this.info.incapacidadDTO.cveTipoRiesgo !== null && result.length > 0) {
          this.formGroup.get('tipoRiesgo').setValue(this.info.incapacidadDTO.cveTipoRiesgo);
        }

      },
      (error) => {
        console.error(error);
      }
    );

    this.catalogoInput1.nameCatalog = 'MccConsecuencia';
    console.log(this.catalogoInput1);
    this.findCatalogo.find(this.catalogoInput1).pipe(
      map(response => ({
        ...response, body : response.body.sort((cat1, cat2) => Number(cat1.cveCatalogo) - Number(cat2.cveCatalogo))
      })),
    ).subscribe(
      (data) => { // Success
        this.catConsecuencia = data.body;
        console.log(this.catConsecuencia);
        const result = this.catConsecuencia.filter(consecuencia => consecuencia.cveCatalogo === (this.info.incapacidadDTO.cveConsecuencia + ''));
        if (this.info.incapacidadDTO.cveConsecuencia !== null && result.length > 0) {
          this.formGroup.get('consecuencia').setValue(this.info.incapacidadDTO.cveConsecuencia);
        }

      },
      (error) => {
        console.error(error);
      }
    );



    this.clearLocalStorage();

    const finicio = new Date(this.info.incapacidadDTO.fecInicio);
    const ffin = new Date(this.info.incapacidadDTO.fecFin);

    this.formGroup.get('nss').setValue(this.info.aseguradoDTO.numNss);
    this.formGroup.get('diasSubsidiados').setValue(this.info.incapacidadDTO.numDiasSubsidiados);
    this.formGroup.get('registroPatronal').setValue(this.info.patronDTO.refRegistroPatronal);
    this.formGroup.get('porcentajeIncapacidad').setValue(this.info.incapacidadDTO.porPorcentajeIncapacidad);

    this.originalNSS = this.info.aseguradoDTO.numNss;
    this.originalRP = this.info.patronDTO.refRegistroPatronal;

    this.camposOriginales = new CamposOriginalesDTO();
    this.camposOriginales.consecuencia = this.info.incapacidadDTO.cveConsecuencia;
    this.camposOriginales.diasSubsidiados = this.info.incapacidadDTO.numDiasSubsidiados;
    this.camposOriginales.fechaFin = this.info.incapacidadDTO.fecFin;
    this.camposOriginales.fechaInicio = this.info.incapacidadDTO.fecInicio;
    this.camposOriginales.nss = this.info.aseguradoDTO.numNss;
    this.camposOriginales.procentaje = this.info.incapacidadDTO.porPorcentajeIncapacidad;
    this.camposOriginales.rp = this.info.patronDTO.refRegistroPatronal;
    this.camposOriginales.tipoRiesgo = this.info.incapacidadDTO.cveTipoRiesgo;
    this.camposOriginales.cveEstadoRegistro = this.info.aseguradoDTO.cveEstadoRegistro as unknown as number;
    this.camposOriginales.desEstadoRegistro = this.info.aseguradoDTO.desEstadoRegistro;

    if(this.validaDictamen()){
        this.formGroup.get('tipoDictamen').setValue(this.info.incapacidadDTO.bitacoraDictamen.filter(bitacoraDictamen => bitacoraDictamen.activo)?.[0]?.tipoDictamen);
        this.formGroup.get('numFolio').setValue(this.info.incapacidadDTO.bitacoraDictamen.filter(bitacoraDictamen => bitacoraDictamen.activo)?.[0]?.numFolio);
    }

    this.formGroup.markAllAsTouched();

  }

  ngAfterViewInit() {
    this.chargeCalendar();
    this.formGroup.markAllAsTouched();
    this.changeTipoDictamen();
}
public chargeCalendar() {
  // tslint:disable-next-line: max-line-length
  const meses = new Array ('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
  const self = this;
  let yMause = 0;

  $('#fechaModifyRec').mousemove(function(event) {
       yMause = 0;
       yMause = event.pageY - this.offsetTop;
  });

  $('#fechaModifyRec2').mousemove(function(event) {
      yMause = 0;
      yMause = event.pageY - this.offsetTop;
  });

  $('#fechaModifyRec').datepicker({
         closeText: 'Cerrar',
          prevText: '<Ant',
          dateFormat: 'dd/mm/yy',
          nextText: 'Sig>',
          currentText: 'Hoy',
          monthNames: meses,
          monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
          showButtonPanel: true,

          onClose(dateText, inst) {
            console.log(' ==> CERRAR');
            self.formGroup.get('date').setValue($(this).val());
          },
          onSelect(dateText, inst) {
              self.formGroup.get('date').setValue($(this).val());
          },
          beforeShow(input, inst) {
             setTimeout(function() {
                 inst.dpDiv.css({ top: yMause + 50});
             }, 50);
     },
  });

  $('#fechaModifyRec').mousemove(function(event) {
       yMause = 0;
       yMause = event.pageY - this.offsetTop;
  });

  $('#fechaModifyRec').on('change', function() {
      self.formGroup.get('date').setValue($(this).val());
 });

  $('#fechaModifyRec2').datepicker({
      closeText: 'Cerrar',
      prevText: '<Ant',
      nextText: 'Sig>',
      dateFormat: 'dd/mm/yy',
      currentText: 'Hoy',
      monthNames: meses,
      monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      showButtonPanel: true,
      onClose(dateText, inst) {
        self.formGroup.get('date2').setValue($(this).val());
      },

      beforeShow(input, inst) {
          setTimeout(function() {
              inst.dpDiv.css({ top: yMause + 50});
          }, 300);
       },
  });

  $('#fechaModifyRec2').mousemove(function(event) {
    yMause = 0;
    yMause = event.pageY - this.offsetTop;
});
  $('#fechaModifyRec2').on('change', function() {
    self.formGroup.get('date2').setValue($(this).val());
});
}

private buildForm() {
    this.formGroup = this.formBuilder.group({
      nss: [this.info.aseguradoDTO.numNss,  Validators.compose([
        Validators.required,
        Validators.maxLength(11),
        Validators.pattern('[0-9]*')
    ])],
      date: [this.info.incapacidadDTO.fecInicio != null ? formatDate(this.info.incapacidadDTO.fecInicio, 'dd/MM/yyyy', 'en') : '',  Validators.compose([
        Validators.required
        , Validators.pattern('^([0-2][0-9]|3[0-1])(\\/|-)(0[1-9]|1[0-2])\\2(\\d{4})$')
    ])],
      date2: [this.info.incapacidadDTO.fecFin != null ? formatDate(this.info.incapacidadDTO.fecFin, 'dd/MM/yyyy', 'en') : '',  Validators.compose([
        Validators.required
        , Validators.pattern('^([0-2][0-9]|3[0-1])(\\/|-)(0[1-9]|1[0-2])\\2(\\d{4})$')
    ])],
      diasSubsidiados: [this.info.incapacidadDTO.numDiasSubsidiados,  Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(1000),
        Validators.pattern('[0-9]*')
    ])],
      tipoRiesgo: [-1,  Validators.compose([
        Validators.required,
        ValidateSelect
    ])],
      porcentajeIncapacidad: [this.info.incapacidadDTO.porPorcentajeIncapacidad,  Validators.compose([
      Validators.required,
      Validators.min(0),
      Validators.max(100),
      Validators.pattern('[0-9]*')
    ])],
      consecuencia: ['-1',  Validators.compose([
        Validators.required,
        ValidateSelect
    ])],
      registroPatronal: [this.info.patronDTO.refRegistroPatronal,  Validators.compose([
        Validators.required,
        Validators.maxLength(11),
        Validators.pattern('[A-Za-z0-9]*')
    ])],
      comentario: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(250),
        Validators.pattern('[A-Za-z0-9\\\s\\\u00f1\\\u00d1áéíóúÁÉÍÓÚàèìòùÀÈÌÒÙ\\\°\\\!\\\”#$%&\\\/\\\(\\\)=?¡*\\\¨\\\]\\\[\\\}\\\{\\\-,.:;\\\<\\\>\\\+]+$')
    ])],
      tipoDictamen: ['-1',  Validators.compose([
      ])],
      numFolio: ['',  Validators.compose([
      ])],
      adjDictamen: ['',  Validators.compose([
      ])],
   });
    this.formGroup.get('date')
   .valueChanges
   .subscribe(value => {
    });
 }

public guardarCambios() {
  this.formGroup.markAllAsTouched();
  if (!this.formGroup.valid ) {
      this.showMessage('Ingresar datos requeridos.', 'Atención');
      this.mostrarSi = false;
   } else {
    this.showMessage('¿Esta seguro que desea modificar la información?', 'Atención');
    this.mostrarSi = true;
   }
}

public guardar() {
  const toForm: ValidationForm = new ValidationForm();
  toForm.consecuencia = this.formGroup.get('consecuencia').value;
  toForm.diasSubsidiados = this.formGroup.get('diasSubsidiados').value;
  toForm.fechaFin = this.formGroup.get('date2').value;
  toForm.fechaInicio = this.formGroup.get('date').value;
  toForm.nss = this.formGroup.get('nss').value;
  toForm.procentaje = this.formGroup.get('porcentajeIncapacidad').value;
  toForm.rp = this.formGroup.get('registroPatronal').value;
  toForm.tipoRiesgo = this.formGroup.get('tipoRiesgo').value;
  toForm.fecProcesoCarga = this.info.aseguradoDTO.fecAlta;
  if (this.info.incapacidadDTO.fecAccidente !== null && this.info.incapacidadDTO.fecAccidente !== undefined) {
    toForm.fechaAccidente = new Date(this.info.incapacidadDTO.fecAccidente).getDate() + '/' +
      (new Date(this.info.incapacidadDTO.fecAccidente).getMonth() + 1) + '/' +
      new Date(this.info.incapacidadDTO.fecAccidente).getFullYear();
  }
  this.spinner.show();
  console.log(toForm);

  this.localValidationService.validate(toForm).subscribe(
        (response: any) => {
          this.spinner.hide();
          switch (response.status) {
            case 200:
            case 206:
              this.responseValidation = response.body;
              toForm.cambioNss = this.cambioNSS(toForm);
              toForm.cambioRp = this.cambioRP(toForm);
              this.camposOriginales.cambioNss = toForm.cambioNss === 'true';
              this.camposOriginales.cambioRp = toForm.cambioRp === 'true';

              if (this.responseValidation.length === 0) {
                  // this.showMessageV2('La actualización se realizó correctamete.', 'Atención');
                  if (toForm.cambioNss === 'true' || toForm.cambioRp === 'true') {
                    this.validarAlmacenes(toForm);
                  } else {
                    this.getNewChanges();
                    const formDup: DetalleRegistroDTO =  new DetalleRegistroDTO();
                    formDup.aseguradoDTO = this.info.aseguradoDTO;
                    formDup.patronDTO = this.info.patronDTO;
                    formDup.incapacidadDTO = this.info.incapacidadDTO;
                    formDup.fecProcesoCarga = this.info.aseguradoDTO.fecAlta;
                    formDup.objectIdOrigen = this.info.objectIdOrigen;
                    this.validarDuplicados(formDup);
                  }
              } else {
                  this.showMessageV3('', 'Atención');
                  this.spinner.hide();
                }


              break;
            case 204:
              this.responseValidation = [];
              break;
            case 504:
              this.responseValidation = [];
              break;
            case 500:
              this.responseValidation = [];
              break;
          }
        }, err => {
          // this.spinner.hide();
          if (err.status !== null ) {
            switch (err.status) {
              case 401:
                this.showMessage('Usuario no autorizado', 'Atención');
                this.responseValidation = [];
                break;
              case 504:
                this.showMessage('Servicio no disponible', 'Atención');
                this.responseValidation = [];
                break;
              case 500:
                this.showMessage('Servicio de validación almacenes no disponible', 'Atención');
                this.responseValidation = [];
                break;
            }
          } else {
            this.showMessage('Problemas con el servicio ' + err.message, 'Atención');
          }
        }, () => {
           this.spinner.hide();
          // window.scrollTo(0, 600);
        });




}

public showMessage(message: string, title: string) {
  console.log('showmessa');
  this.titDialogo = title;
  this.messDialogo = message;
  $('#dialogMessage').modal('show');
}

public hideMessage(modal: string) {
    $('#' + modal).modal('hide');
}

public showMessageV2(message: string, title: string) {
  console.log('showmessa');
  this.titDialogo = title;
  this.messDialogo = message;
  $('#dialogMessageV2').modal('show');
}

public showMessageV3(message: string, title: string) {
  console.log('showmessa');
  this.titDialogo = title;
  this.messDialogo = message;
  $('#dialogMessageV3').modal('show');
}

public showMessageV4(message: string, title: string) {
  console.log('showmessa');
  this.titDialogoSave = title;
  this.messDialogoSave = message;
  $('#dialogMessageV4').modal('show');
}

public salir() {
  this.hideMessage('dialogMessageV3');
  localStorage.setItem('form', JSON.stringify(this.form));
  this.router.navigate(['/searchRecords', {}]);
}

public salirUpdate() {
  this.hideMessage('dialogMessageV4');
  localStorage.setItem('form', JSON.stringify(this.form));
  this.router.navigate(['/searchRecords', {}]);
}

public siGuardar() {
   this.hideMessage('dialogMessage');
   this.mostrarSi = false;
   this.guardar();
}

public regresar() {
  localStorage.setItem('form', JSON.stringify(this.form));
  localStorage.setItem('info', JSON.stringify(this.info));
  localStorage.setItem('selected', JSON.stringify(this.selectedItem));
  this.router.navigate(['/recordsDetailUiComponent', {}]);
}

public clearLocalStorage() {
  localStorage.removeItem('detail');
  localStorage.removeItem('selected');
  localStorage.removeItem('form');
  localStorage.removeItem('info');

}

public validarAlmacenes(toForm: ValidationForm) {
// Validacion de almacenes
  this.spinner.show();
  console.log('form almacenes:' + toForm);

  this.wharehouseValidationService.validate(toForm).subscribe(
      (response: any) => {
        switch (response.status) {
          case 200:
          case 206:
            this.responseWharehouseValidation = response.body;
            if (this.responseWharehouseValidation.bitacoraErroresDTO == null) {
              this.getNewChanges();
              const formDup: DetalleRegistroDTO =  new DetalleRegistroDTO();
              formDup.aseguradoDTO = this.info.aseguradoDTO;
              formDup.patronDTO = this.info.patronDTO;
              formDup.incapacidadDTO = this.info.incapacidadDTO;
              formDup.fecProcesoCarga = this.info.aseguradoDTO.fecAlta;
              formDup.objectIdOrigen = this.info.objectIdOrigen;
              this.validarDuplicados(formDup);
            }
            else {
              this.responseValidation = this.responseValidation.concat(this.responseWharehouseValidation.bitacoraErroresDTO);
              this.showMessageV3('', 'Atención');
              this.spinner.hide();
            }
            break;
          case 204:
            this.responseWharehouseValidation = new ResponseWhareHouseValidation();
            break;
          case 504:
            this.responseWharehouseValidation = new ResponseWhareHouseValidation();
            break;
          case 500:
            const responseValidation3: ResponseValidation[] = [];
            const tmp1 = new ResponseValidation();
            tmp1.desCodigoError = 'Servicio de validación de almacenes no disponible.';
            responseValidation3[0] = tmp1;
            this.responseValidation = this.responseValidation.concat(responseValidation3);
            this.showMessageV3('', 'Atención');
            this.spinner.hide();
            break;
        }
      }, err => {
         this.spinner.hide();
        if (err.status !== null ) {
          switch (err.status) {
            case 401:
              const responseValidation2: ResponseValidation[] = [];
              const tmp = new ResponseValidation();
              tmp.desCodigoError = 'Usuario no autorizado validación almacenes';
              responseValidation2[0] = tmp;
              this.responseValidation = this.responseValidation.concat(responseValidation2);
              this.showMessageV3('', 'Atención');
              this.spinner.hide();
              break;
            case 500:
            case 504:
              const responseValidation3: ResponseValidation[] = [];
              const tmp1 = new ResponseValidation();
              tmp1.desCodigoError = 'Servicio de validación de almacenes no disponible.';
              responseValidation3[0] = tmp1;
              this.responseValidation = this.responseValidation.concat(responseValidation3);
              this.showMessageV3('', 'Atención');
              this.spinner.hide();
              break;


          }
        } else {
          this.showMessage('Problemas con el servicio ' + err.message, 'Atención');
        }
      }, () => {
         this.spinner.hide();
        // window.scrollTo(0, 600);
      });
}


public validarDuplicados(toForm: DetalleRegistroDTO) {
// Validacion de duplicados
  let responseDuplicate: ResponseValidation[] = [];
  this.spinner.show();
  console.log('form almacenes:' + toForm);

  this.duplicateValidationService.validate(toForm).subscribe(
      (response: any) => {
        switch (response.status) {
          case 200:
          case 206:
            responseDuplicate = response.body;
            if (responseDuplicate === null || responseDuplicate.length === 0) {
              this.getNewChanges();

              const formDup: DetalleRegistroDTO =  new DetalleRegistroDTO();
              formDup.aseguradoDTO = this.info.aseguradoDTO;
              formDup.patronDTO = this.info.patronDTO;
              formDup.incapacidadDTO = this.info.incapacidadDTO;
              const auditoriaDTO: Auditorias = new Auditorias();
              auditoriaDTO.desObservacionesSol = this.formGroup.get('comentario').value;
              auditoriaDTO.desCambio = this.formGroup.get('comentario').value;
              auditoriaDTO.desAccionRegistro = "Modificación pendiente";
              auditoriaDTO.cveIdAccionRegistro = 5;
              auditoriaDTO.nomUsuario = this.user.userInfo.uid;
              auditoriaDTO.camposOriginalesDTO = this.camposOriginales;
              formDup.auditorias = [auditoriaDTO];
              formDup.fecProcesoCarga = this.info.aseguradoDTO.fecAlta;
              formDup.objectIdOrigen = this.info.objectIdOrigen;
              console.log('GUARDANDO -->' + JSON.stringify(formDup));
              this.guardarMovimientos(formDup);
            } else if (responseDuplicate !== null && responseDuplicate.length > 0) {

              this.responseValidation = this.responseValidation.concat(responseDuplicate);
              this.showMessageV3('', 'Atención');
              this.spinner.hide();
            }
            break;
          case 204:
            break;
          case 504:
            break;
          case 500:
            break;
        }
      }, err => {
        this.spinner.hide();
        this.responseValidation = this.responseValidation.concat(responseDuplicate);
        this.showMessageV3('', 'Atención');
        if (err.status !== null ) {


          switch (err.status) {
            case 401:
              const responseValidation2: ResponseValidation[] = [];
              const tmp = new ResponseValidation();
              tmp.desCodigoError = 'Usuario no autorizado validación duplicados';
              responseValidation2[0] = tmp;
              this.responseValidation = this.responseValidation.concat(responseValidation2);
              this.showMessageV3('', 'Atención');
              this.spinner.hide();
              break;
            case 500:
            case 504:
              const responseValidation3: ResponseValidation[] = [];
              const tmp1 = new ResponseValidation();
              tmp1.desCodigoError = 'Servicio de validación de duplicados no disponible.';
              responseValidation3[0] = tmp1;
              this.responseValidation = this.responseValidation.concat(responseValidation3);
              this.showMessageV3('', 'Atención');
              this.spinner.hide();
              break;
          }
        } else {
          this.showMessage('Problemas con el servicio ' + err.message, 'Atención');
        }
      }, () => {
        this.spinner.hide();
        // window.scrollTo(0, 600);
      });
}


  private getNewChanges() {
    // tslint:disable-next-line: max-line-length
    const resultcatTipoRiesgo = this.catTipoRiesgo.filter(tipoRiesgo => tipoRiesgo.cveCatalogo === (this.formGroup.get('tipoRiesgo').value.toString()));
    // tslint:disable-next-line: max-line-length
    const resultcatConsecuencia = this.catConsecuencia.filter(consecuencia => consecuencia.cveCatalogo === (this.formGroup.get('consecuencia').value.toString()));
    const ffin1 = this.formGroup.get('date2').value.split('/');
    const fini1 = this.formGroup.get('date').value.split('/');
    this.info.incapacidadDTO.fecInicio = new Date(fini1[2], fini1[1] - 1, fini1[0]);
    this.info.incapacidadDTO.fecFin = new Date(ffin1[2], ffin1[1] - 1, ffin1[0]);
    this.info.incapacidadDTO.cveConsecuencia = resultcatConsecuencia[0].cveCatalogo;
    this.info.incapacidadDTO.desConsecuencia = resultcatConsecuencia[0].descCatalogo;
    this.info.incapacidadDTO.numDiasSubsidiados = this.formGroup.get('diasSubsidiados').value;
    this.info.incapacidadDTO.porPorcentajeIncapacidad = this.formGroup.get('porcentajeIncapacidad').value;
    this.info.incapacidadDTO.cveTipoRiesgo = resultcatTipoRiesgo[0].cveCatalogo;
    this.info.incapacidadDTO.desTipoRiesgo = resultcatTipoRiesgo[0].descCatalogo;
    this.info.aseguradoDTO.numNss = this.formGroup.get('nss').value;
    this.info.patronDTO.refRegistroPatronal = this.formGroup.get('registroPatronal').value;
  }

public guardarMovimientos(toForm: DetalleRegistroDTO) {
  // Validacion de duplicados
    const response: ResponseValidation[] = [];
    const perfil: string = JSON.parse(localStorage.getItem('user'))?.userInfo?.imssperfiles;
    if (perfil === 'MEDICO OPERATIVO DE SALUD EN EL TRABAJO') {
      toForm.origenAlta = 'ST';
    } else if (perfil === 'TITULAR DE LA OFICINA DE EJERCICIO PRESUPUESTAL Y OBLIGACIONES (OEPO)' ||
    perfil === 'TITULAR DE LA JEFATURA DE ÁREA DE OBLIGACIONES LABORALES' ||
    perfil === 'TITULAR DE LA DIVISIÓN DE OBLIGACIONES PATRONALES') {
      toForm.origenAlta = 'EP';
    } else {
      toForm.origenAlta = 'CE';
    }
    this.spinner.show();
    toForm.objectIdOrigen = this.selectedItem.objectId;
    toForm.cveOrigenArchivo = this.selectedItem.cveOrigenArchivo;

    var dictamen:BitacoraDictamenDTO = new BitacoraDictamenDTO();
    if(this.formGroup.get('tipoDictamen').value !== '-1' && this.file !== undefined && this.file !== null){
      dictamen.tipoDictamen = this.formGroup.get('tipoDictamen').value;
      dictamen.numFolio = this.formGroup.get('numFolio').value;
      dictamen.ubicacionArchivo = '';
      dictamen.nomArchivo = '';
      dictamen.activo = true;
      toForm.incapacidadDTO.bitacoraDictamen = [dictamen];
    }
    
    if(toForm.incapacidadDTO?.bitacoraDictamen !== null && toForm.incapacidadDTO?.bitacoraDictamen !== undefined){
      if(!this.showDictamen){
        if(toForm.incapacidadDTO?.bitacoraDictamen[0]?.activo !== null && toForm.incapacidadDTO?.bitacoraDictamen[0]?.activo !== undefined){
          toForm.incapacidadDTO.bitacoraDictamen[0].activo = false;
        }
      }
    }

    console.log('form dictamen:' + JSON.stringify(dictamen));
    console.log('form guardar:' + JSON.stringify(toForm));

    this.saveMovementService.insertar(toForm).subscribe(
        (response: any) => {
          switch (response.status) {
            case 200:
            case 206:
              console.log(response);
              this.formDetalleReg = response.body;
              if (this.formDetalleReg !== null && this.formDetalleReg.objectIdOrigen !== null &&
                this.formDetalleReg.objectIdOrigen.length > 0) {
                this.upload(this.formDetalleReg.objectIdOrigen, this.formDetalleReg.aseguradoDTO.numNss,
                  this.formDetalleReg.cveOrigenArchivo);
              } else if (response !== null && response.length > 0) {
                this.responseValidation = this.responseValidation.concat(response);
                this.showMessageV3('', 'Atención');
              }
              break;
            case 204:
              break;
            case 504:
              break;
            case 500:
              break;
          }
        }, err => {
          this.spinner.hide();
          if (err.status !== null ) {
            switch (err.status) {
              case 200:
              case 206:
                this.mostrarSi = true;
                this.insertado = true;
                const responseValidation5: ResponseValidation[] = [];
                const tmp3 = new ResponseValidation();
                tmp3.desCodigoError = err.error.text;
                responseValidation5[0] = tmp3;
                this.responseValidation = this.responseValidation.concat(responseValidation5);
                this.showMessageV3('', 'Atención');

                break;
              case 400:
                const responseValidation4: ResponseValidation[] = [];
                const tmp2 = new ResponseValidation();
                tmp2.desCodigoError = err.error.message;
                responseValidation4[0] = tmp2;
                this.responseValidation = this.responseValidation.concat(responseValidation4);
                this.showMessageV3('', 'Atención');
                break;
              case 401:
                const responseValidation2: ResponseValidation[] = [];
                const tmp = new ResponseValidation();
                tmp.desCodigoError = 'Usuario no autorizado para guardar movimiento';
                responseValidation2[0] = tmp;
                this.responseValidation = this.responseValidation.concat(responseValidation2);
                this.showMessageV3('', 'Atención');
                break;
              case 500:
              case 504:
                const responseValidation3: ResponseValidation[] = [];
                const tmp1 = new ResponseValidation();
                tmp1.desCodigoError = 'Servicio de inserción de movimientos no disponible.';
                responseValidation3[0] = tmp1;
                this.responseValidation = this.responseValidation.concat(responseValidation3);
                this.showMessageV3('', 'Atención');
                break;
            }
          } else {
            this.showMessage('Problemas con el servicio ' + err.message, 'Atención');
          }
        }, () => {
          this.spinner.hide();
          // window.scrollTo(0, 600);
        });
  }

public cambioNSS(form: ValidationForm) {
    return 'true';
}

public cambioRP(form: ValidationForm) {
    return 'true';
}

public getError(controlName: string): string {
  let error = '';
  const control = this.formGroup.get(controlName);
  if (control.touched && control.errors != null && control.status !== 'VALID') {
    // error = JSON.stringify(control.errors) + control.status;
    error = 'Campo inválido.';
  }
  return error;
}

public buscarAsegurado() {
  const toForm: ValidationForm = new ValidationForm();

  toForm.nss = this.formGroup.get('nss').value;

  this.spinner.show();
  console.log(toForm);

  this.aseguradosService.buscar(toForm).subscribe(
        (response: any) => {
          switch (response.status) {
            case 200:
            case 206:
              this.responseSearch = response.body;

              if (this.responseSearch !== null && this.responseSearch !== undefined && this.responseSearch.aseguradoDTO !== null) {
                  //this.info.aseguradoDTO = this.responseSearch.aseguradoDTO;
                  this.info.aseguradoDTO.refCurp = this.responseSearch.aseguradoDTO.refCurp;
                  this.info.aseguradoDTO.numNss = this.responseSearch.aseguradoDTO.numNss;
                  this.info.aseguradoDTO.nomAsegurado = this.responseSearch.aseguradoDTO.nomAsegurado !== null ? this.responseSearch.aseguradoDTO.nomAsegurado : '';
                  this.info.aseguradoDTO.refPrimerApellido = this.responseSearch.aseguradoDTO.refPrimerApellido != null ?  this.responseSearch.aseguradoDTO.refPrimerApellido : '';
                  this.info.aseguradoDTO.refSegundoApellido = this.responseSearch.aseguradoDTO.refSegundoApellido != null ? this.responseSearch.aseguradoDTO.refSegundoApellido : '';
                  this.info.aseguradoDTO.cveDelegacionNss = this.responseSearch.aseguradoDTO.cveDelegacionNss;
                  this.info.aseguradoDTO.cveSubdelNss = this.responseSearch.aseguradoDTO.cveSubdelNss;
                  this.info.aseguradoDTO.cveUmfAdscripcion = this.responseSearch.aseguradoDTO.cveUmfAdscripcion;
                  this.info.aseguradoDTO.desDelegacionNss = this.responseSearch.aseguradoDTO.desDelegacionNss;
                  this.info.aseguradoDTO.desSubDelNss = this.responseSearch.aseguradoDTO.desSubDelNss;
                  this.info.aseguradoDTO.desUmfAdscripcion = this.responseSearch.aseguradoDTO.desUmfAdscripcion;
                  const nombre = this.info.aseguradoDTO.nomAsegurado !== null ? this.info.aseguradoDTO.nomAsegurado : '';
                  const app = this.info.aseguradoDTO.refPrimerApellido !== null ? this.info.aseguradoDTO.refPrimerApellido : '';
                  const apm = this.info.aseguradoDTO.refSegundoApellido !== null ? this.info.aseguradoDTO.refSegundoApellido : '';
                  this.info.aseguradoDTO.nombreCompleto = nombre + ' ' + app + ' ' + apm;

                } else {
                  this.responseValidation = this.responseValidation.concat(this.responseSearch.bitacoraErroresDTO);
                  this.showMessageV3('', 'Atención');
                  this.spinner.hide();
                }


              break;
            case 204:
            case 500:
            case 504:
              this.responseValidation = [];
              break;
          }
        }, err => {
          this.spinner.hide();
          if (err.status !== null ) {
            switch (err.status) {
              case 401:
                this.showMessage('Usuario no autorizado', 'Atención');
                this.responseValidation = [];
                break;
              case 500:
              case 504:
                this.showMessage('Asegurado no encontrado.', 'Atención');
                this.responseValidation = [];
                break;
            }
          } else {
            this.showMessage('Asegurado no encontrado. ' + err.message, 'Atención');
          }
        }, () => {
          this.spinner.hide();
          // window.scrollTo(0, 600);
        });




}


public buscarPatron() {
  const toForm: ValidationForm = new ValidationForm();

  toForm.rp = this.formGroup.get('registroPatronal').value;

  this.spinner.show();
  console.log(toForm);

  this.patronesService.buscar(toForm).subscribe(
        (response: any) => {
          switch (response.status) {
            case 200:
            case 206:
              this.responseSearch = response.body;

              if (this.responseSearch !== null && this.responseSearch !== undefined && this.responseSearch.patronDTO !== null) {
                  this.info.patronDTO = this.responseSearch.patronDTO;
                } else {
                  this.responseValidation = this.responseValidation.concat(this.responseSearch.bitacoraErroresDTO);
                  this.showMessageV3('', 'Atención');
                  this.spinner.hide();
                }


              break;
            case 204:
            case 500:
            case 504:
              this.responseValidation = [];
              break;
          }
        }, err => {
          this.spinner.hide();
          if (err.status !== null ) {
            switch (err.status) {
              case 401:
                this.showMessage('Usuario no autorizado', 'Atención');
                this.responseValidation = [];
                break;
              case 500:
              case 504:
                this.showMessage('Patron no encontrado.', 'Atención');
                this.responseValidation = [];
                break;
            }
          } else {
            this.showMessage('Patron no encontrado. ' + err.message, 'Atención');
          }
        }, () => {
          this.spinner.hide();
          // window.scrollTo(0, 600);
        });




}

public cambiarNSS() {
  const control = this.formGroup.get('nss');
  if (control.touched && control.errors === null && control.status === 'VALID') {
    this.buscarAsegurado();
  }
}

public cambiarRP() {
  this.disableSublime = true;
  const control = this.formGroup.get('registroPatronal');
  if (control.touched && control.errors === null && control.status === 'VALID') {
    this.buscarPatron();
  }
  this.disableSublime = false;
}

public disableSublimeButon(){
  this.disableSublime = true;
}

public cargueArchivo(event: any){
  if(event !== undefined){
    this.file = event.target.files[0];

    if(!this.validaTipoExtencion(this.file.name)){
      this.showMessage('El archivo adjunto no cumple con el formato establecido. Favor de verificar e intentar nuevamente.', 'Informacion de solicitud');
      event.target.value = null;
      this.file = null;    
      this.disableSublime = true;      
    }else{
      this.disableSublime = false;

      var sizeArchivo = Number(this.file.size);
      var megaArchivo = sizeArchivo / 1024;
      if(megaArchivo > 1024){
        this.showMessage('El archivo adjunto no cumple con el formato establecido. Favor de verificar e intentar nuevamente.', 'Informacion de solicitud');
        event.target.value = null;
        this.file = null;
        this.disableSublime = true;
      }else{
        this.disableSublime = false;
      }

    }

  }
}

public upload(origenAlta: string, nss: string, cveOrigenArchivo: string){
  
  if(this.file){
    
    const formData = new FormData();
    formData.append('file', this.file);

    this.spinner.show();
    this.reporteService.uploadFile(formData, origenAlta, nss, cveOrigenArchivo)
      .subscribe((response: any) => {
        this.spinner.hide();
        switch (response.status){
          case 200:
            if(response!== undefined){
              this.showMessageV4('La actualización se realizó correctamente.', 'Atención');
              this.spinner.hide();
            }
          case 206:
            if(response!== undefined){
              this.showMessageV4('La actualización se realizó correctamente.', 'Atención');
              this.spinner.hide();
            }
        }
      }, err => {
          this.showMessage('Problemas con el servicio ' + err.message, 'Atención');
          this.spinner.hide();
        }, () => {
          window.scrollTo(0, 600);
          this.spinner.hide();
        });

  }else{
    this.showMessageV4('La actualización se realizó correctamente.', 'Atención');
    this.spinner.hide();

  }
}

public getTipoDictamen(){
  if(this.validaDictamen()){
    return this.info.incapacidadDTO.bitacoraDictamen.filter(bitacoraDictamen => bitacoraDictamen.activo)?.[0]?.tipoDictamen;
  }
  return '';
}

public getNumFolio(){
  if(this.validaDictamen()){
    return this.info.incapacidadDTO.bitacoraDictamen.filter(bitacoraDictamen => bitacoraDictamen.activo)?.[0]?.numFolio;
  }
  return '';
}

public getNomArchivo(){
  if(this.validaDictamen()){
    return this.info.incapacidadDTO.bitacoraDictamen.filter(bitacoraDictamen => bitacoraDictamen.activo)?.[0]?.nomArchivo;
  }
  return '';
}

public changeTipoDictamen(){
  this.file = undefined;
  this.showDictamen = this.getShowAdjuntarDictamen();
  if(this.showDictamen){
    this.mostrarCamposDictamen();
    this.formGroup.controls['numFolio'].setValidators([Validators.required]);
    this.formGroup.controls['numFolio'].updateValueAndValidity();

    this.formGroup.controls['tipoDictamen'].setValidators([Validators.required]);
    this.formGroup.controls['tipoDictamen'].updateValueAndValidity();

    this.formGroup.controls['adjDictamen'].setValidators([Validators.required]);
    this.formGroup.controls['adjDictamen'].updateValueAndValidity();
  } else{
    this.ocultarCamposDictamen();
    this.formGroup.controls['numFolio'].setValidators([]);
    this.formGroup.controls['numFolio'].updateValueAndValidity();

    this.formGroup.controls['tipoDictamen'].setValidators([]);
    this.formGroup.controls['tipoDictamen'].updateValueAndValidity();
    
    this.formGroup.controls['adjDictamen'].setValidators([]);
    this.formGroup.controls['adjDictamen'].updateValueAndValidity();
  }
  
  this.formGroup.updateValueAndValidity({onlySelf: true});

}

public getShowAdjuntarDictamen(){
  if(this.formGroup.get('tipoDictamen').value === -1){
    return false;
  }

  if(this.formGroup.get('tipoDictamen').value === '-1'){
    return false;
  }
  
  var porcentInc = this.formGroup.get('porcentajeIncapacidad').value;
  if(porcentInc !== ''){
    var porcentajeInc = parseInt(porcentInc);
    if(porcentajeInc > 0){
      return true;
    }
  }

  if(this.formGroup.get('consecuencia').value === '4'){
    return true;
  }

  return false;
}

 public mostrarCamposDictamen(){
  $('#divShowDictamen').show();
 }

 public ocultarCamposDictamen(){
  $('#divShowDictamen').hide();
 }

 public validaDictamen(){
  if(this.info.incapacidadDTO?.bitacoraDictamen === null || this.info.incapacidadDTO?.bitacoraDictamen === undefined){
    return false;
  }

  if(this.info.incapacidadDTO?.bitacoraDictamen[0] === null && this.info.incapacidadDTO?.bitacoraDictamen[0] === undefined){
    return false; 
  }

  var name = this.info.incapacidadDTO.bitacoraDictamen.filter(bitacoraDictamen => bitacoraDictamen.activo)?.[0]?.nomArchivo;
  if(name === null || name === undefined){
    return false;
  }

  return true;
}

public validaTipoExtencion(name: any){
  if(name.endsWith('png')){
    return true;
  }

  if(name.endsWith('jpg')){
    return true;
  }

  if(name.endsWith('pdf')){
    return true;
  }

  return false;
}

public viewBtnDictamen(){
  this.showBtnDictamen = this.validaBtnDictamen();
}

public validaBtnDictamen(){
  if(this.info?.cveOrigenArchivo === null && this.info?.cveOrigenArchivo === undefined){
    return false;
  }

  if(this.info?.aseguradoDTO?.refFolioOriginal === undefined && this.info?.aseguradoDTO?.refFolioOriginal === null){
    return false;
  }

  if(this.info.cveOrigenArchivo !== 'ST3'){
    return false;
  }

  let refFolio = this.info.aseguradoDTO.refFolioOriginal;
  if(refFolio.length != 17){
    return false;
  }
  
  if(!Number(refFolio)){
    return false;
  }

  return true;
}

public dictamen(){
  this.spinner.show();
  let req = new RequestConsultDictamenSist();
  req.numNss = this.info?.aseguradoDTO?.numNss;
  req.refFolioOriginal = this.info?.aseguradoDTO?.refFolioOriginal;
  req.objectIdOrigen = this.info.objectIdOrigen;
  this.reporteService.downloadDictamenST3(req
  ).subscribe((response: any) => {
    if (response == null || response.status === 204 || response.status === 500) {
      this.showMessage(response.message, "Falla al obtener archivo");
      return;
    }

    if(response.body.codigo === 0){
      var archivoBase = response.body.dictamen;
      this.pdfContent = URL.createObjectURL(this.b64toBlob2(archivoBase, 'application/pdf'));
      this.pdfviewSIST.nativeElement.setAttribute('data', this.pdfContent); 
      this.ditamenNameSIST = response.body.nameArchivo;
      this.showModalDictamenSIST();
    }else{
      this.showMessage(response.body.mensaje, "Falla al obtener archivo");
    }
    this.spinner.hide();
  }, error => {
    this.spinner.hide();
    this.showMessage(error.error.message, 'Atención');
  });
}

public b64toBlob2(b64Data, contentType) {
  this.blob = null;
  var byteCharacters = atob(b64Data);

  var byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    var slice = byteCharacters.slice(offset, offset + 512),
      byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }
  this.blob = new Blob(byteArrays, {type: contentType });
  return this.blob;
}

public showModalDictamen(){
  this.titDialogo = 'Dictamen';
  $('#modalFiles').modal('show');
}

public closeModal() {
  $('#modalFiles').modal('hide');
}

public showModalDictamenSIST(){
  this.titDialogo = 'Dictamen';
  $('#modalFilesSIST').modal('show');
}

public closeModalSIST() {
  $('#modalFilesSIST').modal('hide');
}

public imprimir(){
  const blobUrl = window.URL.createObjectURL((this.blob));
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = blobUrl;
  document.body.appendChild(iframe);
  iframe.contentWindow.print();
}

public downloadDictamen(){
  var elementA = document.createElement('a');
  elementA.href = URL.createObjectURL(this.blob);
  elementA.download = this.ditamenName;
  elementA.click(); 
}

public imprimirSIST(){
  const blobUrl = window.URL.createObjectURL((this.blob));
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = blobUrl;
  document.body.appendChild(iframe);
  iframe.contentWindow.print();
}

public downloadDictamenSIST(){
  var elementA = document.createElement('a');
  elementA.href = URL.createObjectURL(this.blob);
  elementA.download = this.ditamenNameSIST;
  elementA.click(); 
}

public getAccionRegistro(){
  var accionReg = this.info?.auditorias?.filter(auditoria => !auditoria.fecBaja)?.[0]?.desAccionRegistro;
  if(accionReg === null || accionReg === undefined){
   return '';
  }

  return accionReg;
}

public getSituacionRegistro(){
 var situacionReg = this.info?.auditorias?.filter(auditoria => !auditoria.fecBaja)?.[0]?.desSituacionRegistro;
 if(situacionReg === null || situacionReg === undefined){
   return '';
 }

 return situacionReg;
}

public getUsuarioModificador(){
 var usuarioModificador = this.info?.auditorias?.filter(auditoria => !auditoria.fecBaja)?.[0]?.nomUsuario;
 if(usuarioModificador === null || usuarioModificador === undefined){
   return '';
 }

 return usuarioModificador;
}

public getEstadoResgistro(){
 var estadoReg = this.info?.aseguradoDTO?.desEstadoRegistro;
 if(estadoReg === null || estadoReg === undefined){
   return '';
 }
 return estadoReg;
}

}
