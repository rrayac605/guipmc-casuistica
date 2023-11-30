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
import { ValidationForm } from 'src/app/casuistica/models/validation/validationForm';
import { DetalleRegistroDTO } from 'src/app/casuistica/models/validation/detalleRegistroDTO';
import { IncapacidadDTO } from 'src/app/casuistica/models/incapacidadDTO';
import { AseguradosService } from 'src/app/casuistica/services/bdtu/asegurados.service';
import { ResponseWhareHouseValidation } from 'src/app/casuistica/models/validation/responseWharehouseValidation';
import { AlmacenesBuscarPatronService } from 'src/app/casuistica/services/validation/buscar-patron-almacenes.service';
import { PatronesService } from 'src/app/casuistica/services/bdtu/patrones.service';
import { DuplicateAltaValidationService } from 'src/app/casuistica/services/validation/duplicate-alta-validation.service';
import { Auditorias } from 'src/app/casuistica/models/auditorias';
import { SaveNewMovementService } from 'src/app/casuistica/services/saveMovement/save-new-movement.service';
import { LocalAltaValidationService } from 'src/app/casuistica/services/validation/local-alta-validation.service';
import { WharehouseValidationService } from 'src/app/casuistica/services/validation/wharehouse-validation.service';
import { debounceTime, distinctUntilChanged, map, filter, timeout, delay, switchMap } from 'rxjs/operators';
import { Observable, of, timer } from 'rxjs';
import { UpdateStatusDTO } from 'src/app/casuistica/models/update-status/updateStatusDTO';
import { SaveMovementService } from 'src/app/casuistica/services/saveMovement/save-movement.service';
import { DetailSearchRecordsDTO } from 'src/app/casuistica/models/search-records/detailSearchRecordsDTO';
import { FormSearchRecords } from 'src/app/casuistica/models/search-records/form-search-records';
import { SuceptibleValidationService } from 'src/app/casuistica/services/validation/suceptible-validation.service';
import { AseguradoMarcaAfiliatoriaService } from 'src/app/casuistica/services/asegurado-marca-afiliatoria.service';
import { AseguradoMarcaAfiliatoria } from 'src/app/casuistica/models/asegurado-marca-afiliatoria';

// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-create-casuistry-st-ui',
  templateUrl: './create-casuistry-st-ui.component.html',
  styleUrls: ['./create-casuistry-st-ui.component.scss']
})
export class CreateCasuistryStUiComponent implements OnInit, AfterViewInit {

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
    private saveNewMovementService: SaveNewMovementService,
    private saveMovementService: SaveMovementService,
    private wharehouseValidationService: WharehouseValidationService,
    private spinner: NgxSpinnerService,
    private suceptibleValidationService: SuceptibleValidationService,
    private aseguradoMarcaAfiliatoriaService: AseguradoMarcaAfiliatoriaService) {
  }

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
  public mostrarSi: boolean;
  public mostrarSiFinal: boolean;
  public insertado: boolean;
  public responseSearch: ResponseWhareHouseValidation;
  public responseWharehouseValidation: ResponseWhareHouseValidation;
  public showAutomatico: boolean;
  public showManual: boolean;

  public model: Catalogs;
  // ***************************************   CAUSA EXTERNA  ***************************************************
  public modelCausa: Catalogs;

  // ***************************************   GUARDA APROBACION  ***************************************************
  public cveIdAccionRegistroSI: number;
  public cveIdAccionRegistroNO: number;
  public responsUpdateStatus: string;
  public selectedItem: DetailSearchRecordsDTO;
  public detailSearchRecordsDTO: DetailSearchRecordsDTO[] = [];
  public hizoMatchCausa = '';

  public formDetalleReg: DetalleRegistroDTO;

  public isLoadingDiagnosticCode = false;
  public isSelectionDiagnosticCode = false;
  public diagnosticCodeSelected: Catalogs;

  public isLoadingNaturaleza = false;
  public isSelectionNaturaleza = false;
  public naturalezaSelected: Catalogs;

  public isLoadingExternalCause = false;
  public isSelectionExternalCause = false;
  public existeRelacionLaboral = false;
  public externalCauseSelected: Catalogs;

  public areCatalogsLoaded = [false, false, false, true, false, false, false, false];
  public responseSusValidacion: string[] = [];
  public pantalla: string = "salud";
  public tipoModificacion: Catalogs[] = []; //Atencion req modificacion patronal
  public modificacion: "";
  public aseguradoMarcaAfiliatoria: AseguradoMarcaAfiliatoria;
  public nssConMarcaAfiliatoria = false;
  public sinAds = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.spinner.show();
    }, 0);
    this.user = JSON.parse(localStorage.getItem('user'));
    this.formToMemory = JSON.parse(localStorage.getItem('form'));
    this.buildForm();
    this.showAutomatico = true;
    this.showManual = false;

    const self = this;

    $('#typeahead-prevent-manual-entryB').blur(() => {
      if (self.modelCausa === undefined) {
        self.hizoMatchCausa = 'Sin coincidencia';
        $('#typeahead-prevent-manual-entryB').val('');
      } else {
        self.hizoMatchCausa = ' ';
      }

    });
  }

  ngAfterViewInit() {
    this.chargeCalendar();
    this.setIdentificador();
    this.chargeDelegationAdscripcion();
    this.catalogosIncapacidad();
    this.obtenerRiesgoTrabajo();
  }

  public changeModificacion() {
    let control1 = null;
    control1 = this.formGroup.get('tipoModificacion');
    this.formGroup.get('modificacion').valueChanges
      .subscribe(value => {
        if (value === "true") {
          console.log(value);
          console.log(" SELECTED");
          control1.setValidators([Validators.compose([
            Validators.required,
            ValidateSelect
          ])])
          control1.updateValueAndValidity();
        } else {
          console.log("NOT SELECTED");
          control1.clearValidators();
          this.formGroup.get('tipoModificacion').setValue('-1');
          control1.updateValueAndValidity();
        }
      })
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
        this.tiposRiesgo = this.tiposRiesgo.sort(this.sortFunc);
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
        this.laudos = this.laudos.sort(this.sortFunc);
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
        Validators.required,
        ValidateSelect
      ])],
      subdelegacionNss: [-1, Validators.compose([
        Validators.required,
        ValidateSelect

      ])],
      umfAdscripcion: [-1, Validators.compose([
        Validators.required,
        ValidateSelect
      ])],
      delegacionAtencionNss: [-1, Validators.compose([])],
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
      medicoTratanteST: ['', Validators.compose([
        Validators.maxLength(9),
        Validators.pattern('[0-9]*')
      ])],
      matMedicoCDST: ['', Validators.compose([
        Validators.maxLength(9),
        Validators.pattern('[0-9]*')
      ])],
      tipoModificacion: [-1, Validators.compose([

      ])],

      modificacion: [-1, Validators.compose([
        Validators.maxLength(9),
        ValidateSelect
      ])]
    });

    this.handleConsecuenciaChange();
    this.handleCodigoDiagnosticoChanges();
    this.handleNaturalezaChanges();
    this.handleExternalCauseChanges();
    this.changeModificacion();
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
        this.formDiasSubsidiados.setValue('');
        this.formDiasSubsidiados.updateValueAndValidity();
        this.formPorcentajeIncapacidad.setValue(0);
        this.formPorcentajeIncapacidad.disable();
        this.formPorcentajeIncapacidad.updateValueAndValidity();
      } else if ((value > 1 || value !== '0' || value !== '1')
        && (this.formPorcentajeIncapacidad.disabled || this.formDiasSubsidiados.disabled)) {
        this.formDiasSubsidiados.enable();
        this.formDiasSubsidiados.setValue('');
        this.formDiasSubsidiados.updateValueAndValidity();
        this.formPorcentajeIncapacidad.enable();
        this.formPorcentajeIncapacidad.setValue('');
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
        this.riesgoFisicoCat = data.body;
        this.riesgoFisicoCat = this.riesgoFisicoCat.sort(this.sortFunc);
      },
      (error) => {
        this.areCatalogsLoaded[5] = true;
        this.validateIfCatalogsAreLoaded();
        console.error('....ERROR' + error);
      }
    );
    // ****************   ACTO INSEGURO    *************************/
    this.catalogoInput8.nameCatalog = 'MccActoInseguro';
    //  console.log("..... EMPIEZA EL ACTO INSEGURO ....");
    this.findCatalogo.find(this.catalogoInput8).subscribe(
      (data) => { // Success
        //   console.log(" ........EL SUCCES DE MccActoInseguro   "+JSON.stringify(data.body));
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

        this.ocupacionCat = data.body;
        this.ocupacionCat = this.ocupacionCat.sort(this.sortFunc);
      },
      (error) => {
        this.areCatalogsLoaded[7] = true;
        this.validateIfCatalogsAreLoaded();
        console.error('....ERROR' + error);
      }
    );
  }

  public obtenerCasoRegistro() {
    try {

      const fecha = new Date();
      const fechaProceso = new Date();
      const ftermino = this.formGroup.get('date4').value.split('/');
      const fechaFinal = this.obtenerFecha(ftermino);
      $('#anioCiclo').val(fechaFinal.getFullYear());
      fechaFinal.setDate(15);
      fechaFinal.setMonth(2);
      fechaFinal.setFullYear(fechaFinal.getFullYear() + 1);

      const fechaIni = this.formGroup.get('date3').value.split('/');
      const fechaInicial = this.obtenerFecha(fechaIni);
      fechaInicial.setDate(1);
      fechaInicial.setMonth(0);
      fechaInicial.setFullYear(fecha.getFullYear());
      if (fechaProceso >= fechaInicial && fechaProceso <= fechaFinal) {
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
        console.log('Accidente ===> ', fecAccidenteString);
        console.log('Proceso ===> ', fecProcesoString);
        if (fecAccidenteDate > fecProcesoDate) {
          console.log('Es mayor... agrega validacion');
          self.showMessage('La fecha de accidente no puede ser mayor a la fecha de proceso', 'Atención');
          self.fechaAccidente.setValue($('#fechaAltaCasu').val());
        }
        console.log(' ==> CERRAR date2');
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
    this.formGroup.markAllAsTouched();
    if (!this.sinAds && !this.formGroup.valid) {
      this.mostrarSi = false;
      this.showMessage('Ingresar datos requeridos.', 'Atención');
    } else {
      this.showMessage('¿Esta seguro que desea modificar la información?', 'Atención');
      this.mostrarSi = true;

    }
  }

  public showMessage(message: string, title: string) {
    console.log('showmessa');
    this.titDialogo = title;
    this.messDialogo = message;
    $('#dialogMessage').modal('show');
  }

  public guardarMovimientos(toForm: DetalleRegistroDTO) {
    // Validacion de duplicados
    const response: ResponseValidation[] = [];
    this.spinner.show();
    console.log('form guardar:' + toForm);
    this.mostrarSiFinal = true;
    this.saveNewMovementService.insertar(toForm).subscribe(
      (response: any) => {
        if (response.status !== null) {
          switch (response.status) {
            case 200:
            case 206:
              this.mostrarSi = true;
              this.insertado = true;
              this.formDetalleReg = response.body;
              this.showMessage('Guardado exitoso.', 'Atención');
              console.log(JSON.stringify(this.formDetalleReg));
              this.aprobarAlta();
              break;
            case 400:
            case 401:
              const responseValidation2: ResponseValidation[] = [];
              const tmp = new ResponseValidation();
              tmp.desCodigoError = 'Usuario no autorizado para guardar movimiento';
              responseValidation2[0] = tmp;
              this.responseValidation = this.responseValidation.concat(responseValidation2);
              this.showMessageV3('', 'Atención');
              this.spinner.hide();
              break;
            case 500:
            case 504:
              const responseValidation3: ResponseValidation[] = [];
              const tmp1 = new ResponseValidation();
              tmp1.desCodigoError = 'Servicio de inserción de movimientos no disponible.';
              responseValidation3[0] = tmp1;
              this.responseValidation = this.responseValidation.concat(responseValidation3);
              this.showMessageV3('', 'Atención');
              this.spinner.hide();
              break;
          }
        } else {
          this.mostrarSi = false;
          this.showMessage('Problemas con el servicio de inserción', 'Atención');
          this.spinner.hide();
        }
      }, err => {
      });
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
    toForm.aseguradoDTO.cveUmfExp = this.formGroup.get('umfExpedicion').value;
    console.log('form almacenes:' + toForm);
    this.duplicateAltaValidationService.validate(toForm).subscribe(
      (response: any) => {
        switch (response.status) {
          case 200:
          case 206:
            // this.spinner.hide();
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
              formDup.origenAlta = 'ST'; // Salud en el trabajo
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

  guardarAlta(formDup: DetalleRegistroDTO) {
    this.validarAlmacenes(formDup);
  }

  public siGuardar() {
    this.hideMessage('dialogMessage');
    this.guardar();
  }

  public siGuardarSinRelacionLaboral() {
    this.hideMessage('dialogMessageRelacionLaboral');
    // this.validarSuceptibles(this.formDetalleReg);
    this.validarSuceptibles(this.formDetalleReg);

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
    toForm.matMedTratante = this.formGroup.get('medicoTratanteST').value;
    toForm.matMedCDTS = this.formGroup.get('matMedicoCDST').value;
    // toForm.rp = this.formGroup.get('razonSocialPatron').value;
    toForm.tipoModificacion = this.formGroup.get('tipoModificacion').value;
    toForm.modificacion = this.formGroup.get('modificacion').value;
    this.spinner.show();
    console.log(toForm);
    this.localValidationService.validate(toForm).subscribe(
      (response: any) => {
        switch (response.status) {
          case 200:
          case 206:
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

              formDup.patronDTO = this.info.patronDTO;
              formIncapacidad.fecAccidente = this.obtenerFecha(ffacc);
              formIncapacidad.fecInicio = this.obtenerFecha(ffIni);
              formIncapacidad.fecAlta = this.obtenerFecha(ffalta);
              formIncapacidad.fecFin = this.obtenerFecha(ffalta);
              // console.log("");
              formIncapacidad.fecAltaIncapacidad = this.obtenerFecha(ffalta);
              formIncapacidad.numDiasSubsidiados = toForm.diasSubsidiados;
              formIncapacidad.porPorcentajeIncapacidad = toForm.procentaje;
              formIncapacidad.cveTipoRiesgo = toForm.tipoRiesgo;
              formIncapacidad.cveConsecuencia = toForm.consecuencia.toString();
              formIncapacidad.cveLaudo = parseInt(toForm.laudo).toString();
              formIncapacidad.numMatMedTratante = toForm.matMedTratante;
              formIncapacidad.numMatMedAutCdst = toForm.matMedCDTS;
              formIncapacidad.modifPatronal = toForm.modificacion;

              if (this.formGroup.get('modificacion').value) {
                console.log("Entró a asignar cve modif patronal")
                formIncapacidad.cveTipoModifPatronal = parseInt(toForm.tipoModificacion).toString();
              } else {
                console.log("No Entró a asignar cve modif patronal")

                formIncapacidad.cveTipoModifPatronal = parseInt(toForm.tipoModificacion).toString();

              }
              // ******************  GUARDAMOS LOS CATALOGOS  ***********/
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

              formIncapacidad.numRiesgoFisico = this.formGroup.get('riesgoFisico').value;
              if (this.formGroup.get('riesgoFisico').value !== -1) {
                const riesgoNArray = this.riesgoFisicoCat.find(item => item.cveCatalogo === this.formGroup.get('riesgoFisico').value);
                if (riesgoNArray !== undefined) {
                  formIncapacidad.desRiesgoFisico = riesgoNArray.descCatalogo;
                } else {
                  formIncapacidad.desRiesgoFisico = null;
                }
              }

              formIncapacidad.numActoInseguro = this.formGroup.get('actoInseguro').value;
              if (this.formGroup.get('actoInseguro').value !== -1) {
                const inseguroAArray = this.actoInseguroCat.find(item => item.cveCatalogo === this.formGroup.get('actoInseguro').value);
                if (inseguroAArray !== undefined) {
                  formIncapacidad.desActoInseguro = inseguroAArray.descCatalogo;
                } else {
                  formIncapacidad.desActoInseguro = null;
                }
              }

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
          this.spinner.hide();
          this.showMessage('Problemas con el servicio ' + err.message, 'Atención');
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
    console.log('cambiarRP: ' + tipo);
    if (tipo === 'auto') {
      this.buscarPatron();
    } else {
      this.buscarPatronManual();
    }

  }

  public buscarPatron() {
    const toForm: ValidationForm = new ValidationForm();
    toForm.nss = this.formGroup.get('nss').value;
    toForm.fechaAccidente = this.formGroup.get('date2').value;

    this.spinner.show();

    console.log(toForm);
    if (toForm.nss !== '' && toForm.fechaAccidente !== '') {
      this.almacenesBuscarPatronService.buscarPatron(toForm).subscribe(
        (response: any) => {
          switch (response.status) {
            case 200:
            case 206:
              this.responseSearch = response.body;
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
                this.showAutomatico = true;
                this.showManual = false;
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
                this.showAutomatico = false;
                this.showManual = true;
              }

              this.spinner.hide();
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
                this.showAutomatico = false;
                this.showManual = true;
                this.responseValidation = [];
                break;
              case 500:
              case 504:
                this.showAutomatico = false;
                this.showManual = true;
                this.responseValidation = [];
                break;
            }
          } else {
            this.showAutomatico = false;
            this.showManual = true;
          }
        });
    } else {
      this.spinner.hide();
    }

  }

  public buscarPatronManual() {
    const toForm: ValidationForm = new ValidationForm();

    toForm.rp = this.formGroup.get('registroPatronal').value;

    console.log(toForm);
    if (toForm.rp !== null && toForm.rp !== '') {
      this.responseValidation = [];
      this.spinner.show();
      this.patronesService.buscar(toForm).subscribe(
        (response: any) => {
          switch (response.status) {
            case 200:
            case 206:
              this.responseSearch = response.body;

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
              this.spinner.hide();
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
        });
    }
  }

  public validarAlmacenes(toFormGuardar: DetalleRegistroDTO) {
    const toForm: ValidationForm = new ValidationForm();
    this.spinner.show();
    console.log('form almacenes:' + toForm);
    toForm.rp = this.formGroup.get('registroPatronal').value;
    toForm.nss = this.formGroup.get('nss').value;
    toForm.cambioNss = 'true';
    toForm.cambioRp = 'true';
    toForm.fechaAccidente = this.formGroup.get('date2').value;
    if (this.formGroup.get('registroPatronal').value !== null &&
      this.formGroup.get('nss').value !== null &&
      this.formGroup.get('date2').value !== null &&
      this.formGroup.get('registroPatronal').value !== '' &&
      this.formGroup.get('nss').value !== '' &&
      this.formGroup.get('date2').value !== '') {
      this.wharehouseValidationService.validate(toForm).subscribe(
        (response: any) => {
          // this.spinner.hide();
          switch (response.status) {
            case 200:
            case 206:

              this.responseWharehouseValidation = response.body;
              if (response.body.bitacoraErroresDTO === null) {

                // this.guardarMovimientos(toFormGuardar);
                this.existeRelacionLaboral = true;
                const tmp1 = new ResponseValidation();

                if (this.formGroup.get('modificacion').value === 'true') {
                  tmp1.desCodigoError = 'No existe relación laboral del Número de Seguridad Social con el Registro Patronal, ¿Está seguro de continuar con el alta de la casuística?';
                  this.formDetalleReg = toFormGuardar;
                  this.mostrarSi = true;
                  this.showMessageRelacionLab(tmp1.desCodigoError, 'Atención');
                } else {
                  this.validarSuceptibles(toFormGuardar);

                }

              } else {
                this.existeRelacionLaboral = false;
                const tmp1 = new ResponseValidation();
                this.mostrarSiFinal = true;
                if (toFormGuardar.incapacidadDTO.cveLaudo === '1') { // Es laudo
                  // tslint:disable-next-line: max-line-length
                  tmp1.desCodigoError = 'No existe relación laboral del Número de Seguridad Social con el Registro Patronal, ¿Está seguro de continuar con el alta de la casuística?';
                  this.showMessageRelacionLab(tmp1.desCodigoError, 'Atención');
                } else {
                  this.mostrarSi = false;

                  if (this.formGroup.get('modificacion').value === 'true') {
                    tmp1.desCodigoError = 'No existe relación laboral del Número de Seguridad Social con el Registro Patronal, ¿Está seguro de continuar con el alta de la casuística?';
                    this.formDetalleReg = toFormGuardar;
                    this.mostrarSi = true;
                    this.showMessageRelacionLab(tmp1.desCodigoError, 'Atención');
                  } else {
                    this.mostrarSi = false;
                    tmp1.desCodigoError = 'No existe relación laboral del Número de Seguridad Social con el Registro Patronal';
                    this.showMessage(tmp1.desCodigoError, 'Atención');
                  }

                }
                this.formDetalleReg = toFormGuardar;
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
    if (toForm.nss != null && toForm.nss != '') {
      this.spinner.show();
      this.aseguradosService.buscar(toForm).subscribe(
        (response: any) => {
          console.log('EL RESPONSE ES === ' + JSON.stringify(response));
          console.log('EL RESPONSE 2 === ' + JSON.stringify(this.user.userInfo));
          switch (response.status) {
            case 200:
              this.responseSearch = response.body;
              this.info.aseguradoDTO = this.responseSearch.aseguradoDTO;
              var fechaBaja = this.responseSearch.aseguradoDTO.fechaBaja;
              if (this.responseSearch !== null && this.responseSearch !== undefined && this.responseSearch.aseguradoDTO !== null) {
                if (this.user.userInfo.businessCategory != null) {
                  nssValido = Number(this.user.userInfo.businessCategory) === Number(this.info.aseguradoDTO.cveDelegacionNss);
                  if (nssValido && this.user.userInfo.departmentNumber != null) {
                    nssValido = Number(this.user.userInfo.departmentNumber) === Number(this.info.aseguradoDTO.cveIdSubdelNss);
                  }
                } else if (this.user.userInfo.businessCategory === null && this.user.userInfo.departmentNumber === null) {
                  nssValido = true;
                }
                console.log('Misma delegacion: ' + nssValido);
                if (nssValido) {
                  this.formGroup.get('curp').setValue(this.info.aseguradoDTO.refCurp);
                  this.formGroup.get('nombre').setValue(this.info.aseguradoDTO.nomAsegurado);
                  this.formGroup.get('primerApellido').setValue(this.info.aseguradoDTO.refPrimerApellido);
                  this.formGroup.get('segundoApellido').setValue(this.info.aseguradoDTO.refSegundoApellido);
                  this.formGroup.get('delegacionNss').setValue(this.info.aseguradoDTO.cveDelegacionNss);
                  this.chargeSubDelegationAdscripcionAsegurado(this.info.aseguradoDTO.cveDelegacionNss);
                  console.log('chargeSubDelegationAdscripcionAsegurado');
                  if (fechaBaja !== null && fechaBaja !== '') {
                    this.showMessage('El NSS ingresado tiene inconsistencia en su información, favor de validar e ingresar el NSS correcto.', 'Atención');
                    this.mostrarSi = false;
                    this.limpiar();
                    this.responseValidation = [];
                  }
                } else {
                  this.mostrarSi = false;
                  this.showMessage('El Nss pertenece a otra delegación o subdelegación', 'Atención');
                  //this.limpiar();
                  this.responseValidation = [];
                }
                console.log('terminando el llenado');
              } else {
                //this.limpiar();
                this.responseValidation = this.responseValidation.concat(this.responseSearch.bitacoraErroresDTO);
                this.showMessageV3('', 'Atención');
              }
              this.spinner.hide();
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
    this.mostrarSiFinal = true;
    this.titDialogo = title;
    this.messDialogo = message;
    $('#dialogMessageV3').modal('show');
  }

  public limpiar() {
    this.formGroup.reset();
    this.chargeCalendar();
    this.setIdentificador();
    this.chargeDelegationAdscripcion();
    this.catalogosIncapacidad();
    this.mostrarSiFinal = true;
    $('#casoRegistro').val('');
    $('#anioCiclo').val('');
    this.formGroup.get('umfExpedicion').setValue(-1);
    this.formGroup.get('subdelagacionAtencionNss').setValue(-1);
    this.formGroup.get('delegacionAtencionNss').setValue(-1);
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

  public sortFunc = (a: Catalogs, b: Catalogs) => {
    if (a.cveCatalogo > b.cveCatalogo) {
      return 1;
    }
    if (a.cveCatalogo < b.cveCatalogo) {
      return -1;
    }
    return 0;
  }

  public updateStatusMovmientos(formData: UpdateStatusDTO) {
    this.saveMovementService.updateStatus(formData).subscribe(
      () => {
      }, err => {
        this.mostrarSi = false;
        this.showMessage('Se aprobó el alta con éxito', 'Atención');
        this.spinner.hide();
        this.limpiar();
      });
  }

  public buscarMovimientosCasuistica() {
    const form: FormSearchRecords = new FormSearchRecords();
    const day = new Date();
    form.fromMonth = String(day.getMonth());
    form.fromYear = String(day.getFullYear());
    form.toMonth = String(day.getMonth() + 1);
    form.toYear = String(day.getFullYear());
    form.numNss = this.info.aseguradoDTO.numNss;
    form.refRegistroPatronal = this.info.patronDTO.refRegistroPatronal;
    form.cveDelegacion = String(this.info.patronDTO.cveDelRegPatronal);
    form.cveSubdelegacion = String(this.info.aseguradoDTO.cveSubdelNss);
    form.cveSituacionRegistro = '2';
    form.rfc = this.info.patronDTO.desRfc;
    if (this.info.patronDTO.cveClase !== undefined && this.info.patronDTO.cveClase !== null) {
      form.cveClase = this.info.patronDTO.cveClase;
    }
    if (this.info.patronDTO.cveFraccion !== undefined && this.info.patronDTO.cveFraccion !== null) {
      form.cveFraccion = this.info.patronDTO.cveFraccion;
    }

    // console.log(JSON.stringify(form));
    this.spinner.show();
    this.aprobarAlta();
    // console.log(this.detailSearchRecordsDTO);
  }

  public aprobarAlta() {
    this.spinner.show();
    this.selectedItem = this.detailSearchRecordsDTO[0];
    // this.seleccionaAccion();
    this.cveIdAccionRegistroSI = 1; // Alta
    const updateForm: UpdateStatusDTO = new UpdateStatusDTO();
    updateForm.cveSituacionRegistro = '1'; // Aprobado
    updateForm.desObservaciones = this.formGroup.get('comentario').value;
    updateForm.numFolioMovtoOriginal = null;
    updateForm.numNss = this.formDetalleReg.aseguradoDTO.numNss;
    updateForm.objectId = this.formDetalleReg.objectIdOrigen;
    updateForm.cveCurp = this.user.userInfo.uid;
    updateForm.cveIdAccionRegistro = this.cveIdAccionRegistroSI; // Modificado

    this.updateStatusMovmientos(updateForm);
    // this.hideMessage();
    // this.mostrarSi = false;
    // this.mostrarRechazoSi = false;
  }

  public showMessageRelacionLab(message: string, title: string) {
    this.titDialogo = title;
    this.messDialogo = message;
    $('#dialogMessageRelacionLaboral').modal('show');
  }


  public siGuardarSUS() {
    this.hideMessage('dialogMessageSUS');
    this.guardarMovimientosSUS(this.formDetalleReg);
  }
  //********************  GUARDAMOS NUEVO COMO SUSEEPTIBLES ES  ***************/
  public guardarMovimientosSUS(toForm: DetalleRegistroDTO) {
    // Validacion de duplicados
    const response: ResponseValidation[] = [];
    this.spinner.show();
    console.log('form guardar:' + toForm);
    this.mostrarSiFinal = true;
    toForm.listaSuceptible = this.responseSusValidacion;
    toForm.origenPantalla = this.pantalla;
    const ffalta = this.formGroup.get('date4').value.split('/');
    toForm.incapacidadDTO.fecAlta = this.obtenerFecha(ffalta);
    toForm.incapacidadDTO.fecFin = this.obtenerFecha(ffalta);
    toForm.incapacidadDTO.numMatMedTratante = this.formGroup.get('medicoTratanteST').value;
    toForm.incapacidadDTO.numMatMedAutCdst = this.formGroup.get('matMedicoCDST').value;

    this.saveMovementService.insertarSus(toForm, this.pantalla).subscribe(
      (response: any) => {
        switch (response.status) {
          case 200:
            this.formDetalleReg = response.body;
            if (this.formDetalleReg !== null && this.formDetalleReg.objectIdOrigen !== null &&
              this.formDetalleReg.objectIdOrigen.length > 0) {
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
              break;
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

  validarSuceptibles(toFormGuardar: DetalleRegistroDTO) {
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
            console.log(" =====> EL TAMANIO ES " + this.responseSusValidacion.length);
            console.log(" ==> EN LA FUNCION VALIDAR SUCEPTIBLE 333" + JSON.stringify(toFormGuardar));
            if (this.responseSusValidacion.length > 0) {
              console.log(" =========>  AAAA SUS");
              toFormGuardar.listaSuceptible = this.responseSusValidacion;
              this.showMessageSUS("El nuevo registro de casuística es considerado como Susceptible de Ajuste, ¿Está seguro de continuar con el alta de la casuística?", 'Atención');
              this.formDetalleReg = toFormGuardar;
              console.log(" =========> ");
              console.log(" ==========>VALIDAMOS EL OBJETO A MANDAR A GUARDAR toFormGuardar =" + JSON.stringify(toFormGuardar));

              // this.guardarMovimientosSUS(toFormGuardar);
            } else {
              console.log(" =========>  BBBB MOV ");
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

  public showMessageSUS(message: string, title: string) {
    this.titDialogo = title;
    this.messDialogo = message;
    this.spinner.hide();
    $('#dialogMessageSUS').modal('show');
  }

}
