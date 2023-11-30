import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DetalleConsultaApproveModificationDTO } from 'src/app/casuistica/models/control-figures/detalleConsultaApproveModificationDTO';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ValidateSelect } from 'src/app/common/validators/common.validator';
import { RecordsDetailInfo } from 'src/app/casuistica/models/records-detail/recordsDetailInfo';
import { Delegacion } from 'src/app/common/models/delegation.model';
import { SubDelegacion } from 'src/app/common/models/subdelegation.model';
import { Umf } from 'src/app/common/models/umf.model';
import { DelegationService } from 'src/app/common/services/catalogs/delegation.service';
import { SubDelegationService } from 'src/app/common/services/catalogs/sub-delegation.service';
import { Login } from 'src/app/common/models/security/login';
import { UmfService } from 'src/app/common/services/catalogs/umf.service';
import { Catalogs } from 'src/app/common/models/catalogs.model';
import { GetCatalogs } from 'src/app/common/models/getcatalogs.model';
import { CatalogsService } from 'src/app/common/services/catalogs/catalogs.service';
import { ResponseValidation } from 'src/app/casuistica/models/validation/responseValidation';
import { ResponseSusValidacion } from 'src/app/casuistica/models/validation/responseSusValidacion';

import { ValidationForm } from 'src/app/casuistica/models/validation/validationForm';
import { DetalleRegistroDTO } from 'src/app/casuistica/models/validation/detalleRegistroDTO';
import { IncapacidadDTO } from 'src/app/casuistica/models/incapacidadDTO';
import { AseguradosService } from 'src/app/casuistica/services/bdtu/asegurados.service';
import { ResponseWhareHouseValidation } from 'src/app/casuistica/models/validation/responseWharehouseValidation';
import { AlmacenesBuscarPatronService } from 'src/app/casuistica/services/validation/buscar-patron-almacenes.service';
import { PatronesService } from 'src/app/casuistica/services/bdtu/patrones.service';
import { DuplicateAltaValidationService } from 'src/app/casuistica/services/validation/duplicate-alta-validation.service';
import { SuceptibleValidationService } from 'src/app/casuistica/services/validation/suceptible-validation.service';

import { Auditorias } from 'src/app/casuistica/models/auditorias';
import { SaveNewMovementService } from 'src/app/casuistica/services/saveMovement/save-new-movement.service';
import { LocalAltaValidationService } from 'src/app/casuistica/services/validation/local-alta-validation.service';
import { WharehouseValidationService } from 'src/app/casuistica/services/validation/wharehouse-validation.service';
import { debounceTime, distinctUntilChanged, map, filter, timeout, delay, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { validateRhImss } from 'src/app/common/functions/origenAlta.utils';
import { getCycleYearValidity } from 'src/app/common/utils/date-picker.util';
import { AseguradoMarcaAfiliatoria } from 'src/app/casuistica/models/asegurado-marca-afiliatoria';
import { AseguradoMarcaAfiliatoriaService } from 'src/app/casuistica/services/asegurado-marca-afiliatoria.service';
import { BitacoraDictamenDTO } from 'src/app/casuistica/models/BitacoraDictamenDTO';
import { ReporteService } from 'src/app/common/services/reportes/reporte.service';
import { parse } from 'querystring';

// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-create-casuistry-ui',
  templateUrl: './create-casuistry-ui.component.html',
  styleUrls: ['./create-casuistry-ui.component.scss']
})

export class CreateCasuistryUiComponent implements OnInit, AfterViewInit {
  public detalleConsultaApproveModi: DetalleConsultaApproveModificationDTO;
  public formGroup: FormGroup;
  public titDialogo: string;
  public messDialogo: string;
  public titulo = 'Realizar movimientos / Alta de casuística  ';
  public info: RecordsDetailInfo = new RecordsDetailInfo();
  public user: Login = new Login();
  public formToMemory: any;
  public catalogoInput: GetCatalogs = new GetCatalogs();
  public catalogoInput2: GetCatalogs = new GetCatalogs();
  public catalogoInput3: GetCatalogs = new GetCatalogs();
  // ****** CATALOGOS DETALLE DEL RIESGO DE TRABAJO   **************/
  public catalogoInput4: GetCatalogs = new GetCatalogs();
  public catalogoInput5: GetCatalogs = new GetCatalogs();
  public catalogoInput6: GetCatalogs = new GetCatalogs();
  public catalogoInput7: GetCatalogs = new GetCatalogs();
  public catalogoInput8: GetCatalogs = new GetCatalogs();
  public catalogoInput9: GetCatalogs = new GetCatalogs();
  public codigoDiag: Catalogs[] = [];
  public causaExternaList: Catalogs[] = [];
  public naturalezaCat: Catalogs[] = [];
  public riesgoFisicoCat: Catalogs[] = [];
  public actoInseguroCat: Catalogs[] = [];
  public ocupacionCat: Catalogs[] = [];

  public selectDelegacion: Delegacion[] = [];
  public selectSubDelegacion: SubDelegacion[] = [];
  public selectSubDelegacionCubetas: SubDelegacion[] = [];
  public selectSubDelegacionAtencion: SubDelegacion[] = [];
  public umfAdscripcion: Umf[] = [];
  public umfAdscripcionCubetas: Umf[] = [];
  public umfAtencion: Umf[] = [];
  public tiposRiesgo: Catalogs[] = [];
  public consecuencias: Catalogs[] = [];

  public laudos: Catalogs[] = [];
  public responseValidation: ResponseValidation[] = [];
  public responseSusValidacion: string[] = [];

  public mostrarSi: boolean;
  public mostrarSiFinal: boolean;
  public insertado: boolean;
  public responseSearch: ResponseWhareHouseValidation;
  public responseWharehouseValidation: ResponseWhareHouseValidation;
  public hizoMatch = '';
  public hizoMatchCausa = '';
  public model: Catalogs;
  public modelCausa: Catalogs;

  public formDetalleReg: DetalleRegistroDTO;

  public isLoadingDiagnosticCode = false;
  public isSelectionDiagnosticCode = false;
  public diagnosticCodeSelected: Catalogs;

  public isLoadingNaturaleza = false;
  public isSelectionNaturaleza = false;
  public naturalezaSelected: Catalogs;
  public existeRelacionLaboral = false;

  public isLoadingExternalCause = false;
  public isSelectionExternalCause = false;
  public externalCauseSelected: Catalogs;
  public pantalla: string = "nuevoSus";

  public disableSublime: boolean = false;
  public tipoModificacion: Catalogs[] = []; //Atencion req modificacion patronal
  public modificacion: "";

  public tipoDictamen: "-1";
  public numFolio: "";
  public adjDictamen: "";
  public showDictamen: boolean = false;

  public aseguradoMarcaAfiliatoria: AseguradoMarcaAfiliatoria;
  public nssConMarcaAfiliatoria = false;
  public sinAds = false;
  public file: any;

  public areCatalogsLoaded = [false, false, false, true, false, false, false, false];

  constructor(private formBuilder: FormBuilder,
    private findDelegation: DelegationService,
    private findSubDelegation: SubDelegationService,
    private findUmfService: UmfService,
    private findCatalogo: CatalogsService,
    private localValidationService: LocalAltaValidationService,
    private aseguradosService: AseguradosService,
    private almacenesBuscarPatronService: AlmacenesBuscarPatronService,
    private patronesService: PatronesService,
    private duplicateAltaValidationService: DuplicateAltaValidationService,
    private saveMovementService: SaveNewMovementService,
    private wharehouseValidationService: WharehouseValidationService,
    private spinner: NgxSpinnerService,
    private suceptibleValidationService: SuceptibleValidationService,
    private aseguradoMarcaAfiliatoriaService: AseguradoMarcaAfiliatoriaService,
    private reporteService: ReporteService) {
  }

  ngOnInit(): void {
    this.spinner.show();
    this.user = JSON.parse(localStorage.getItem('user'));
    this.formToMemory = JSON.parse(localStorage.getItem('form'));
    this.buildForm();
    const self = this;

  }

  public changeModificacion() {
    let control1 = null;
    control1 = this.formGroup.get('tipoModificacion');
    this.formGroup.get('modificacion').valueChanges
      .subscribe(value => {
        if (value === "true") {
          console.log(value);
          console.log(" SELECTED")
          control1.setValidators([Validators.compose([
            Validators.required,
            ValidateSelect
          ])])
          control1.updateValueAndValidity();
        } else {
          this.formGroup.get('tipoModificacion').setValue("-1");
          console.log("NOT SELECTED")
          control1.clearValidators();
          control1.updateValueAndValidity();
        }
      })
  }

  public changeTipoDictamen() {
    this.file = undefined;
    this.showDictamen = this.getShowAdjuntarDictamen();
  }

  public getShowAdjuntarDictamen() {
    if (this.formGroup.get('tipoDictamen').value === -1) {
      return false;
    }

    if (this.formGroup.get('tipoDictamen').value === '-1') {
      return false;
    }

    var porcentajeInc = parseInt(this.formGroup.get('porcentajeIncapacidad').value);
    if (porcentajeInc > 0) {
      return true;
    }

    if (this.formGroup.get('concecuencia').value === '4') {
      return true;
    }

    return false;
  }

  ngAfterViewInit() {
    this.chargeCalendar();
    this.setIdentificador();
    this.chargeDelegationAdscripcion();
    this.catalogosIncapacidad();
    this.obtenerRiesgoTrabajo();
  }

  private validateIfCatalogsAreLoaded() {
    if (this.areCatalogsLoaded.reduce((prev, current) => prev && current)) {
      this.spinner.hide();
    }
  }

  public chargeUmfAdscripcion(clave: string) {
    console.log('chargeUmfAdscripcion');
    const splitted = clave.split('@', 2);
    this.findUmfService.find(splitted[1]).subscribe(
      (data) => { // Success
        this.umfAdscripcion = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public chargeUmfAdscripcionCubetas(clave: string) {
    console.log('chargeUmfAdscripcion');
    const splitted = clave.split('@', 2);
    this.findUmfService.find(splitted[1]).subscribe(
      (data) => { // Success
        this.umfAdscripcionCubetas = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public chargeUmfAdscripcionAsegurado(clave: string) {
    console.log('chargeUmfAdscripcionAsegurado');
    const splitted = clave.split('@', 2);
    this.findUmfService.find(splitted[1]).subscribe(
      (data) => { // Success
        this.umfAdscripcion = data;
        this.formGroup.get('subdelegacionNss').setValue(clave);
        this.setUmfAsegurado();
      },
      (error) => {
        console.error(error);
      });
  }

  public setUmfAsegurado() {
    setTimeout(() => {
      this.formGroup.get('umfAdscripcion').setValue(this.info.aseguradoDTO.cveUmfAdscripcion);
    }, 0);
  }

  public chargeSubDelegationAdscripcion(clave: string) {
    console.log('chargeSubDelegationAdscripcion');
    this.findSubDelegation.find(clave).subscribe(
      (data) => { // Success
        this.selectSubDelegacion = data;
      },
      (error) => {
        console.error(error);
      }
    );

  }

  public chargeSubDelegationAdscripcionAsegurado(clave: string) {
    console.log('chargeSubDelegationAdscripcionAsegurado');
    this.findSubDelegation.find(clave).subscribe(
      (data) => { // Success
        this.selectSubDelegacion = data;
        let idSubdelegacion: string;
        let selectSubDelegacionUnitaria: SubDelegacion;
        for (selectSubDelegacionUnitaria of this.selectSubDelegacion) {
          if (selectSubDelegacionUnitaria.clave == Number(this.info.aseguradoDTO.cveSubdelNss)) {
            idSubdelegacion = selectSubDelegacionUnitaria.clave.toString() + '@' + selectSubDelegacionUnitaria.id.toString();
            break;
          }
        }
        this.chargeUmfAdscripcionAsegurado(idSubdelegacion);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public chargeSubDelegationAdscripcionAseguradoCubetas(clave: string) {
    console.log('chargeSubDelegationAdscripcionAsegurado');
    this.findSubDelegation.find(clave).subscribe(
      (data) => { // Success
        this.selectSubDelegacionCubetas = data;
        let idSubdelegacion: string;
        let selectSubDelegacionUnitaria: SubDelegacion;
        for (selectSubDelegacionUnitaria of this.selectSubDelegacionCubetas) {
          if (selectSubDelegacionUnitaria.clave == Number(this.info.aseguradoDTO.cveSubdelNss)) {
            idSubdelegacion = selectSubDelegacionUnitaria.clave.toString() + '@' + selectSubDelegacionUnitaria.id.toString();
            break;
          }
        }
        this.chargeUmfAdscripcionCubetas(idSubdelegacion);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public chargeDelegationAdscripcion() {
    console.log('chargeDelegationAdscripcion');
    this.findDelegation.find().subscribe(
      (data) => { // Success
        this.areCatalogsLoaded[4] = true;
        this.validateIfCatalogsAreLoaded();
        this.selectDelegacion = data;
      },
      (error) => {
        this.areCatalogsLoaded[4] = true;
        this.validateIfCatalogsAreLoaded();
        console.error(error);
      }
    );
  }

  public chargeUmfAtencion(clave: string) {
    console.log('chargeUmfAtencion');
    const splitted = clave.split('@', 2);
    this.findUmfService.find(splitted[1]).subscribe(
      (data) => { // Success
        this.umfAtencion = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public chargeSubDelegationAtencion(clave: string) {
    console.log('chargeSubDelegationAtencion');
    this.findSubDelegation.find(clave).subscribe(
      (data) => { // Success
        this.selectSubDelegacionAtencion = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public catalogosIncapacidad() {
    this.catalogoInput.nameCatalog = 'MccTipoRiesgo';
    console.log(this.catalogoInput);
    this.findCatalogo.find(this.catalogoInput).subscribe(
      (data) => { // Success
        this.areCatalogsLoaded[0] = true;
        this.validateIfCatalogsAreLoaded();
        console.log(' ........EL SUCCES  MccTipoRiesgo.. ');
        this.tiposRiesgo = data.body;
        this.tiposRiesgo = this.tiposRiesgo.sort((a, b) => {
          if (a.cveCatalogo > b.cveCatalogo) {
            return 1;
          }
          if (a.cveCatalogo < b.cveCatalogo) {
            return -1;
          }
          return 0;
        });
        console.log(this.tiposRiesgo);
      },
      (error) => {
        this.areCatalogsLoaded[0] = true;
        this.validateIfCatalogsAreLoaded();
        console.error(error);
      }
    );

    this.catalogoInput2.nameCatalog = 'MccConsecuencia';
    console.log(this.catalogoInput2);
    this.findCatalogo.find(this.catalogoInput2).pipe(
      map(response => ({
        ...response, body: response.body.sort((cat1, cat2) => Number(cat1.cveCatalogo) - Number(cat2.cveCatalogo))
      })),
    ).subscribe(
      (data) => { // Success
        this.areCatalogsLoaded[1] = true;
        this.validateIfCatalogsAreLoaded();
        this.consecuencias = data.body;
      },
      (error) => {
        this.areCatalogsLoaded[1] = true;
        this.validateIfCatalogsAreLoaded();
        console.error(error);
      }
    );

    this.catalogoInput3.nameCatalog = 'MccLaudo';
    console.log(this.catalogoInput3);
    this.findCatalogo.find(this.catalogoInput3).subscribe(
      (data) => { // Success
        this.areCatalogsLoaded[2] = true;
        this.validateIfCatalogsAreLoaded();
        this.laudos = data.body;
        this.laudos = this.laudos.sort((a, b) => {
          if (a.cveCatalogo > b.cveCatalogo) {
            return 1;
          }
          if (a.cveCatalogo < b.cveCatalogo) {
            return -1;
          }
          return 0;
        });
        console.log(this.laudos);
      },
      (error) => {
        this.areCatalogsLoaded[2] = true;
        this.validateIfCatalogsAreLoaded();
        console.error(error);
      }
    );

    this.catalogoInput4.nameCatalog = 'MccModificacionPatronal';
    console.log(this.catalogoInput4);
    this.findCatalogo.find(this.catalogoInput4).subscribe(
      (data) => { // Success
        this.areCatalogsLoaded[2] = true;
        this.validateIfCatalogsAreLoaded();
        this.tipoModificacion = data.body;
        this.tipoModificacion = this.tipoModificacion.sort((a, b) => {
          if (a.cveCatalogo > b.cveCatalogo) {
            return 1;
          }
          if (a.cveCatalogo < b.cveCatalogo) {
            return -1;
          }
          return 0;
        });
        console.log(this.tipoModificacion);
      },
      (error) => {
        this.areCatalogsLoaded[2] = true;
        this.validateIfCatalogsAreLoaded();
        console.error(error);
      }
    );
  }

  get formConsecuencia() { return this.formGroup.get('concecuencia') as FormControl; }
  get formDiasSubsidiados() { return this.formGroup.get('diasSubsidiados') as FormControl; }
  get formPorcentajeIncapacidad() { return this.formGroup.get('porcentajeIncapacidad') as FormControl; }
  get codigoDiagnosticoForm() { return this.formGroup.get('codigoDiagnostico') as FormControl; }
  get naturalezaForm() { return this.formGroup.get('naturaleza') as FormControl; }
  get externalCauseForm() { return this.formGroup.get('causaExterna') as FormControl; }
  get fechaProceso() { return this.formGroup.get('date') as FormControl; }
  get fechaAccidente() { return this.formGroup.get('date2') as FormControl; }
  get fechaInicio() { return this.formGroup.get('date3') as FormControl; }
  get fechaTermino() { return this.formGroup.get('date4') as FormControl; }
  get tipoDictamenForm() { return this.formGroup.get('tipoDictamen') as FormControl; }
  get numFolioForm() { return this.formGroup.get('numFolio') as FormControl; }
  get adjDictamenForm() { return this.formGroup.get('adjDictamen') as FormControl; }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      nss: ['', Validators.compose([
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
        Validators.pattern('[0-9]*')
      ])],
      curp: ['', Validators.compose([
        Validators.minLength(18),
        Validators.maxLength(18)
      ])],
      date: ['', Validators.compose([
        Validators.pattern('^([0-2]*[0-9]|3[0-1])(\\/|-)(0*[1-9]|1[0-2])\\2(\\d{4})$')
      ])],
      date2: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^([0-2]*[0-9]|3[0-1])(\\/|-)(0*[1-9]|1[0-2])\\2(\\d{4})$')
      ])],
      date3: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^([0-2]*[0-9]|3[0-1])(\\/|-)(0*[1-9]|1[0-2])\\2(\\d{4})$')
      ])],
      date4: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^([0-2]*[0-9]|3[0-1])(\\/|-)(0*[1-9]|1[0-2])\\2(\\d{4})$')
      ])],
      diasSubsidiados: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(3),
        Validators.pattern('[0-9]*')
      ])],
      tipoRiesgo: [-1, Validators.compose([
        Validators.required,
        ValidateSelect
      ])],
      delegacionNss: [-1, Validators.compose([

      ])],
      subdelegacionNss: [-1, Validators.compose([

      ])],
      umfAdscripcion: [-1, Validators.compose([


      ])],
      delegacionAtencionNss: [-1, Validators.compose([

      ])],
      porcentajeIncapacidad: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(3),
        Validators.pattern('[0-9]*')
      ])],
      concecuencia: [-1, Validators.compose([

      ])],
      subdelagacionAtencionNss: [-1, Validators.compose([])],
      laudos: [-1, Validators.compose([
        Validators.required,
        ValidateSelect
      ])],
      umfExpedicion: [-1, Validators.compose([])],
      registroPatronal: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(11),
        Validators.pattern('[A-Za-z0-9]*')
      ])],
      comentario: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(200),
        Validators.pattern('[A-Za-z0-9\\\s\\\u00f1\\\u00d1áéíóúÁÉÍÓÚàèìòùÀÈÌÒÙ\\\°\\\!\\\”#$%&\\\/\\\(\\\)=?¡*\\\¨\\\]\\\[\\\}\\\{\\\-,.:;\\\<\\\>\\\+]+$')
      ])],
      razonSocialPatron: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(250)
      ])],
      nombre: ['', Validators.compose([
        Validators.required,
      ])],

      primerApellido: ['', Validators.compose([
        Validators.required,
      ])],
      segundoApellido: ['', Validators.compose([

      ])],
      anioCiclo: ['', Validators.compose([
        Validators.minLength(4),
        Validators.maxLength(4),
        Validators.pattern('[0-9]*')
      ])],
      casoRegistro: ['', Validators.compose([

      ])],
      identificador: ['', Validators.compose([

      ])],

      codigoDiagnostico: ['', Validators.compose([

      ])],
      causaExterna: ['', Validators.compose([

      ])],
      naturaleza: ['', Validators.compose([

      ])],
      riesgoFisico: [-1, Validators.compose([

      ])],
      actoInseguro: [-1, Validators.compose([

      ])],
      ocupacion: [-1, Validators.compose([

      ])],
      fracion: ['', Validators.compose([

      ])],
      prima: ['', Validators.compose([

      ])],
      clase: ['', Validators.compose([

      ])],
      actividadEconomica: ['', Validators.compose([

      ])],
      delegacionRegistro: ['', Validators.compose([

      ])],
      subRegistro: ['', Validators.compose([

      ])],
      rfcPatronal: ['', Validators.compose([

      ])],
      medicoTratante: ['', Validators.compose([
        Validators.maxLength(9),
        Validators.pattern('[0-9]*')
      ])],
      medicoCDST: ['', Validators.compose([
        Validators.maxLength(9),
        Validators.pattern('[0-9]*')
      ])],
      tipoModificacion: [-1, Validators.compose([

      ])],

      modificacion: [-1, Validators.compose([
        Validators.maxLength(9),
        ValidateSelect
      ])],
      tipoDictamen: [-1, Validators.compose([
      ])],
      numFolio: ['', Validators.compose([
      ])],
      adjDictamen: ['', Validators.compose([
      ])],
    });
    this.handleConsecuenciaChange();
    this.handleCodigoDiagnosticoChanges();
    this.handleNaturalezaChanges();
    this.handleExternalCauseChanges();
    this.changeModificacion();
  }

  private handleConsecuenciaChange() {
    this.formConsecuencia.valueChanges.subscribe(value => {
      if (value === 0 || value === '0') {
        this.formDiasSubsidiados.setValue(0);
        this.formDiasSubsidiados.disable();
        this.formDiasSubsidiados.updateValueAndValidity();
        this.formPorcentajeIncapacidad.setValue(0);
        this.formPorcentajeIncapacidad.disable();
        this.formPorcentajeIncapacidad.updateValueAndValidity();
      } else if (value === 1 || value === '1') {
        this.formDiasSubsidiados.enable();
        this.formDiasSubsidiados.updateValueAndValidity();
        this.formPorcentajeIncapacidad.setValue(0);
        this.formPorcentajeIncapacidad.disable();
        this.formPorcentajeIncapacidad.updateValueAndValidity();
      } else if ((value > 1 || value !== '0' || value !== '1')
        && (this.formPorcentajeIncapacidad.disabled || this.formDiasSubsidiados.disabled)) {
        this.formDiasSubsidiados.enable();
        this.formDiasSubsidiados.updateValueAndValidity();
        this.formPorcentajeIncapacidad.enable();
        this.formPorcentajeIncapacidad.updateValueAndValidity();
      }
    });
  }

  public obtenerRiesgoTrabajo() {
    // ****************  RIESGO FISICO   *************************/
    this.catalogoInput7.nameCatalog = 'MccRiesgoFisico';
    console.log(this.catalogoInput7);
    this.findCatalogo.find(this.catalogoInput7).subscribe(
      (data) => { // Success
        this.areCatalogsLoaded[5] = true;
        this.validateIfCatalogsAreLoaded();
        //  console.log(" ........EL SUCCES DE RIESGO FISICO   "+JSON.stringify(data.body));
        this.riesgoFisicoCat = data.body;
        this.riesgoFisicoCat = this.riesgoFisicoCat.sort(this.sortFunc);
        //    console.log("....CATALOGO DE RIESGO FISICO ."+JSON.stringify(this.riesgoFisicoCat) );
      },
      (error) => {
        this.areCatalogsLoaded[5] = true;
        this.validateIfCatalogsAreLoaded();
        console.error('....ERROR' + error);
      }
    );

    // ****************   ACTO INSEGURO    *************************/

    this.catalogoInput8.nameCatalog = 'MccActoInseguro';
    console.log('..... EMPIEZA EL ACTO INSEGURO ....');
    this.findCatalogo.find(this.catalogoInput8).subscribe(
      (data) => { // Success
        this.areCatalogsLoaded[6] = true;
        this.validateIfCatalogsAreLoaded();

        this.actoInseguroCat = data.body;
        this.actoInseguroCat = this.actoInseguroCat.sort(this.sortFunc);
        //   console.log("....CATALOGO DE ACTO INSEGURO ."+JSON.stringify(this.actoInseguroCat) );
      },
      (error) => {
        this.areCatalogsLoaded[6] = true;
        this.validateIfCatalogsAreLoaded();
        console.error('....ERROR' + error);
      }
    );

    // ****************   OCUPACION SISAT     *************************/

    this.catalogoInput9.nameCatalog = 'MccOcupacionSisat';
    //  console.log("..... EMPIEZA EL ACTO INSEGURO ....");
    this.findCatalogo.find(this.catalogoInput9).subscribe(
      (data) => { // Success
        this.areCatalogsLoaded[7] = true;
        this.validateIfCatalogsAreLoaded();
        console.log(' ........EL SUCCES DE MccOcupacionSisat   ' + JSON.stringify(data.body));

        this.ocupacionCat = data.body;
        this.ocupacionCat = this.ocupacionCat.sort(this.sortFunc);

        this.ocupacionCat.forEach(ocupa => {

          ocupa.descCatalogo = this.quitarAcentos(ocupa.descCatalogo);
          return ocupa;
        });
        //   console.log("....CATALOGO DE ACTO INSEGURO ."+JSON.stringify(this.actoInseguroCat) );
      },
      (error) => {
        this.areCatalogsLoaded[7] = true;
        this.validateIfCatalogsAreLoaded();
        console.error('....ERROR' + error);
      }
    );
  }

  public quitarAcentos(cadena) {
    const acentos = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', Á: 'A', É: 'E', Í: 'I', Ó: 'O', Ú: 'U' };
    return cadena.split('').map(letra => acentos[letra] || letra).join('').toString();
  }

  public obtenerCasoRegistro() {
    try {
      const ftermino = this.formGroup.get('date4').value.split('/');
      $('#anioCiclo').val(ftermino[2]);
      const cycleYearValidity = getCycleYearValidity(this.formGroup.get('date4').value);

      if (cycleYearValidity) {
        $('#casoRegistro').val('Oportuno');
      } else {
        $('#casoRegistro').val('Extemporáneo');
      }

    } catch (Exception) {
      console.log(Exception);
    }
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

  public setIdentificador() {
    console.log('Identificador: MN');
    $('#identificador').val('MN');
  }

  public chargeCalendar() {
    // tslint:disable-next-line: max-line-length
    const meses = new Array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
    const self = this;
    let yMause = 0;

    $('#fechaAltaCasu').mousemove(function (event) {
      yMause = 0;
      yMause = event.pageY - this.offsetTop;
    });

    $('#fechaAltaCasu2').mousemove(function (event) {
      yMause = 0;
      yMause = event.pageY - this.offsetTop;
    });

    $('#fechaAltaCasu3').mousemove(function (event) {
      yMause = 0;
      yMause = event.pageY - this.offsetTop;
    });
    $('#fechaAltaCasu4').mousemove(function (event) {
      yMause = 0;
      yMause = event.pageY - this.offsetTop;
    });

    $('#fechaAltaCasu').datepicker({
      closeText: 'Cerrar',
      prevText: '<Ant',
      dateFormat: 'dd/mm/yy',
      nextText: 'Sig>',
      currentText: 'Hoy',
      monthNames: meses,
      monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      showButtonPanel: true,
      maxDate: new Date(),
      minDate: new Date(),

      onClose(dateText, inst) {
        console.log(' ==> CERRAR');
        self.formGroup.get('date').setValue($(this).val());
      },
      onSelect(dateText, inst) {
        // self.formGroup.get('date').setValue($(this).val());
      },
      beforeShow(input, inst) {
        setTimeout(function () {
          inst.dpDiv.css({ top: yMause + 50 });
        }, 50);
      },
    }).attr('readonly', 'readonly');

    $('#fechaAltaCasu').mousemove(function (event) {
      yMause = 0;
      yMause = event.pageY - this.offsetTop;
    });

    $('#fechaAltaCasu').on('change', function () {
      // self.formGroup.get('date').setValue($(this).val());
    });

    $('#fechaAltaCasu').datepicker('setDate', new Date());
    self.fechaProceso.setValue($('#fechaAltaCasu').val());

    /// *******************  FECHA 2  ************************/
    $('#fechaAltaCasu2').datepicker({
      closeText: 'Cerrar',
      prevText: '<Ant',
      dateFormat: 'dd/mm/yy',
      nextText: 'Sig>',
      currentText: 'Hoy',
      monthNames: meses,
      monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      showButtonPanel: true,
      changeMonth: true,
      changeYear: true,
      yearRange: new Date().getFullYear() - 30 + ':+0',
      onChangeMonthYear(input, inst) {
        setTimeout(function () {
          $('.ui-datepicker-header').css('width', '300px');
          $('.ui-datepicker-month').css('color', '#333');
        }, 0);
      },
      onClose(dateText, inst) {
        const fecProcesoString = self.fechaProceso.value.split("/");
        const fecAccidenteString = $(this).val().split("/");
        const fecAccidenteDate = new Date(`${fecAccidenteString[1]}/${fecAccidenteString[0]}/${fecAccidenteString[2]}`);
        const fecProcesoDate = new Date(`${fecProcesoString[1]}/${fecProcesoString[0]}/${fecProcesoString[2]}`);
        console.log(' ==> CERRAR date2 --> ', fecProcesoDate, fecAccidenteDate);
        if (fecAccidenteDate > fecProcesoDate) {
          console.log('Es mayor... agrega validacion');
          self.showMessage('La fecha de accidente no puede ser mayor a la fecha de proceso', 'Atención');
          self.fechaAccidente.setValue($('#fechaAltaCasu').val());
        }
        self.formGroup.get('date2').setValue($(this).val());
        $('#registroPatronalFuncion').click();
      },
      onSelect(dateText, inst) {
        console.log('seleccionar');
        // self.formGroup.get('date').setValue($(this).val());
      },
      beforeShow(input, inst) {
        setTimeout(function () {
          inst.dpDiv.css({ top: yMause + 50 });
          $('.ui-datepicker-header').css('width', '300px');
          $('.ui-datepicker-month').css('color', '#333');
        }, 50);
      },
    });

    $('#fechaAltaCasu2').mousemove(function (event) {
      yMause = 0;
      yMause = event.pageY - this.offsetTop;
    });

    $('#fechaAltaCasu2').on('change', function (event) {
      console.log('cambiar valor');
    });

    /// *******************  FECHA 3 ************************/
    $('#fechaAltaCasu3').datepicker({
      closeText: 'Cerrar',
      prevText: '<Ant',
      dateFormat: 'dd/mm/yy',
      nextText: 'Sig>',
      currentText: 'Hoy',
      monthNames: meses,
      monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      showButtonPanel: true,
      changeMonth: true,
      changeYear: true,
      yearRange: new Date().getFullYear() - 30 + ':+3',
      onChangeMonthYear(input, inst) {
        setTimeout(function () {
          $('.ui-datepicker-header').css('width', '300px');
          $('.ui-datepicker-month').css('color', '#333');
        }, 0);
      },

      onClose(dateText, inst) {
        console.log(' ==> CERRAR');
        if (self.fechaTermino.value) {
          const fecInicioString = $(this).val().split("/");
          const fecTerminoString = self.fechaTermino.value.split("/");
          const fecInicioDate = new Date(`${fecInicioString[1]}/${fecInicioString[0]}/${fecInicioString[2]}`);
          const fecTerminoDate = new Date(`${fecTerminoString[1]}/${fecTerminoString[0]}/${fecTerminoString[2]}`);
          if (fecInicioDate > fecTerminoDate) {
            console.log('Es menor... agrega validacion');
            self.showMessage('La fecha de inicio no puede ser mayor a la fecha de término', 'Atención');
            self.fechaInicio.setValue($('#fechaAltaCasu4').val());
          }
        }
        self.formGroup.get('date3').setValue($(this).val());
      },
      onSelect(dateText, inst) {
        // self.formGroup.get('date').setValue($(this).val());
      },
      beforeShow(input, inst) {
        setTimeout(function () {
          $('.ui-datepicker-header').css('width', '300px');
          $('.ui-datepicker-month').css('color', '#333');
          inst.dpDiv.css({ top: yMause + 50 });
        }, 50);
      },
    });

    $('#fechaAltaCasu3').mousemove(function (event) {
      yMause = 0;
      yMause = event.pageY - this.offsetTop;
    });

    $('#fechaAltaCasu3').on('change', function () {
      // self.formGroup.get('date').setValue($(this).val());
    });

    /// *******************  FECHA 4 ************************/
    $('#fechaAltaCasu4').datepicker({
      closeText: 'Cerrar',
      prevText: '<Ant',
      dateFormat: 'dd/mm/yy',
      nextText: 'Sig>',
      currentText: 'Hoy',
      monthNames: meses,
      monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      showButtonPanel: true,
      changeMonth: true,
      changeYear: true,
      yearRange: new Date().getFullYear() - 30 + ':+3',
      onChangeMonthYear(input, inst) {
        setTimeout(function () {
          $('.ui-datepicker-header').css('width', '300px');
          $('.ui-datepicker-month').css('color', '#333');
        }, 0);
      },

      onClose(dateText, inst) {
        console.log(' ==> CERRAR');
        if (self.fechaInicio.value) {
          const fecInicioString = self.fechaInicio.value.split("/");
          const fecTerminoString = $(this).val().split("/");
          const fecInicioDate = new Date(`${fecInicioString[1]}/${fecInicioString[0]}/${fecInicioString[2]}`);
          const fecTerminoDate = new Date(`${fecTerminoString[1]}/${fecTerminoString[0]}/${fecTerminoString[2]}`);
          if (fecTerminoDate < fecInicioDate) {
            console.log('Es menor... agrega validacion');
            self.showMessage('La fecha de término no puede ser menor a la fecha de inicio', 'Atención');
            self.fechaTermino.setValue($('#fechaAltaCasu3').val());
          }
        }
        //Validación de RN040 (62 días) -> Fecha fin
        if (self.fechaProceso.value) {
          const dias = 62;
          const fecProcesoString = self.fechaProceso.value.split("/");
          const fecFinString = $(this).val().split("/");
          const fecProcesoDate = new Date(`${fecProcesoString[1]}/${fecProcesoString[0]}/${fecProcesoString[2]}`);
          const fecFinDate = new Date(`${fecFinString[1]}/${fecFinString[0]}/${fecFinString[2]}`);
          const validaDias = fecProcesoDate;
          validaDias.setDate(fecProcesoDate.getDate() + dias);
          console.log("Suma de 62 dias => ", validaDias);
          if (fecFinDate > validaDias) {
            console.log("Supera 62 dias... manda msg de validación");
            self.showMessage('La fecha de término debe ser menor o igual a la suma de 62 días naturales a la fecha de proceso.', 'Atención');
            self.fechaTermino.setValue(validaDias.toLocaleDateString());
          }
        }
        self.formGroup.get('date4').setValue($(this).val());
        self.obtenerCasoRegistro();
      },
      onSelect(dateText, inst) {
        // self.formGroup.get('date').setValue($(this).val());
      },
      beforeShow(input, inst) {
        setTimeout(function () {
          $('.ui-datepicker-header').css('width', '300px');
          $('.ui-datepicker-month').css('color', '#333');
          inst.dpDiv.css({ top: yMause + 50 });
        }, 50);
      },
    });

    $('#fechaAltaCasu4').mousemove(function (event) {
      yMause = 0;
      yMause = event.pageY - this.offsetTop;
    });

    $('#fechaAltaCasu4').on('change', function () {
      // self.formGroup.get('date').setValue($(this).val());
    });
  }

  guardarCambios() {
    $('#btnGuardar').attr('disabled', true);
    this.formGroup.markAllAsTouched();
    if (!this.sinAds && !this.formGroup.valid) {
      this.mostrarSi = false;
      this.showMessage('Ingresar datos requeridos.', 'Atención');
      $('#btnGuardar').attr('disabled', false);
    } else {
      this.showMessage('¿Esta seguro que desea modificar la información?', 'Atención');
      this.mostrarSi = true;
    }
  }

  public showMessage(message: string, title: string) {
    console.log('showmessa');
    this.titDialogo = title;
    this.messDialogo = message;
    $('#dialogMessage').modal({ backdrop: 'static', keyboard: false });
  }

  public guardarMovimientos(toForm: DetalleRegistroDTO) {
    // Validacion de duplicados
    const response: ResponseValidation[] = [];
    this.spinner.show();
    console.log('form guardar:' + toForm);
    this.mostrarSiFinal = true;
    this.saveMovementService.insertar(toForm).subscribe(
      (response: any) => {
        switch (response.status) {
          case 200:
          case 206:
            this.formDetalleReg = response.body;
            if (this.formDetalleReg !== null && this.formDetalleReg.objectIdOrigen !== null &&
              this.formDetalleReg.objectIdOrigen.length > 0) {
              this.upload(this.formDetalleReg.objectIdOrigen, this.formDetalleReg.aseguradoDTO.numNss,
                this.formDetalleReg.cveOrigenArchivo);
              this.limpiar();
              this.mostrarSi = false;
              this.showMessage('Se generó alta correctamente.', 'Atención');
              this.spinner.hide();

            } else if (response !== null && response.length > 0) {
              this.responseValidation = this.responseValidation.concat(response);
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
        if (err.status !== null) {
          switch (err.status) {
            case 200:
            case 206:
              // this.mostrarSi = true;
              this.insertado = true;
              const responseValidation5: ResponseValidation[] = [];
              const tmp3 = new ResponseValidation();
              tmp3.desCodigoError = err.error.text;
              responseValidation5[0] = tmp3;
              this.responseValidation = this.responseValidation.concat(responseValidation5);
              this.mostrarSi = false;
              this.showMessage('Guardado exitoso.', 'Atención');
              break;
            case 400:
              const responseValidation4: ResponseValidation[] = [];
              const tmp2 = new ResponseValidation();
              tmp2.desCodigoError = err.error.message;
              responseValidation4[0] = tmp2;
              this.responseValidation = this.responseValidation.concat(responseValidation4);
              this.mostrarSi = false;
              this.showMessage('Guardado exitoso.', 'Atención');
              break;
            case 401:
              const responseValidation2: ResponseValidation[] = [];
              const tmp = new ResponseValidation();
              tmp.desCodigoError = 'Usuario no autorizado para guardar movimiento';
              responseValidation2[0] = tmp;
              this.responseValidation = this.responseValidation.concat(responseValidation2);
              this.mostrarSi = false;
              this.showMessage(tmp.desCodigoError, 'Atención');
              break;
            case 500:
            case 504:
              const responseValidation3: ResponseValidation[] = [];
              const tmp1 = new ResponseValidation();
              tmp1.desCodigoError = 'Servicio de inserción de movimientos no disponible.';
              responseValidation3[0] = tmp1;
              this.responseValidation = this.responseValidation.concat(responseValidation3);
              this.mostrarSi = false;
              this.showMessage(tmp1.desCodigoError, 'Atención');
              break;
          }
        } else {
          this.showMessage('Problemas con el servicio ' + err.message, 'Atención');
        }
      }, () => {
        this.spinner.hide();
      });
  }

  public showMessageV2(message: string, title: string) {
    console.log('showmessa');
    this.titDialogo = title;
    this.messDialogo = message;
    $('#dialogMessageV2').modal('show');
  }

  public validarDuplicados(toForm: DetalleRegistroDTO) {
    // Validacion de duplicados
    let responseDuplicate: ResponseValidation[] = [];
    this.spinner.show();
    toForm.aseguradoDTO.cveDelegacionAtencion = this.formGroup.get('delegacionAtencionNss').value;
    // tslint:disable-next-line: max-line-length
    if (this.formGroup.get('subdelagacionAtencionNss').value !== undefined && this.formGroup.get('subdelagacionAtencionNss').value !== null
      && this.formGroup.get('subdelagacionAtencionNss').value !== -1) {
      toForm.aseguradoDTO.cveSubDelAtencion = (this.formGroup.get('subdelagacionAtencionNss').value).split('@', 2)[0];
    }

    toForm.aseguradoDTO.cveUmfExp = this.formGroup.get('umfExpedicion').value == '' ? null : this.formGroup.get('umfExpedicion').value;
    console.log('form almacenes:' + toForm);
    this.duplicateAltaValidationService.validate(toForm).subscribe(
      (response: any) => {
        switch (response.status) {
          case 200:
          case 206:
            responseDuplicate = response.body;
            if (responseDuplicate === null || responseDuplicate.length === 0) {
              const formDup: DetalleRegistroDTO = new DetalleRegistroDTO();
              this.info.aseguradoDTO.desCasoRegistro = $('#casoRegistro').val();
              this.info.aseguradoDTO.numCicloAnual = $('#anioCiclo').val();
              this.info.aseguradoDTO.cveDelegacionNss = (this.formGroup.get('delegacionNss').value != null && this.formGroup.get('delegacionNss').value != -1) ?
                this.formGroup.get('delegacionNss').value : this.info.aseguradoDTO.cveDelegacionNss;
              this.info.aseguradoDTO.cveSubdelNss = (this.formGroup.get('subdelegacionNss').value != null && this.formGroup.get('subdelegacionNss').value != -1) ?
                this.formGroup.get('subdelegacionNss').value.split('@', 2)[0] : this.info.aseguradoDTO.cveSubdelNss;
              // tslint:disable-next-line: max-line-length
              if (this.formGroup.get('subdelegacionNss').value !== undefined && this.formGroup.get('subdelegacionNss').value !== null
                && this.formGroup.get('subdelegacionNss').value !== -1) {
                toForm.aseguradoDTO.cveSubDelAtencion = (this.formGroup.get('subdelegacionNss').value).split('@', 2)[0];
              }
              this.info.aseguradoDTO.cveUmfAdscripcion = (this.formGroup.get('umfAdscripcion').value != null && this.formGroup.get('umfAdscripcion').value != -1) ?
                this.formGroup.get('umfAdscripcion').value : this.info.aseguradoDTO.cveUmfAdscripcion;
              this.info.aseguradoDTO.cveDelegacionAtencion = this.formGroup.get('delegacionAtencionNss').value;
              // tslint:disable-next-line: max-line-length
              if (this.formGroup.get('subdelagacionAtencionNss').value !== undefined && this.formGroup.get('subdelagacionAtencionNss').value !== null
                && this.formGroup.get('subdelagacionAtencionNss').value !== -1) {
                toForm.aseguradoDTO.cveSubDelAtencion = (this.formGroup.get('subdelagacionAtencionNss').value).split('@', 2)[0];
              }
              this.info.aseguradoDTO.cveUmfExp = this.formGroup.get('umfExpedicion').value;
              for (const delegacionNssUnitaria of this.selectDelegacion) {
                if (Number(delegacionNssUnitaria.clave) === Number(this.info.aseguradoDTO.cveDelegacionNss)) {
                  this.info.aseguradoDTO.desDelegacionNss = delegacionNssUnitaria.descripcion;
                  break;
                }
              }
              let selectSubDelegacionAux: SubDelegacion[] = [];
              if (this.selectSubDelegacion && this.selectSubDelegacion.length > 0) {
                selectSubDelegacionAux = this.selectSubDelegacion;
              }
              else {
                selectSubDelegacionAux = this.selectSubDelegacionCubetas;
              }
              for (const subdelegacionNssUnitaria of selectSubDelegacionAux) {
                if (Number(subdelegacionNssUnitaria.clave) === Number(this.info.aseguradoDTO.cveSubdelNss)) {
                  this.info.aseguradoDTO.desSubDelNss = subdelegacionNssUnitaria.descripcion;
                  break;
                }
              }
              let umfAdscripcionAux: Umf[] = [];
              if (this.umfAdscripcion && this.umfAdscripcion.length > 0) {
                umfAdscripcionAux = this.umfAdscripcion;
              }
              else {
                umfAdscripcionAux = this.umfAdscripcionCubetas;
              }
              for (const umfNssUnitaria of umfAdscripcionAux) {
                if (Number(umfNssUnitaria.noEconomico) === Number(this.info.aseguradoDTO.cveUmfAdscripcion)) {
                  this.info.aseguradoDTO.desUmfAdscripcion = umfNssUnitaria.descripcion;
                  break;
                }
              }
              for (const delegacionNssUnitaria of this.selectDelegacion) {
                if (Number(delegacionNssUnitaria.clave) === Number(this.info.aseguradoDTO.cveDelegacionAtencion)) {
                  this.info.aseguradoDTO.desDelegacionAtencion = delegacionNssUnitaria.descripcion;
                  break;
                }
              }
              for (const subdelegacionNssUnitaria of this.selectSubDelegacionAtencion) {
                if (Number(subdelegacionNssUnitaria.clave) === Number(this.info.aseguradoDTO.cveSubDelAtencion)) {
                  this.info.aseguradoDTO.desSubDelAtencion = subdelegacionNssUnitaria.descripcion;
                  break;
                }
              }
              for (const umfNssUnitaria of this.umfAtencion) {
                if (Number(umfNssUnitaria.noEconomico) === Number(this.info.aseguradoDTO.cveUmfExp)) {
                  this.info.aseguradoDTO.desUmfExp = umfNssUnitaria.descripcion;
                  break;
                }
              }
              formDup.aseguradoDTO = this.info.aseguradoDTO;
              formDup.patronDTO = this.info.patronDTO;
              formDup.incapacidadDTO = this.info.incapacidadDTO;
              const auditoriaDTO: Auditorias = new Auditorias();
              auditoriaDTO.desObservacionesSol = this.formGroup.get('comentario').value;
              auditoriaDTO.desCambio = this.formGroup.get('comentario').value;
              auditoriaDTO.desAccionRegistro = 'Alta pendiente';
              auditoriaDTO.cveIdAccionRegistro = 4;
              auditoriaDTO.nomUsuario = this.user.userInfo.uid;
              formDup.auditorias = [auditoriaDTO];
              formDup.fecProcesoCarga = this.info.fecProcesoCarga;
              formDup.cveOrigenArchivo = $('#identificador').val();

              const t = this.user.userInfo.imssperfiles.split(',');
              const perfil1: string[] = ['TITULAR DE LA OFICINA DE EJERCICIO PRESUPUESTAL Y OBLIGACIONES (OEPO),',
                'TITULAR DE LA DIVISION DE RELACIONES LABORALES', 'JEFE DE AREA DE OBLIGACIONES LABORALES'];
              let result = false;
              t.forEach(function (item) {
                const perfiles = perfil1.filter(perfil => perfil === item);
                if (perfiles.length > 0) {
                  result = true;
                }
              });
              if (result) {
                formDup.origenAlta = 'EP'; // RH IMSS
              } else {
                formDup.origenAlta = 'CE'; // Alta Normal con JOCE	y ECE
              }
              console.log('GUARDANDO -->' + JSON.stringify(formDup));
              this.guardarAlta(formDup);
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
        if (err.status !== null) {
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
          this.mostrarSi = false;
          this.showMessage('Problemas con el servicio ' + err.message, 'Atención');
        }
      }, () => {
        // this.spinner.hide();
        // window.scrollTo(0, 600);
      });
  }

  public siGuardar() {
    this.hideMessage('dialogMessage');
    this.guardar();
  }

  public hideMessage(modal: string) {
    $('#' + modal).modal('hide');
    $('#btnGuardar').attr('disabled', false);
  }

  public obtenerFecha(fechas: string[]): Date {
    const fecha: Date = new Date(fechas[2] + "-" + fechas[1] + "-" + fechas[0]);
    return fecha;
  }

  private formatDateToISOInit(): Date {
    return new Date(`${new Date().toLocaleDateString().split('/').reverse().join()
      .replace(',', '-').replace(',', '-')}T07:00:00.000Z`);
  }

  public guardar() {
    const ffacc = this.formGroup.get('date2').value.split('/');
    const ffIni = this.formGroup.get('date3').value.split('/');
    const ffalta = this.formGroup.get('date4').value.split('/');
    const toForm: ValidationForm = new ValidationForm();
    this.info.fecProcesoCarga = this.formatDateToISOInit();
    toForm.nss = this.formGroup.get('nss').value;
    toForm.curp = this.formGroup.get('curp').value;
    toForm.nombre = this.formGroup.get('nombre').value;
    toForm.primerApellido = this.formGroup.get('primerApellido').value;
    toForm.segundoApellido = this.formGroup.get('segundoApellido').value;
    toForm.fechaAccidente = this.formGroup.get('date2').value;
    toForm.fechaInicio = this.formGroup.get('date3').value;
    toForm.fechaAlta = this.formGroup.get('date4').value;
    toForm.fechaFin = this.formGroup.get('date4').value;
    toForm.tipoRiesgo = this.formGroup.get('tipoRiesgo').value;
    toForm.laudo = this.formGroup.get('laudos').value;
    toForm.consecuencia = this.formGroup.get('concecuencia').value;
    toForm.diasSubsidiados = this.formGroup.get('diasSubsidiados').value;
    toForm.procentaje = this.formGroup.get('porcentajeIncapacidad').value;
    toForm.fecProcesoCarga = this.formatDateToISOInit();
    toForm.rp = this.formGroup.get('registroPatronal').value;
    toForm.rp = this.formGroup.get('razonSocialPatron').value;
    toForm.matMedTratante = this.formGroup.get('medicoTratante').value;
    toForm.matMedCDTS = this.formGroup.get('medicoCDST').value;
    toForm.tipoModificacion = this.formGroup.get('tipoModificacion').value;
    toForm.modificacion = this.formGroup.get('modificacion').value;

    this.spinner.show();
    console.log(toForm);
    this.localValidationService.validate(toForm).subscribe(
      (response: any) => {
        switch (response.status) {
          case 200:
          case 206:
            console.log('_----MARCA 0 ________');
            this.responseValidation = response.body;
            if (this.responseValidation.length === 0) {
              const formDup: DetalleRegistroDTO = new DetalleRegistroDTO();
              const formIncapacidad: IncapacidadDTO = new IncapacidadDTO();
              formDup.aseguradoDTO = this.info.aseguradoDTO;
              if (this.sinAds) {
                formDup.aseguradoDTO.sinUMF = true;
              } else {
                formDup.aseguradoDTO.sinUMF = false;
              }

              formDup.aseguradoDTO.marcaAfiliatoria = this.nssConMarcaAfiliatoria;

              console.log('____ GUARDAMOS OCUPACION  ________');
              formDup.aseguradoDTO.cveOcupacion = this.formGroup.get('ocupacion').value;
              // *********************** GUARDMOS LA DESCRIPCION DE LA OCUPACION *********************/

              if (this.formGroup.get('ocupacion').value !== undefined && this.formGroup.get('ocupacion').value != -1) {

                const ocupacionAArray = this.ocupacionCat.find(item => item.cveCatalogo === this.formGroup.get('ocupacion').value);

                if (ocupacionAArray !== undefined) {
                  formDup.aseguradoDTO.desOcupacion = ocupacionAArray.descCatalogo;
                } else {
                  formDup.aseguradoDTO.desOcupacion = "";
                }

              }
              console.log('______ LA DESCRIPCION DE OCUPACION____ ' + formDup.aseguradoDTO.desOcupacion);
              formDup.patronDTO = this.info.patronDTO;
              formIncapacidad.fecAccidente = this.obtenerFecha(ffacc);
              formIncapacidad.fecInicio = this.obtenerFecha(ffIni);
              formIncapacidad.fecAlta = this.obtenerFecha(ffalta);
              formIncapacidad.fecAltaIncapacidad = this.obtenerFecha(ffalta);
              formIncapacidad.fecFin = this.obtenerFecha(ffalta);
              formIncapacidad.numDiasSubsidiados = toForm.diasSubsidiados;
              formIncapacidad.porPorcentajeIncapacidad = toForm.procentaje;
              formIncapacidad.cveTipoRiesgo = toForm.tipoRiesgo;
              formIncapacidad.cveConsecuencia = toForm.consecuencia.toString();
              formIncapacidad.cveLaudo = parseInt(toForm.laudo).toString();
              formIncapacidad.modifPatronal = toForm.modificacion;

              if (this.getValidaDictamen()) {
                let dictamen: BitacoraDictamenDTO = new BitacoraDictamenDTO();
                dictamen.tipoDictamen = this.formGroup.get('tipoDictamen').value;
                dictamen.numFolio = this.formGroup.get('numFolio').value;
                dictamen.ubicacionArchivo = '';
                dictamen.activo = true;
                formIncapacidad.bitacoraDictamen = [dictamen];
              }

              if (this.formGroup.get('modificacion').value) {
                console.log("Entró a asignar cve modif patronal")
                formIncapacidad.cveTipoModifPatronal = parseInt(toForm.tipoModificacion).toString();
              } else {
                console.log("No Entró a asignar cve modif patronal")

                formIncapacidad.cveTipoModifPatronal = parseInt(toForm.tipoModificacion).toString();

              }
              formIncapacidad.numMatMedTratante = toForm.matMedTratante;
              formIncapacidad.numMatMedAutCdst = toForm.matMedCDTS;

              // ******************  GUARDAMOS LOS CATALOGOS  ***********/
              console.log("LA FECHA DE fecAltaIncapacidad ====> " + JSON.stringify(formIncapacidad));
              if (!!this.diagnosticCodeSelected) {
                formIncapacidad.numCodigoDiagnostico = this.diagnosticCodeSelected.cveCatalogo;
                formIncapacidad.desCodigoDiagnostico = this.diagnosticCodeSelected.descCatalogo;
              }

              if (!!this.externalCauseSelected) {
                formIncapacidad.numCausaExterna = this.externalCauseSelected.cveCatalogo;
                formIncapacidad.desCausaExterna = this.externalCauseSelected.descCatalogo;
              }

              if (!!this.naturalezaSelected) {
                formIncapacidad.cveNaturaleza = this.naturalezaSelected.cveCatalogo;
                formIncapacidad.desNaturaleza = this.naturalezaSelected.descCatalogo;
              }

              // *********************** GUARDMOS LA DESCRIPCION DE RIESGO FISICO   *********************/

              if (this.formGroup.get('riesgoFisico').value != -1) {

                const riesgoNArray = this.riesgoFisicoCat.find(item => item.cveCatalogo === this.formGroup.get('riesgoFisico').value);

                if (riesgoNArray !== undefined) {
                  formIncapacidad.desRiesgoFisico = riesgoNArray.descCatalogo;
                } else {
                  formIncapacidad.desRiesgoFisico = null;
                }

              }
              console.log('______ LA DESCRIPCION DE RIESGO FISICO ES_____ ' + formIncapacidad.desRiesgoFisico);

              formIncapacidad.numRiesgoFisico = this.formGroup.get('riesgoFisico').value;

              // *********************** GUARDMOS LA DESCRIPCION DE ACTO INSEGURO   *********************/

              if (this.formGroup.get('actoInseguro').value !== undefined && this.formGroup.get('actoInseguro').value != -1) {

                const inseguroAArray = this.actoInseguroCat.find(item => item.cveCatalogo === this.formGroup.get('actoInseguro').value);
                if (inseguroAArray !== undefined) {
                  formIncapacidad.desActoInseguro = inseguroAArray.descCatalogo;
                } else {
                  formIncapacidad.desActoInseguro = null;
                }

              }
              console.log('______ LA DESCRIPCION DE ACTO INSEGURO _____ ' + formIncapacidad.desActoInseguro);

              formIncapacidad.numActoInseguro = this.formGroup.get('actoInseguro').value;

              this.info.incapacidadDTO = formIncapacidad;
              formDup.incapacidadDTO = this.info.incapacidadDTO;
              formDup.fecProcesoCarga = this.info.fecProcesoCarga;

              this.validarDuplicados(formDup);

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
        if (err.status !== null) {
          switch (err.status) {
            case 401:
              this.mostrarSi = false;
              this.showMessage('Usuario no autorizado', 'Atención');
              this.responseValidation = [];
              break;
            case 504:
              this.mostrarSi = false;
              this.showMessage('Servicio no disponible', 'Atención');
              this.responseValidation = [];
              break;
            case 500:
              this.mostrarSi = false;
              this.showMessage('Servicio de validación almacenes no disponible', 'Atención');
              this.responseValidation = [];
              break;
          }
        } else {
          this.mostrarSi = false;
          this.showMessage('Problemas con el servicio ' + err.message, 'Atención');
          this.spinner.hide();
        }
      }, () => { });

  }

  public cambiarNSS() {
    const control = this.formGroup.get('nss');
    if (control.touched && control.errors === null && control.status === 'VALID') {
      this.buscarAsegurado();
    }
  }

  public cambiarRP(tipo: string) {
    this.disableSublime = true;
    console.log('cambiarRP: ' + tipo);
    if (tipo === 'auto') {
      this.buscarPatron();
    } else {
      this.buscarPatronManual();
    }
    this.disableSublime = false;
  }

  private validaRHIMSS() {
    const result = validateRhImss();
    if (this.info.patronDTO.desRfc !== 'IMS421231I45' && result) {
      this.showMessage('El NSS ingresado no cuenta con relación laboral RFC IMSS', 'Atención');
      this.formGroup.get('registroPatronal').reset();
      this.formGroup.get('razonSocialPatron').reset();
      this.formGroup.get('fracion').reset();
      this.formGroup.get('prima').reset();
      this.formGroup.get('clase').reset();
      this.formGroup.get('actividadEconomica').reset();
      this.formGroup.get('delegacionRegistro').reset();
      this.formGroup.get('subRegistro').reset();
      this.formGroup.get('rfcPatronal').reset();
      this.responseValidation = [];
      this.spinner.hide();
    }
  }

  public buscarPatron() {
    const toForm: ValidationForm = new ValidationForm();
    toForm.nss = this.formGroup.get('nss').value;
    toForm.fechaAccidente = this.formGroup.get('date2').value;

    this.spinner.show();

    console.log(toForm);
    if (toForm.nss != '' && toForm.fechaAccidente != '') {
      this.almacenesBuscarPatronService.buscarPatron(toForm).subscribe(
        (response: any) => {
          switch (response.status) {
            case 200:
            case 206:
              this.responseSearch = response.body;
              console.log("DATOS PATRON ==" + response.body);
              if (this.responseSearch !== null && this.responseSearch !== undefined && this.responseSearch.patronDTO !== null) {
                this.info.patronDTO = this.responseSearch.patronDTO;
                this.formGroup.get('registroPatronal').setValue(this.responseSearch.patronDTO.refRegistroPatronal);
                this.formGroup.get('razonSocialPatron').setValue(this.responseSearch.patronDTO.desRazonSocial);
                this.formGroup.get('fracion').setValue(this.responseSearch.patronDTO.cveFraccion);
                this.formGroup.get('prima').setValue(this.responseSearch.patronDTO.numPrima);
                this.formGroup.get('clase').setValue(this.responseSearch.patronDTO.desClase);
                this.formGroup.get('actividadEconomica').setValue(this.responseSearch.patronDTO.desFraccion);
                this.formGroup.get('delegacionRegistro').setValue(this.responseSearch.patronDTO.desDelRegPatronal);
                this.formGroup.get('subRegistro').setValue(this.responseSearch.patronDTO.desSubDelRegPatronal);
                this.formGroup.get('rfcPatronal').setValue(this.responseSearch.patronDTO.desRfc);
                this.validaRHIMSS();
              } else {
                this.formGroup.get('registroPatronal').reset();
                this.formGroup.get('razonSocialPatron').reset();
                this.formGroup.get('fracion').reset();
                this.formGroup.get('prima').reset();
                this.formGroup.get('clase').reset();
                this.formGroup.get('actividadEconomica').reset();
                this.formGroup.get('delegacionRegistro').reset();
                this.formGroup.get('subRegistro').reset();
                this.formGroup.get('rfcPatronal').reset();
                this.responseValidation = [];
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
          if (err.status !== null) {
            switch (err.status) {
              case 401:
                this.responseValidation = [];
                break;
              case 500:
              case 504:
                this.responseValidation = [];
                break;
            }
          } else {
          }
        }, () => {
          this.spinner.hide();
        });
    } else {
      this.spinner.hide();
    }

  }

  public buscarPatronManual() {
    const toForm: ValidationForm = new ValidationForm();

    toForm.rp = this.formGroup.get('registroPatronal').value;

    console.log(toForm);
    if (toForm.rp != null && toForm.rp != '') {
      this.responseValidation = [];
      this.spinner.show();
      this.patronesService.buscar(toForm).subscribe(
        (response: any) => {
          switch (response.status) {
            case 200:
            case 206:
              this.responseSearch = response.body;
              console.log("DATOS PATRON ==" + JSON.stringify(response.body));
              if (this.responseSearch !== null && this.responseSearch !== undefined && this.responseSearch.patronDTO !== null) {
                this.info.patronDTO = this.responseSearch.patronDTO;
                this.formGroup.get('registroPatronal').setValue(this.responseSearch.patronDTO.refRegistroPatronal);
                this.formGroup.get('razonSocialPatron').setValue(this.responseSearch.patronDTO.desRazonSocial);
                this.formGroup.get('fracion').setValue(this.responseSearch.patronDTO.cveFraccion);
                this.formGroup.get('prima').setValue(this.responseSearch.patronDTO.numPrima);
                this.formGroup.get('clase').setValue(this.responseSearch.patronDTO.desClase);
                this.formGroup.get('actividadEconomica').setValue(this.responseSearch.patronDTO.desFraccion);
                this.formGroup.get('delegacionRegistro').setValue(this.responseSearch.patronDTO.desDelRegPatronal);
                this.formGroup.get('subRegistro').setValue(this.responseSearch.patronDTO.desSubDelRegPatronal);
                this.formGroup.get('rfcPatronal').setValue(this.responseSearch.patronDTO.desRfc);
                this.validaRHIMSS();
              } else {
                this.responseValidation = this.responseValidation.concat(this.responseSearch.bitacoraErroresDTO);
                this.formGroup.get('registroPatronal').reset();
                this.formGroup.get('razonSocialPatron').reset();
                this.formGroup.get('fracion').reset();
                this.formGroup.get('prima').reset();
                this.formGroup.get('clase').reset();
                this.formGroup.get('actividadEconomica').reset();
                this.formGroup.get('delegacionRegistro').reset();
                this.formGroup.get('subRegistro').reset();
                this.formGroup.get('rfcPatronal').reset();
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
          if (err.status !== null) {
            switch (err.status) {
              case 401:
                this.mostrarSi = false;
                this.showMessage('Usuario no autorizado', 'Atención');
                this.responseValidation = [];
                break;
              case 500:
              case 504:
                this.mostrarSi = false;
                this.showMessage('Patron no encontrado.', 'Atención');
                this.responseValidation = [];
                break;
            }
          } else {
            this.mostrarSi = false;
            this.showMessage('Patron no encontrado. ' + err.message, 'Atención');
          }
        }, () => {
          this.spinner.hide();
        });
    }
  }

  validarSuceptibles(toFormGuardar: DetalleRegistroDTO) {
    $('#btnGuardar').attr('disabled', true);
    var siSuceptible = 0;
    console.log(" ==> EN LA FUNCION VALIDAR SUCEPTIBLE" + JSON.stringify(toFormGuardar));
    this.suceptibleValidationService.validate(toFormGuardar).subscribe(

      (response: any) => {
        switch (response.status) {
          case 200:
            console.log(" OK");
            siSuceptible = 1;
            this.responseSusValidacion = response.body;
            toFormGuardar.existeRelacionLaboral = this.existeRelacionLaboral;
            console.log(" =====> EÑ TAMANIO ES " + this.responseSusValidacion.length);
            console.log(" ==> EN LA FUNCION VALIDAR SUCEPTIBLE 333" + JSON.stringify(toFormGuardar));
            if (this.responseSusValidacion.length > 0) {
              console.log("A =========> ");
              this.showMessageSUS("El nuevo registro de casuística es considerado como Susceptible de Ajuste, ¿Está seguro de continuar con el alta de la casuística?", 'Atención');
              this.formDetalleReg = toFormGuardar;
              console.log(" =========> ");
              console.log(" ==========>VALIDAMOS EL OBJETO A MANDAR A GUARDAR toFormGuardar =" + JSON.stringify(toFormGuardar));
              toFormGuardar.listaSuceptible = this.responseSusValidacion;
              //  this.guardarMovimientosSUS(toFormGuardar);
            } else {
              console.log("B =========> ");
              this.guardarMovimientos(toFormGuardar);
            }



          case 206:
            return 0;
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
            tmp1.desCodigoError = 'Servicio de validación de suceptibles no disponible.';
            responseValidation3[0] = tmp1;

            this.spinner.hide();
            break;
        }
      });

    return siSuceptible;

  }


  public validarAlmacenes(toFormGuardar: DetalleRegistroDTO) {
    $('#btnGuardar').attr('disabled', true);
    console.log('INICIO MARCA ALMACENES -->' + JSON.stringify(toFormGuardar));
    const toForm: ValidationForm = new ValidationForm();
    this.spinner.show();
    console.log('form almacenes:' + toForm);
    toForm.rp = this.formGroup.get('registroPatronal').value;
    toForm.nss = this.formGroup.get('nss').value;
    toForm.cambioNss = 'true';
    toForm.cambioRp = 'true';
    toForm.fechaAccidente = this.formGroup.get('date2').value;
    console.log('INICIO MARCA ALMACENES 2-->' + JSON.stringify(toFormGuardar));
    if (this.formGroup.get('registroPatronal').value !== null &&
      this.formGroup.get('nss').value !== null &&
      this.formGroup.get('date2').value !== null &&
      this.formGroup.get('registroPatronal').value !== '' &&
      this.formGroup.get('nss').value !== '' &&
      this.formGroup.get('date2').value !== '') {
      this.wharehouseValidationService.validate(toForm).subscribe(
        (response: any) => {
          console.log('MARCA ALMACENES -->' + JSON.stringify(toFormGuardar));
          // this.spinner.hide();
          switch (response.status) {
            case 200:
            case 206:

              this.responseWharehouseValidation = response.body;
              if (response.body.bitacoraErroresDTO == null) {
                this.existeRelacionLaboral = true;
                const tmp1 = new ResponseValidation();

                if (this.formGroup.get('modificacion').value === 'true') {
                  console.log("ES MODIFICACION PATRONAL")
                  tmp1.desCodigoError = 'No existe relación laboral del Número de Seguridad Social con el Registro Patronal, ¿Está seguro de continuar con el alta de la casuística?';
                  this.formDetalleReg = toFormGuardar;
                  this.showMessageRelacionLab(tmp1.desCodigoError, 'Atención');
                  this.spinner.hide();

                } else {
                  console.log("NO ES MODIFICACION PATRONAL")
                  this.validarSuceptibles(toFormGuardar);
                  this.spinner.hide();

                }

              } else {
                const tmp1 = new ResponseValidation();

                this.existeRelacionLaboral = false;
                this.mostrarSiFinal = true;
                if (toFormGuardar.incapacidadDTO.cveLaudo === '1') { // Es laudo
                  // tslint:disable-next-line: max-line-length

                  console.log("ES LAUDO")
                  tmp1.desCodigoError = 'No existe relación laboral del Número de Seguridad Social con el Registro Patronal, ¿Está seguro de continuar con el alta de la casuística?';
                  this.formDetalleReg = toFormGuardar;
                  this.showMessageRelacionLab(tmp1.desCodigoError, 'Atención');
                  this.spinner.hide();
                } else {

                  console.log("NO ES LAUDO")
                  if (this.formGroup.get('modificacion').value === 'true') {
                    console.log("ES MODIFICACION PATRONAL")
                    tmp1.desCodigoError = 'No existe relación laboral del Número de Seguridad Social con el Registro Patronal, ¿Está seguro de continuar con el alta de la casuística?';
                    this.formDetalleReg = toFormGuardar;
                    this.showMessageRelacionLab(tmp1.desCodigoError, 'Atención');
                    this.spinner.hide();
                  } else {
                    console.log("NO ES MODIFICACION PATRONAL")

                    this.mostrarSi = false;

                    tmp1.desCodigoError = 'No existe relación laboral del Número de Seguridad Social con el Registro Patronal';
                    this.showMessage(tmp1.desCodigoError, 'Atención');
                    this.spinner.hide();
                  }
                }

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
          // this.spinner.hide();
          if (err.status !== null) {
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
            this.mostrarSi = false;
            this.showMessage('Problemas con el servicio ' + err.message, 'Atención');
          }
        }, () => {
          // this.spinner.hide();
          // window.scrollTo(0, 600);
        });
    } else {
      this.spinner.hide();
    }
  }

  public buscarAsegurado() {
    const toForm: ValidationForm = new ValidationForm();
    let nssValido = false;
    toForm.nss = this.formGroup.get('nss').value;
    console.log(toForm);
    if (toForm.nss !== null && toForm.nss !== '') {
      this.spinner.show();
      this.aseguradosService.buscar(toForm).subscribe(
        (response: any) => {

          switch (response.status) {
            case 200:
              this.responseSearch = response.body;
              this.info.aseguradoDTO = this.responseSearch.aseguradoDTO;
              //console.log('-----LA FECHA DE BAJA ' + JSON.stringify( this.responseSearch.aseguradoDTO.fechaBaja));
              var fechaBaja = this.responseSearch.aseguradoDTO.fechaBaja;
              if (this.responseSearch !== null && this.responseSearch !== undefined && this.responseSearch.aseguradoDTO !== null) {
                if (fechaBaja !== null && fechaBaja === "Tiene fecha baja") {
                  this.showMessage('El NSS ingresado tiene inconsistencia en su información, favor de validar e ingresar el NSS correcto.', 'Atención');
                  this.mostrarSi = false;
                  this.limpiar();
                  this.responseValidation = [];
                } else {
                  if (this.user.userInfo.businessCategory != null) {
                    nssValido = Number(this.user.userInfo.businessCategory) === Number(this.info.aseguradoDTO.cveDelegacionNss);
                    if (nssValido && this.user.userInfo.departmentNumber !== null) {
                      nssValido = Number(this.user.userInfo.departmentNumber) === Number(this.info.aseguradoDTO.cveIdSubdelNss);
                    }
                  } else if (this.user.userInfo.businessCategory === null && this.user.userInfo.departmentNumber === null) {
                    nssValido = true;
                  }
                  console.log('Misma delegacion: ' + nssValido);

                  //  if (true) {
                  if (nssValido) {
                    this.formGroup.get('curp').setValue(this.info.aseguradoDTO.refCurp);
                    this.formGroup.get('nombre').setValue(this.info.aseguradoDTO.nomAsegurado);
                    this.formGroup.get('primerApellido').setValue(this.info.aseguradoDTO.refPrimerApellido);
                    this.formGroup.get('segundoApellido').setValue(this.info.aseguradoDTO.refSegundoApellido);
                    this.formGroup.get('delegacionNss').setValue(this.info.aseguradoDTO.cveDelegacionNss);
                    this.chargeSubDelegationAdscripcionAsegurado(this.info.aseguradoDTO.cveDelegacionNss);
                    console.log('chargeSubDelegationAdscripcionAsegurado');

                  } else {
                    this.showMessage('El Nss pertenece a otra delegación o subdelegación', 'Atención');
                    this.mostrarSi = false;
                    this.limpiar();
                    this.responseValidation = [];
                  }
                  console.log('terminando el llenado');
                  this.spinner.hide();
                }
              } else {
                // this.limpiar();
                this.responseValidation = this.responseValidation.concat(this.responseSearch.bitacoraErroresDTO);
                this.showMessageV3('', 'Atención');
                this.spinner.hide();
              }
              break;
            case 206:
            case 204:
            case 500:
            case 504:
              this.responseValidation = [];
              break;
          }
        }, err => {
          this.spinner.hide();
          if (err.status !== null) {
            switch (err.status) {
              case 401:
                this.mostrarSi = false;
                this.showMessage('Usuario no autorizado', 'Atención');
                this.responseValidation = [];
                break;
              case 500:
                this.buscarSinADS();
                break;
              case 504:
            }
          } else {
            this.mostrarSi = false;
            this.showMessage('Asegurado no encontrado. ' + err.message, 'Atención');
          }
        }, () => {
          console.log('fin fin');
        });
    }
  }
  public buscarSinADS() {
    const toForm: ValidationForm = new ValidationForm();
    let nssValido = false;
    toForm.nss = this.formGroup.get('nss').value;
    console.log(toForm);
    this.aseguradosService.buscarSinAdscrip(toForm).subscribe(
      (response: any): void => {
        switch (response.status) {
          case 200:
            this.responseSearch = response.body;
            this.info.aseguradoDTO = this.responseSearch.aseguradoDTO;
            console.log(this.responseSearch.aseguradoDTO);
            console.log(this.info.aseguradoDTO === null);
            console.log(this.info.aseguradoDTO === undefined);
            if (this.info.aseguradoDTO === null || this.info.aseguradoDTO === undefined) {
              this.buscarNssSinAdsCubetas();
            } else {
              var fechaBaja = this.responseSearch.aseguradoDTO.fechaBaja;
              console.log('resultado de buscar sin ads');
              console.log(this.responseSearch);
              if (this.responseSearch !== null && this.responseSearch !== undefined && this.responseSearch.aseguradoDTO !== null) {
                if (fechaBaja !== null && fechaBaja === "Tiene fecha baja") {
                  this.showMessage('El NSS ingresado tiene inconsistencia en su información, favor de validar e ingresar el NSS correcto.', 'Atención');
                  this.mostrarSi = false;
                  this.limpiar();
                  this.responseValidation = [];
                } else {
                  if (this.user.userInfo.businessCategory === null || this.user.userInfo.departmentNumber === null) {

                    nssValido = true;
                  }
                  console.log('NSS Valido: ' + nssValido);
                  if (nssValido) {
                    this.formGroup.get('curp').setValue(this.info.aseguradoDTO.refCurp);
                    this.formGroup.get('nombre').setValue(this.info.aseguradoDTO.nomAsegurado);
                    this.formGroup.get('primerApellido').setValue(this.info.aseguradoDTO.refPrimerApellido);
                    this.formGroup.get('segundoApellido').setValue(this.info.aseguradoDTO.refSegundoApellido);
                    this.sinAds = true;
                    this.chargeSubDelegationAdscripcionAsegurado(this.info.aseguradoDTO.cveDelegacionNss);
                  } else {
                    this.showMessage('El Nss pertenece a otra delegación o subdelegación', 'Atención');
                    this.mostrarSi = false;
                    this.responseValidation = [];
                  }
                  console.log('terminando el llenado');
                  this.spinner.hide();
                }
              } else {
                this.responseValidation = this.responseValidation.concat(this.responseSearch.bitacoraErroresDTO);
                this.showMessageV3('', 'Atención');
                this.spinner.hide();
              }
            }
            break;
          case 206:
          case 204:
          case 500:
          case 504:
            this.responseValidation = [];
            break;
        }
      }, err => {
        this.spinner.hide();
        if (err.status !== null) {
          switch (err.status) {
            case 401:
              this.mostrarSi = false;
              this.showMessage('Usuario no autorizado', 'Atención');
              this.responseValidation = [];
              break;
            case 500:
            case 504:
              this.mostrarSi = false;
              this.showMessage('Asegurado no encontrado.', 'Atención');
              this.responseValidation = [];
              break;
          }
        } else {
          this.mostrarSi = false;
          this.showMessage('Asegurado no encontrado.' + err.message, 'Atención');
        }
      }, () => {
        console.log('fin fin');
      }
    );
  }
  public buscarNssSinAdsCubetas() {
    const toForm: ValidationForm = new ValidationForm();
    let nssValido = false;
    toForm.nss = this.formGroup.get('nss').value;
    this.aseguradoMarcaAfiliatoriaService.buscarNssMarcaAfiliatoria(toForm).subscribe(
      response => {
        this.responseSearch = response.body;
        this.info.aseguradoDTO = this.responseSearch.aseguradoDTO;
        if (this.info.aseguradoDTO === null || this.info.aseguradoDTO === undefined) {
          this.showMessage('El NSS ingresado no tiene una UMF registrada, por lo que es la Subdelegación y/o OOAD control del Registro Patronal la que puede registrar o modificar el riesgo', 'Atención');
          this.limpiar();
        } else {
          if (this.info.aseguradoDTO.cveSubdelNss === '' || this.info.aseguradoDTO.cveSubdelNss === null
            || this.info.aseguradoDTO.cveSubdelNss === undefined) {
            nssValido = true;
          } else {
            if (this.user.userInfo.businessCategory != null) {
              nssValido = Number(this.user.userInfo.businessCategory) === Number(this.info.aseguradoDTO.cveDelegacionNss);
              if (nssValido && this.user.userInfo.departmentNumber !== null) {
                nssValido = Number(this.user.userInfo.departmentNumber) === Number(this.info.aseguradoDTO.idSubDelNss);
              }
            } else if (this.user.userInfo.businessCategory === null && this.user.userInfo.departmentNumber === null) {
              nssValido = true;
            }
          }
          console.log('Misma delegacion: ' + nssValido);
          if (nssValido) {
            this.formGroup.get('curp').setValue(this.info.aseguradoDTO.refCurp);
            this.formGroup.get('nombre').setValue(this.info.aseguradoDTO.nomAsegurado);
            this.formGroup.get('primerApellido').setValue(this.info.aseguradoDTO.refPrimerApellido);
            this.formGroup.get('segundoApellido').setValue(this.info.aseguradoDTO.refSegundoApellido);
            if (this.info.aseguradoDTO.cveDelegacionNss && this.info.aseguradoDTO.cveSubdelNss) {
              this.formGroup.get('delegacionNss').setValue(this.info.aseguradoDTO.cveDelegacionNss);
              this.chargeSubDelegationAdscripcionAsegurado(this.info.aseguradoDTO.cveDelegacionNss);
            }
            //validamos si delegacion subdelegacion umf tiene datos
            //si tiene continuar marcando con marca afiliatoria si no tiene se marca como nss sin umf y con marca                    
            if (this.info.aseguradoDTO.cveDelegacionNss === null ||
              this.info.aseguradoDTO.cveDelegacionNss === undefined || this.info.aseguradoDTO.cveSubdelNss === null
              || this.info.aseguradoDTO.cveSubdelNss === undefined) {
              this.sinAds = true;
            }
            else {
              this.chargeSubDelegationAdscripcionAseguradoCubetas(this.info.aseguradoDTO.cveDelegacionNss);
            }
            this.nssConMarcaAfiliatoria = this.info.aseguradoDTO.marcaAfiliatoria;
            console.log('chargeSubDelegationAdscripcionAsegurado');
            console.log(this.formGroup);
          } else {
            this.showMessage('El Nss pertenece a otra delegación o subdelegación', 'Atención');
            this.mostrarSi = false;
            this.limpiar();
            this.responseValidation = [];
          }

        }
      }, err => {
        this.spinner.hide();
        if (err.status !== null) {
          switch (err.status) {
            case 401:
              this.mostrarSi = false;
              this.showMessage('Usuario no autorizado', 'Atención');
              this.responseValidation = [];
              break;
            case 500:
              this.showMessage('El NSS ingresado no tiene una UMF registrada, por lo que es la Subdelegación y/o OOAD control del Registro Patronal la que puede registrar o modificar el riesgo', 'Atención');
              this.mostrarSi = false;
              this.responseValidation = [];
            case 504:
              this.mostrarSi = false;
              this.showMessage('El NSS ingresado no tiene una UMF registrada, por lo que es la Subdelegación y/o OOAD control del Registro Patronal la que puede registrar o modificar el riesgo.', 'Atención');
              this.responseValidation = [];
              break;
          }
        } else {
          this.mostrarSi = false;
          this.showMessage('El NSS ingresado no tiene una UMF registrada, por lo que es la Subdelegación y/o OOAD control del Registro Patronal la que puede registrar o modificar el riesgo' + err.message, 'Atención');
        }
      }, () => {
        console.log('fin fin');
      }
    );


  }
  public showMessageV3(message: string, title: string) {
    this.titDialogo = title;
    this.messDialogo = message;
    this.mostrarSiFinal = true;
    $('#dialogMessageV3').modal('show');
  }

  public limpiar() {
    this.showDictamen = false;
    $('#btnGuardar').attr('disabled', false);
    this.sinAds = false;
    this.formGroup.reset();
    this.chargeCalendar();
    this.setIdentificador();
    this.chargeDelegationAdscripcion();
    this.catalogosIncapacidad();
    this.mostrarSiFinal = false;
    $('#casoRegistro').val('');
    $('#anioCiclo').val('');
    this.formGroup.get('umfExpedicion').setValue(-1);
    this.formGroup.get('subdelagacionAtencionNss').setValue(-1);
    this.formGroup.get('delegacionAtencionNss').setValue(-1);
    this.formGroup.get('tipoDictamen').setValue(-1);
    this.changeTipoDictamen();
  }

  private handleCodigoDiagnosticoChanges() {
    this.codigoDiagnosticoForm.valueChanges.pipe(
      debounceTime(500),
      switchMap(regex => this.searchCodigoDiagnostico(regex))
    ).subscribe(response => {
      this.isLoadingDiagnosticCode = false;
      if (response?.body) {
        this.codigoDiag = response.body;
        this.codigoDiag = this.codigoDiag.sort(this.sortFunc);
      }
      this.isSelectionDiagnosticCode = false;
    },
      (error) => {
        this.isLoadingDiagnosticCode = false;
        console.error('....ERROR' + error);
      });
  }

  public searchCodigoDiagnostico(regTex: string) {
    if (!this.isSelectionDiagnosticCode) {
      this.isLoadingDiagnosticCode = true;
      this.diagnosticCodeSelected = undefined;
      return this.searchRegexCat(regTex, 'MccCodigoDiagnostico', 'desCodigoDiagnostico');
    } else {
      return of(undefined);
    }
  }

  public selectDiagnosticCode(diagnosticCode) {
    this.isSelectionDiagnosticCode = true;
    this.diagnosticCodeSelected = diagnosticCode;
  }

  private handleNaturalezaChanges() {
    this.naturalezaForm.valueChanges.pipe(
      debounceTime(500),
      switchMap(regex => this.searchNaturaleza(regex))
    ).subscribe(response => {
      this.isLoadingNaturaleza = false;
      if (response?.body) {
        this.naturalezaCat = response.body;
        this.naturalezaCat = this.naturalezaCat.sort(this.sortFunc);
      }
      this.isSelectionNaturaleza = false;
    },
      (error) => {
        this.isLoadingNaturaleza = false;
        console.error('....ERROR' + error);
      });
  }

  public searchNaturaleza(regTex: string) {
    if (!this.isSelectionNaturaleza) {
      this.isLoadingNaturaleza = true;
      this.naturalezaSelected = undefined;
      return this.searchRegexCat(regTex, 'MccNaturaleza', 'desNaturaleza');
    } else {
      return of(undefined);
    }
  }

  public selectNaturaleza(naturaleza) {
    this.isSelectionNaturaleza = true;
    this.naturalezaSelected = naturaleza;
  }

  public sortFunc = (a: Catalogs, b: Catalogs) => {
    if (a.cveCatalogo > b.cveCatalogo) {
      return 1;
    }
    if (a.cveCatalogo < b.cveCatalogo) {
      return -1;
    }
    return 0;
  }

  // ***************************************   CAUSA EXTERNA  ***************************************************

  private handleExternalCauseChanges() {
    this.externalCauseForm.valueChanges.pipe(
      debounceTime(500),
      switchMap(regex => this.searchExternalCause(regex))
    ).subscribe(response => {
      this.isLoadingExternalCause = false;
      if (response?.body) {
        this.causaExternaList = response.body;
        this.causaExternaList = this.causaExternaList.sort(this.sortFunc);
      }
      this.isSelectionExternalCause = false;
    },
      (error) => {
        this.isLoadingExternalCause = false;
        console.error('....ERROR' + error);
      });
  }

  public searchExternalCause(regTex: string) {
    if (!this.isSelectionExternalCause) {
      this.isLoadingExternalCause = true;
      this.externalCauseSelected = undefined;
      return this.searchRegexCat(regTex, 'MccCausaExterna', 'desCausaExterna');
    } else {
      return of(undefined);
    }
  }

  public selectExternalCause(externalCause: Catalogs) {
    this.isSelectionExternalCause = true;
    this.externalCauseSelected = externalCause;
  }

  public searchRegexCat(regTex: string, catalogName: string, searchField: string) {
    const request: GetCatalogs = new GetCatalogs();
    request.nameCatalog = catalogName;
    request.textRegex = regTex;
    request.searchField = searchField;
    return this.findCatalogo.findRegex(request);
  }

  public siGuardarSinRelacionLaboral() {
    this.hideMessage('dialogMessageRelacionLaboral');
    this.validarSuceptibles(this.formDetalleReg);
  }

  public siGuardarSUS() {
    this.hideMessage('dialogMessageSUS');
    this.formGroup.get('medicoTratante').value
    this.guardarMovimientosSUS(this.formDetalleReg);
  }

  public showMessageSUS(message: string, title: string) {
    this.titDialogo = title;
    this.messDialogo = message;
    $('#dialogMessageSUS').modal({ backdrop: 'static', keyboard: false });
  }

  public showMessageRelacionLab(message: string, title: string) {
    this.titDialogo = title;
    this.messDialogo = message;
    $('#dialogMessageRelacionLaboral').modal('show');
  }

  guardarAlta(formDup: DetalleRegistroDTO) {
    this.validarAlmacenes(formDup);

  }


  //********************  GUARDAMOS NUEVO COMO SUSEEPTIBLES ES  ***************/
  public guardarMovimientosSUS(toForm: DetalleRegistroDTO) {
    console.log("Fecha =========================================> ", toForm.fecProcesoCarga);
    // Validacion de duplicados
    const response: ResponseValidation[] = [];
    this.spinner.show();

    this.mostrarSiFinal = true;
    toForm.origenPantalla = this.pantalla;
    toForm.listaSuceptible = this.responseSusValidacion;

    toForm.incapacidadDTO.numMatMedTratante = this.formGroup.get('medicoTratante').value;
    toForm.incapacidadDTO.numMatMedAutCdst = this.formGroup.get('medicoCDST').value;

    this.agregarRiesgoDeTrabajo(toForm);
    this.saveMovementService.insertarSus(toForm, this.pantalla).subscribe(
      (response: any) => {
        console.log(" ==== > EL RESPONSE TOTAL ES " + JSON.stringify(response));
        switch (response.status) {
          case 200:
            this.formDetalleReg = response.body;
            if (this.formDetalleReg !== null && this.formDetalleReg.objectIdOrigen !== null &&
              this.formDetalleReg.objectIdOrigen.length > 0) {
              this.upload(this.formDetalleReg.objectIdOrigen, this.formDetalleReg.aseguradoDTO.numNss,
                this.formDetalleReg.cveOrigenArchivo);
              this.limpiar();
              this.mostrarSi = false;
              this.showMessage('Se generó alta correctamente.', 'Atención');
            } else if (response !== null && response.length > 0) {
              this.spinner.hide();
              this.responseValidation = this.responseValidation.concat(response);
              this.showMessageV3('', 'Atención');
            }
            break;
          case 206:
            break;
          case 204:
            break;
          case 504:
            break;
          case 500:
            break;
        }
      }, err => {
        console.log(" ============== > ERROR    ");
        this.spinner.hide();
        if (err.status !== null) {
          switch (err.status) {
            case 200:
              break;
            case 206:
              this.insertado = true;
              const responseValidation5: ResponseValidation[] = [];
              const tmp3 = new ResponseValidation();
              tmp3.desCodigoError = err.error.text;
              responseValidation5[0] = tmp3;
              this.responseValidation = this.responseValidation.concat(responseValidation5);
              this.mostrarSi = false;
              this.showMessage('Guardado exitoso.', 'Atención');
              break;
            case 400:
              const responseValidation4: ResponseValidation[] = [];
              const tmp2 = new ResponseValidation();
              tmp2.desCodigoError = err.error.message;
              responseValidation4[0] = tmp2;
              this.responseValidation = this.responseValidation.concat(responseValidation4);
              this.mostrarSi = false;
              this.showMessage('Guardado exitoso.', 'Atención');
              break;
            case 401:
              const responseValidation2: ResponseValidation[] = [];
              const tmp = new ResponseValidation();
              tmp.desCodigoError = 'Usuario no autorizado para guardar movimiento';
              responseValidation2[0] = tmp;
              this.responseValidation = this.responseValidation.concat(responseValidation2);
              this.mostrarSi = false;
              this.showMessage(tmp.desCodigoError, 'Atención');
              break;
            case 500:
            case 504:
              const responseValidation3: ResponseValidation[] = [];
              const tmp1 = new ResponseValidation();
              tmp1.desCodigoError = 'Servicio de inserción de movimientos no disponible.';
              responseValidation3[0] = tmp1;
              this.responseValidation = this.responseValidation.concat(responseValidation3);
              this.mostrarSi = false;
              this.showMessage(tmp1.desCodigoError, 'Atención');
              break;
          }
        } else {
          this.showMessage('Problemas con el servicio ' + err.message, 'Atención');
        }
      }, () => {
        this.spinner.hide();
      });
  }

  public agregarRiesgoDeTrabajo(toForm: DetalleRegistroDTO) {
    const ffacc = this.formGroup.get('date2').value.split('/');
    const ffIni = this.formGroup.get('date3').value.split('/');
    const ffalta = this.formGroup.get('date4').value.split('/');

    const formIncapacidad: IncapacidadDTO = new IncapacidadDTO();

    toForm.aseguradoDTO = this.info.aseguradoDTO;
    console.log('____ GUARDAMOS OCUPACION  ________');
    toForm.aseguradoDTO.cveOcupacion = this.formGroup.get('ocupacion').value;
    // *********************** GUARDMOS LA DESCRIPCION DE LA OCUPACION *********************/

    if (this.formGroup.get('ocupacion').value !== undefined && this.formGroup.get('ocupacion').value != -1) {

      const ocupacionAArray = this.ocupacionCat.find(item => item.cveCatalogo === this.formGroup.get('ocupacion').value);

      if (ocupacionAArray !== undefined) {
        toForm.aseguradoDTO.desOcupacion = ocupacionAArray.descCatalogo;
      } else {
        toForm.aseguradoDTO.desOcupacion = "";
      }

    }
    console.log('______ LA DESCRIPCION DE OCUPACION____ ' + toForm.aseguradoDTO.desOcupacion);
    toForm.patronDTO = this.info.patronDTO;
    formIncapacidad.fecAccidente = this.obtenerFecha(ffacc);
    formIncapacidad.fecInicio = this.obtenerFecha(ffIni);
    formIncapacidad.fecAlta = this.obtenerFecha(ffalta);
    formIncapacidad.fecAltaIncapacidad = this.obtenerFecha(ffalta);
    formIncapacidad.fecFin = this.obtenerFecha(ffalta);
    formIncapacidad.numDiasSubsidiados = this.formGroup.get('diasSubsidiados').value;
    formIncapacidad.porPorcentajeIncapacidad = this.formGroup.get('porcentajeIncapacidad').value;
    formIncapacidad.cveTipoRiesgo = this.formGroup.get('tipoRiesgo').value;
    formIncapacidad.cveConsecuencia = this.formGroup.get('concecuencia').value;
    formIncapacidad.cveLaudo = this.formGroup.get('laudos').value;
    formIncapacidad.numMatMedTratante = this.formGroup.get('medicoTratante').value;
    formIncapacidad.numMatMedAutCdst = this.formGroup.get('medicoCDST').value;
    formIncapacidad.cveTipoModifPatronal = this.formGroup.get('tipoModificacion').value;
    formIncapacidad.modifPatronal = this.formGroup.get('modificacion').value;

    if (this.getValidaDictamen()) {
      let dictamen: BitacoraDictamenDTO = new BitacoraDictamenDTO();
      dictamen.tipoDictamen = this.formGroup.get('tipoDictamen').value;
      dictamen.numFolio = this.formGroup.get('numFolio').value;
      dictamen.ubicacionArchivo = '';
      dictamen.activo = true;
      formIncapacidad.bitacoraDictamen = [dictamen];
    }

    // ******************  GUARDAMOS LOS CATALOGOS  ***********/
    console.log("LA FECHA DE fecAltaIncapacidad ====> " + JSON.stringify(formIncapacidad));
    if (!!this.diagnosticCodeSelected) {
      formIncapacidad.numCodigoDiagnostico = this.diagnosticCodeSelected.cveCatalogo;
      formIncapacidad.desCodigoDiagnostico = this.diagnosticCodeSelected.descCatalogo;
    }

    if (!!this.externalCauseSelected) {
      formIncapacidad.numCausaExterna = this.externalCauseSelected.cveCatalogo;
      formIncapacidad.desCausaExterna = this.externalCauseSelected.descCatalogo;
    }

    if (!!this.naturalezaSelected) {
      formIncapacidad.cveNaturaleza = this.naturalezaSelected.cveCatalogo;
      formIncapacidad.desNaturaleza = this.naturalezaSelected.descCatalogo;
    }

    // *********************** GUARDMOS LA DESCRIPCION DE RIESGO FISICO   *********************/

    if (this.formGroup.get('riesgoFisico').value != -1) {

      const riesgoNArray = this.riesgoFisicoCat.find(item => item.cveCatalogo === this.formGroup.get('riesgoFisico').value);

      if (riesgoNArray !== undefined) {
        formIncapacidad.desRiesgoFisico = riesgoNArray.descCatalogo;
      } else {
        formIncapacidad.desRiesgoFisico = null;
      }

    }
    console.log('______ LA DESCRIPCION DE RIESGO FISICO ES_____ ' + formIncapacidad.desRiesgoFisico);

    formIncapacidad.numRiesgoFisico = this.formGroup.get('riesgoFisico').value;

    // *********************** GUARDMOS LA DESCRIPCION DE ACTO INSEGURO   *********************/

    if (this.formGroup.get('actoInseguro').value !== undefined && this.formGroup.get('actoInseguro').value != -1) {

      const inseguroAArray = this.actoInseguroCat.find(item => item.cveCatalogo === this.formGroup.get('actoInseguro').value);
      if (inseguroAArray !== undefined) {
        formIncapacidad.desActoInseguro = inseguroAArray.descCatalogo;
      } else {
        formIncapacidad.desActoInseguro = null;
      }

    }
    console.log('______ LA DESCRIPCION DE ACTO INSEGURO _____ ' + formIncapacidad.desActoInseguro);

    formIncapacidad.numActoInseguro = this.formGroup.get('actoInseguro').value;

    this.info.incapacidadDTO = formIncapacidad;
    toForm.incapacidadDTO = this.info.incapacidadDTO;
    toForm.fecProcesoCarga = this.info.fecProcesoCarga;

    return toForm;
  }

  public disableSublimeButon() {
    this.disableSublime = true;
  }

  public cargueArchivo(event: any) {

    if (event !== undefined) {
      this.file = event.target.files[0];

      if (!this.validaTipoExtencion(this.file.name)) {
        this.showMessage('El archivo adjunto no cumple con el formato establecido. Favor de verificar e intentar nuevamente.', 'Informacion de solicitud');
        event.target.value = null;
        this.file = null;
      }

      var sizeArchivo = Number(this.file.size);
      var megaArchivo = sizeArchivo / 1024;
      if (megaArchivo > 1024) {
        this.showMessage('El archivo adjunto no cumple con el formato establecido. Favor de verificar e intentar nuevamente.', 'Informacion de solicitud');
        event.target.value = null;
        this.file = null;
      }
    }
  }

  public upload(origenAlta: string, nss: string, cveOrigenArchivo: string) {

    if (this.file && this.formGroup.get('tipoDictamen').value !== '-1') {

      this.spinner.show();

      const formData = new FormData();
      formData.append('file', this.file);

      this.reporteService.uploadFile(formData, origenAlta, nss, cveOrigenArchivo)
        .subscribe((response: any) => {
          switch (response.status) {
            case 200:
              this.limpiar();
              this.spinner.hide();
            case 206:
              this.limpiar();
              this.spinner.hide();
          }
        }, err => {
          this.spinner.hide();
          this.showMessage('Problemas con el servicio ' + err.message, 'Atención');
        }, () => {
          window.scrollTo(0, 600);
          this.spinner.hide();
        });

    }
  }

  public getValidaDictamen() {
    if (this.formGroup.get('tipoDictamen').value === -1) {
      return false;
    }

    if (this.formGroup.get('tipoDictamen').value === '-1') {
      return false;
    }

    if (this.showDictamen) {
      return true;
    }

    return false;
  }

  public validaTipoExtencion(name: any) {
    if (name.endsWith('png')) {
      return true;
    }

    if (name.endsWith('jpg')) {
      return true;
    }

    if (name.endsWith('pdf')) {
      return true;
    }

    return false;
  }

}
