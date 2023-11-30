import { Component, OnInit, AfterViewInit, Input, Output } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";

import * as _moment from "moment";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { FormSearchRecords } from "src/app/casuistica/models/search-records/form-search-records";
import { DetailSearchRecordsDTO } from "src/app/casuistica/models/search-records/detailSearchRecordsDTO";

import { Delegacion } from "src/app/common/models/delegation.model";
import { SubDelegacion } from "src/app/common/models/subdelegation.model";
import { CatalogsService } from "src/app/common/services/catalogs/catalogs.service";
import { DelegationService } from "src/app/common/services/catalogs/delegation.service";
import { GetCatalogs } from "src/app/common/models/getcatalogs.model";
import { Catalogs } from "src/app/common/models/catalogs.model";
import { SubDelegationService } from "src/app/common/services/catalogs/sub-delegation.service";
import { MovementsService } from "src/app/casuistica/services/movements/movements.service";
import { Login } from "src/app/common/models/security/login";
import { NgxSpinnerService } from "ngx-spinner";
import { SecurityService } from "src/app/common/services/security/security.service";
import { ValidateSelect } from "src/app/common/validators/common.validator";
import { DateUtils } from "src/app/common/functions/DateUtils";
import { timer } from "rxjs";
import * as FileSaver from "file-saver";
import { ConsultCasuistry } from "src/app/casuistica/services/saveMovement/consult-casuistry";
import { ResponseDTO } from "src/app/casuistica/models/responseDTO";
import { map } from "rxjs/operators";
import { validateOrigenAlta } from "src/app/common/functions/origenAlta.utils";
import {
  CalendarOptions,
  chargeBeginCalendar,
  chargeEndCalendar,
  formatDateToString,
  months,
  validateCycleYearDays,
  validatePeriodDays,
} from "src/app/common/utils/date-picker.util";
import {
  isApprover,
  isOperative,
} from "src/app/common/functions/user-type.utils";

declare var $: any;
@Component({
  selector: "app-search-records-casuistry-ui",
  templateUrl: "./search-records-casuistry-ui.component.html",
  styleUrls: ["./search-records-casuistry-ui.component.scss"],
})
export class SearchRecordsCasuistryUiComponent
  implements OnInit, AfterViewInit
{
  public formGroup: FormGroup;

  public from: FormControl;
  public to: FormControl;
  public casoRegistro: FormControl;
  public delegacion: FormControl;
  public subdelagacion: FormControl;
  public registroPatronal: FormControl;
  public nss: FormControl;
  public titDialogo: string;
  public messDialogo: string;
  public cambiosResponse: ResponseDTO<DetailSearchRecordsDTO[]> = {};
  private searchParams = new FormSearchRecords();

  public selected: DetailSearchRecordsDTO;
  public isNSS: boolean;
  public isRP: boolean;
  public isRFC: boolean;
  public isClase: boolean;
  public isFraccion: boolean;
  public isLaudo: boolean;
  public tipoFechaConsulta: boolean;
  public tipoFechaProceso: boolean;
  public cargarCalendarios: boolean;
  public visualizarExportar: boolean;

  public selectDelegacion: Delegacion[] = [];
  public selectSubDelegacion: SubDelegacion[] = [];
  public catalogoInput: GetCatalogs = new GetCatalogs();
  public catalogoInput2: GetCatalogs = new GetCatalogs();
  public catalogoInput3: GetCatalogs = new GetCatalogs();
  public catalogoInput4: GetCatalogs = new GetCatalogs();
  public catalogoInput5: GetCatalogs = new GetCatalogs();
  public catalogoInput6: GetCatalogs = new GetCatalogs();
  public catalogoInput7: GetCatalogs = new GetCatalogs();
  public catalogoInput8: GetCatalogs = new GetCatalogs();
  public catalogoInput9: GetCatalogs = new GetCatalogs();
  public catalogoInput10: GetCatalogs = new GetCatalogs();
  public catalogoInput11: GetCatalogs = new GetCatalogs();
  public catTipoRiesgo: Catalogs[] = [];
  public catConsecuencia: Catalogs[] = [];
  public catCasoRegistro: Catalogs[] = [];
  public catEstadoRegistro: Catalogs[] = [];
  public catSituacionRegistro: Catalogs[] = [];
  public catAccionRegistro: Catalogs[] = [];
  public catLaudo: Catalogs[] = [];
  public catClase: Catalogs[] = [];
  public catFraccion: Catalogs[] = [];
  public catCampoSugerido = [
    { cveCatalogo: 1, descCatalogo: "Registro Patronal" },
    { cveCatalogo: 2, descCatalogo: "Número de seguridad social" },
  ];
  public formToMemory: any;
  public user: Login = new Login();
  public dataForReport: FormSearchRecords;

  private isOperative = isOperative();
  private isApprover = isApprover();

  public visualizaPerfil2;
  titulo = "/ Consultar casuística";

  private areCatalogsLoaded = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
  ];
  public hideLastPage = true;
  private firstTime = true;

  page = 1;
  pageSize = 7;
  previousPage: number;
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    private findDelegation: DelegationService,
    private findCatalogo: CatalogsService,
    private findSubDelegation: SubDelegationService,
    private findMovements: MovementsService,
    private spinner: NgxSpinnerService,
    private securityService: SecurityService,
    private saveMovementService: ConsultCasuistry
  ) {}

  ngOnInit(): void {
    console.log("estas dentro de ---> searchRecordsCasuistry  ");
    setTimeout(() => {
      this.spinner.show();
    }, 0);
    $(".modal-backdrop").hide();
    localStorage.setItem("btnRegresar", "false");
    this.user = JSON.parse(localStorage.getItem("user"));
    this.formToMemory = JSON.parse(localStorage.getItem("formCasuistry"));

    this.buildForm();

    this.chargeDelegation();
    if (this.user.userInfo.businessCategory !== null) {
      this.chargeSubDelegation(this.user.userInfo.businessCategory.toString());
    } else {
      this.areCatalogsLoaded[1] = true;
      this.validateIfCatalogsAreLoaded();
    }

    this.visualizaPerfil2 = this.securityService.visualizaPerfil2(this.user);
    this.visualizarExportar = false;
    if (
      localStorage.getItem("formCasuistry") !== undefined &&
      localStorage.getItem("formCasuistry") !== null
    ) {
      this.chargeSubDelegation(this.formToMemory.delegation);
      this.chargeToForm(this.formToMemory);
      this.search();
    }

    this.chargeCalendarProceso();
    this.chargeCalendarConsulta();
  }

  private validateIfCatalogsAreLoaded() {
    if (this.areCatalogsLoaded.reduce((prev, current) => prev && current)) {
      this.spinner.hide();
    }
  }

  public chargeSubDelegation(clave: string) {
    if(clave !== '-1'){
      this.findSubDelegation.find(clave).subscribe(
        (data) => {
          // Success
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
  }

  public chargeDelegation() {
    this.findDelegation.find().subscribe(
      (data) => {
        // Success
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

  get fromDateForm() {
    return this.formGroup.get("date") as FormControl;
  }
  get toDateForm() {
    return this.formGroup.get("date2") as FormControl;
  }
  get fromDateProcessForm() {
    return this.formGroup.get("date3") as FormControl;
  }
  get toDateProcessForm() {
    return this.formGroup.get("date4") as FormControl;
  }
  get subDelegationForm() {
    return this.formGroup.get("subDelegation") as FormControl;
  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      tipoFecha: [-1],
      date: [],
      date2: [],
      date3: [],
      date4: [],
      delegation: [-1],
      subDelegation: [-1],
      casoRegistro: ["-1"],
      tipoRiesgo: ["-1"],
      consecuencia: [-1],
      laudo: [-1, Validators.required],
      estadoRegistroList: [""],
      accionRegistro: ["-1"],
      situacionRegistro: ["-1"],
      campoSugerido: ["-1"],
      nss: [
        "",
        Validators.compose([
          Validators.minLength(11),
          Validators.maxLength(11),
          Validators.pattern("[0-9]*"),
        ]),
      ],
      registroPatronal: [
        "",
        Validators.compose([
          Validators.minLength(11),
          Validators.maxLength(11),
          Validators.pattern("[A-Za-z0-9]*"),
        ]),
      ],
      clase: ["-1", Validators.required],
      fraccion: ["-1", Validators.required],
      rfc: [
        "",
        Validators.compose([
          Validators.minLength(12),
          Validators.maxLength(13),
        ]),
      ],
    });
  }

  public hideMessage() {
    $("#dialogMessage").modal("hide");
  }

  public search() {
    const valid = this.validateFormSearch();
    this.searchParams = this.createDataToSearch();
    this.clearResponse();
    this.page = 1;
    if (valid === 1) {
      this.dataForReport = this.searchParams;
      console.log(this.searchParams);
      this.spinner.show();
      const result = this.formGroup.value;
      localStorage.setItem(
        "formCasuistry",
        JSON.stringify(this.formGroup.value)
      );
      this.buscarMovmientosModificados(this.searchParams);
    } else {
      // tslint:disable-next-line: max-line-length
      const meses = new Array(
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
      );
      const f = new Date();
      this.formGroup
        .get("date2")
        .setValue(meses[f.getMonth()] + " " + f.getFullYear());
      this.formGroup
        .get("date")
        .setValue(meses[f.getMonth()] + " " + f.getFullYear());
    }
  }

  private clearResponse() {
    this.cambiosResponse.data = [];
    this.cambiosResponse.page = undefined;
    this.cambiosResponse.size = undefined;
    this.cambiosResponse.totalElements = undefined;
    this.cambiosResponse.totalRows = undefined;
    this.cambiosResponse.totalElementsMovement = undefined;
    this.cambiosResponse.changesMinorThanMovements = undefined;
  }

  public createDataToSearch(): FormSearchRecords {
    const formData = new FormSearchRecords();
    const result = this.formGroup.value;
    let arrayDate: string[];
    let arrayDate2: string[];
    let fDate: Date = undefined;
    let toDate: Date = undefined ;
    if (result.tipoFecha === "1") {
      arrayDate = result.date.split(" ");
      arrayDate2 = result.date2.split(" ");
      fDate = new Date(
        Date.parse(
          DateUtils.monthToEnglish(arrayDate[0].toString()) + "," + arrayDate[1]
        )
      );
      toDate = new Date(
        Date.parse(
          DateUtils.monthToEnglish(arrayDate2[0].toString()) +
            "," +
            arrayDate2[1]
        )
      );
    } 
    
    if (result.tipoFecha === "2") {
      arrayDate = result.date3.split("/");
      arrayDate2 = result.date4.split("/");
      fDate = new Date();
      fDate.setDate(parseInt(arrayDate[0]));
      fDate.setMonth(parseInt(arrayDate[1]) - 1);
      fDate.setFullYear(parseInt(arrayDate[2]));
      toDate = new Date();
      toDate.setDate(parseInt(arrayDate2[0]));
      toDate.setMonth(parseInt(arrayDate2[1]) - 1);
      toDate.setFullYear(parseInt(arrayDate2[2]));
    } 

    if (fDate !== undefined && toDate !== undefined) {
      formData.fromMonth = fDate.getMonth() + 1 + "";
      formData.fromYear = fDate.getFullYear() + "";
      formData.toMonth = toDate.getMonth() + 1 + "";
      formData.toYear = toDate.getFullYear() + "";
      formData.toDay =
        (result.tipoFecha === "2" ? toDate.getDate() : null) + "";
      formData.fromDay =
        (result.tipoFecha === "2" ? fDate.getDate() : null) + "";
    }

    formData.origenAlta = validateOrigenAlta();
    formData.cveDelegacion =
      result.delegation.length <= 0 ? "" : result.delegation;
    formData.cveSubdelegacion =
      result.subDelegation.length <= 0 ? "" : result.subDelegation;
    formData.cveTipoRiesgo =
      result.tipoRiesgo.length <= 0 ? "-1" : result.tipoRiesgo;
    formData.cveConsecuencia =
      result.consecuencia.length <= 0 ? "-1" : result.consecuencia;
    formData.cveEstadoRegistroList =
      result.estadoRegistroList?.length <= 0
        ? undefined
        : result.estadoRegistroList;
    formData.cveSituacionRegistro =
      result.situacionRegistro.length <= 0 ? "-1" : result.situacionRegistro;
    formData.cveIdAccionRegistro =
      result.accionRegistro?.length <= 0 ? "-1" : result.accionRegistro;
    formData.cveCasoRegistro =
      result.casoRegistro.length <= 0 ? "-1" : result.casoRegistro;

    formData.campoSugerido =
      result.campoSugerido.length <= 0 ? "" : result.campoSugerido;
    switch (formData.campoSugerido) {
      case "1": {
        formData.refRegistroPatronal =
          result.registroPatronal.length <= 0 ? "" : result.registroPatronal;
        break;
      }
      case "2": {
        formData.numNss = result.nss.length <= 0 ? "" : result.nss;
        break;
      }
      case "3": {
        formData.rfc = result.rfc.length <= 0 ? "" : result.rfc;
        break;
      }
      case "4": {
        formData.cveClase = result.clase.length <= 0 ? "" : result.clase;
        break;
      }
      case "5": {
        formData.cveFraccion =
          result.fraccion.length <= 0 ? "" : result.fraccion;
        break;
      }
      case "6": {
        formData.cveLaudo = result.laudo.length <= 0 ? "" : result.laudo;
        break;
      }
      default: {
        break;
      }
    }

    if (result.tipoFecha === "-1") {
      formData.fromMonth = "";
      formData.fromYear = "";
      formData.toMonth = "";
      formData.toYear = "";
      formData.toDay = "";
      formData.fromDay = "";
    }

    return formData;
  }

  public showMessage(message: string, title: string) {
    this.titDialogo = title;
    this.messDialogo = message;
    $("#dialogMessage").modal("show");
  }

  public clear() {
    // tslint:disable-next-line: max-line-length
    const meses = new Array(
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre"
    );
    const f = new Date();
    this.tipoFechaConsulta = false;
    this.tipoFechaProceso = false;
    this.formGroup.get("tipoFecha").setValue(-1);
    this.formGroup.get("delegation").setValue("-1");
    this.formGroup.get("subDelegation").setValue("-1");
    this.formGroup.get("casoRegistro").setValue("-1");
    this.formGroup.get("tipoRiesgo").setValue("-1");
    this.formGroup.get("consecuencia").setValue(-1);
    this.formGroup.get("estadoRegistroList").setValue("");
    this.formGroup.get("situacionRegistro").setValue("-1");
    this.formGroup.get("campoSugerido").setValue("-1");
    this.formGroup.get("nss").setValue("");
    this.formGroup.get("registroPatronal").setValue("");
    this.formGroup.get("rfc").setValue("");
    this.formGroup.get("clase").setValue("-1");
    this.formGroup.get("fraccion").setValue("-1");
    this.formGroup.get("laudo").setValue("-1");
    this.formGroup.get("accionRegistro").setValue("-1");
    this.selectSuggestionTipoFecha("-1");
    this.setCampos("");
    this.visualizarExportar = false;
    localStorage.removeItem("formCasuistry");
    if (this.user.userInfo.businessCategory !== null) {
      this.chargeSubDelegation(this.user.userInfo.businessCategory.toString());
    }
    this.clearResponse();
  }

  public validateFormSearch() {
    let result = 1;
    const res = this.formGroup.value;

    let arrayDate: string[];
    let arrayDate2: string[];
    let fDate: Date;
    let toDate: Date;
    let maxDate: Date;
    let anio: number;
    if (res.tipoFecha === "1") {
      arrayDate = res.date.split(" ");
      arrayDate2 = res.date2.split(" ");
      fDate = new Date(
        Date.parse(
          DateUtils.monthToEnglish(arrayDate[0].toString()) + "," + arrayDate[1]
        )
      );
      toDate = new Date(
        Date.parse(
          DateUtils.monthToEnglish(arrayDate2[0].toString()) +
            "," +
            arrayDate2[1]
        )
      );
      anio = parseInt(arrayDate[1]);
      maxDate = new Date(anio + 1, 2);
    } else if (res.tipoFecha == "2") {
      arrayDate = res.date3.split("/");
      arrayDate2 = res.date4.split("/");
      fDate = new Date(
        Date.parse(
          arrayDate[0] + "/" + arrayDate[1].toString() + "/" + arrayDate[2]
        )
      );
      toDate = new Date(
        Date.parse(
          arrayDate[0] + "/" + arrayDate2[1].toString() + "/" + arrayDate2[2]
        )
      );
      anio = parseInt(arrayDate[1]);
      maxDate = new Date(anio + 1, 2);
    } else {
    }
    if (
      this.formGroup.get("tipoFecha").value === -1 &&
      this.formGroup.get("casoRegistro").value === "-1" &&
      this.formGroup.get("tipoRiesgo").value === "-1" &&
      this.formGroup.get("consecuencia").value === -1 &&
      this.formGroup.get("estadoRegistroList").value.length <= 0 &&
      this.formGroup.get("situacionRegistro").value === "-1" &&
      this.formGroup.get("accionRegistro").value === "-1" &&
      this.formGroup.get("campoSugerido").value === "-1"
    ) {
      this.showMessage("Por favor ingresa algun filtro", "Atención");
      result = 0;
    }

    if (this.formGroup.get("tipoFecha").value === 1) {
      if (
        (fDate === null && toDate === null) ||
        fDate === null ||
        toDate === null ||
        $("#fechaInicioConsulta").val() === "" ||
        $("#fechaFinConsulta").val() === ""
      ) {
        this.showMessage("Validar fechas ingresadas", "Atención");
        result = 0;
      }
    } else if (this.formGroup.get("tipoFecha").value === 2) {
      if (
        (fDate === null && toDate === null) ||
        fDate === null ||
        toDate === null ||
        $("#fechaInicioProceso").val() === "" ||
        $("#fechaFinProceso").val() === ""
      ) {
        this.showMessage("Validar fechas ingresadas", "Atención");
        result = 0;
      }

      if (fDate > toDate) {
        this.showMessage("Fecha inicial mayor, favor de validar", "Atención");
        result = 0;
      }
    }

    switch (this.formGroup.get("campoSugerido").value) {
      case "1": {
        if (
          this.formGroup.get("registroPatronal").value.length < 11 ||
          this.formGroup.get("registroPatronal").value === ""
        ) {
          this.showMessage(
            "La longitud del registro patronal debe ser de 11 caracteres",
            "Atención"
          );
          result = 0;
        } else if (this.formGroup.get("registroPatronal").status !== "VALID") {
          this.showMessage(
            "Registro patronal invalido, favor de verificar",
            "Atención"
          );
          result = 0;
        }
        break;
      }
      case "2": {
        if (
          this.formGroup.get("nss").value.length < 11 ||
          this.formGroup.get("nss").value === ""
        ) {
          this.showMessage(
            "La longitud del NSS debe ser de 11 caracteres",
            "Atención"
          );
          result = 0;
        } else if (this.formGroup.get("nss").status !== "VALID") {
          this.showMessage("NSS invalido, favor de verificar", "Atención");
          result = 0;
        }
        break;
      }
      case "3": {
        if (
          this.formGroup.get("rfc").value.length < 12 ||
          this.formGroup.get("rfc").value === ""
        ) {
          this.showMessage(
            "La longitud del RFC debe ser de 12 ó 13 caracteres",
            "Atención"
          );
          result = 0;
        } else if (this.formGroup.get("rfc").status !== "VALID") {
          this.showMessage("RFC invalido, favor de verificar", "Atención");
          result = 0;
        }
        break;
      }
      default: {
        break;
      }
    }

    if (!this.formGroup.valid) {
      this.showMessage("Ingresa datos requeridos", "Atención");
      result = 0;
    }

    return result;
  }

  public chargeCalendarConsulta() {
    chargeBeginCalendar(
      "#fechaInicioConsulta",
      this.toDateForm,
      this.fromDateForm,
      this.showMessage.bind(this)
    );
    chargeEndCalendar(
      "#fechaFinConsulta",
      this.toDateForm,
      this.fromDateForm,
      this.showMessage.bind(this)
    );
    const f = new Date();
    this.formGroup
      .get("date2")
      .setValue(months[f.getMonth()] + " " + f.getFullYear());
    this.formGroup
      .get("date")
      .setValue(months[f.getMonth()] + " " + f.getFullYear());
  }

  public chargeCalendarProceso() {
    const calendarOptions: CalendarOptions = {
      dateFormat: "dd/mm/yy",
      showDays: true,
    };
    chargeBeginCalendar(
      "#fechaInicioProceso",
      this.toDateProcessForm,
      this.fromDateProcessForm,
      this.showMessage.bind(this),
      calendarOptions,
      validateCycleYearDays,
      validatePeriodDays
    );
    chargeEndCalendar(
      "#fechaFinProceso",
      this.toDateProcessForm,
      this.fromDateProcessForm,
      this.showMessage.bind(this),
      calendarOptions,
      validateCycleYearDays,
      validatePeriodDays
    );
    const f = new Date();
    this.formGroup.get("date4").setValue(formatDateToString(f));
    this.formGroup.get("date3").setValue(formatDateToString(f));
  }

  ngAfterViewInit() {
    this.catalogoInput3.nameCatalog = "MccTipoRiesgo";
    this.findCatalogo.find(this.catalogoInput3).subscribe(
      (data) => {
        // Success
        this.areCatalogsLoaded[2] = true;
        this.validateIfCatalogsAreLoaded();
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
      },
      (error) => {
        this.areCatalogsLoaded[2] = true;
        this.validateIfCatalogsAreLoaded();
        console.error(error);
      }
    );

    this.catalogoInput4.nameCatalog = "MccConsecuencia";
    this.findCatalogo
      .find(this.catalogoInput4)
      .pipe(
        map((response) => ({
          ...response,
          body: response.body.sort(
            (cat1, cat2) => Number(cat1.cveCatalogo) - Number(cat2.cveCatalogo)
          ),
        }))
      )
      .subscribe(
        (data) => {
          // Success
          this.areCatalogsLoaded[3] = true;
          this.validateIfCatalogsAreLoaded();
          this.catConsecuencia = data.body;
        },
        (error) => {
          this.areCatalogsLoaded[3] = true;
          this.validateIfCatalogsAreLoaded();
          console.error(error);
        }
      );

    this.catalogoInput5.nameCatalog = "MccCasoRegistro";
    this.findCatalogo.find(this.catalogoInput5).subscribe(
      (data) => {
        // Success
        this.areCatalogsLoaded[4] = true;
        this.validateIfCatalogsAreLoaded();
        this.catCasoRegistro = data.body;
      },
      (error) => {
        this.areCatalogsLoaded[4] = true;
        this.validateIfCatalogsAreLoaded();
        console.error(error);
      }
    );

    this.catalogoInput6.nameCatalog = "MccEstadoRegistro";
    this.findCatalogo.find(this.catalogoInput6).subscribe(
      (data) => {
        // Success
        this.areCatalogsLoaded[5] = true;
        this.validateIfCatalogsAreLoaded();
        this.catEstadoRegistro = data.body;
      },
      (error) => {
        this.areCatalogsLoaded[5] = true;
        this.validateIfCatalogsAreLoaded();
        console.error(error);
      }
    );

    this.catalogoInput7.nameCatalog = "MccSituacionRegistro";
    this.findCatalogo.find(this.catalogoInput7).subscribe(
      (data) => {
        // Success
        this.areCatalogsLoaded[6] = true;
        this.validateIfCatalogsAreLoaded();
        this.catSituacionRegistro = data.body;
      },
      (error) => {
        this.areCatalogsLoaded[6] = true;
        this.validateIfCatalogsAreLoaded();
        console.error(error);
      }
    );

    this.catalogoInput8.nameCatalog = "MccAccionRegistro";
    this.findCatalogo.find(this.catalogoInput8).subscribe(
      (data) => {
        // Success
        this.areCatalogsLoaded[7] = true;
        this.validateIfCatalogsAreLoaded();
        this.catAccionRegistro = data.body;
      },
      (error) => {
        this.areCatalogsLoaded[7] = true;
        this.validateIfCatalogsAreLoaded();
        console.error(error);
      }
    );

    this.catalogoInput9.nameCatalog = "MccLaudo";
    this.findCatalogo.find(this.catalogoInput9).subscribe(
      (data) => {
        // Success
        this.areCatalogsLoaded[8] = true;
        this.validateIfCatalogsAreLoaded();
        this.catLaudo = data.body;
      },
      (error) => {
        this.areCatalogsLoaded[8] = true;
        this.validateIfCatalogsAreLoaded();
        console.error(error);
      }
    );

    this.catalogoInput10.nameCatalog = "MccClase";
    this.findCatalogo
      .find(this.catalogoInput10)
      .pipe(
        map((response) => ({
          ...response,
          body: response.body.sort(
            (cat1, cat2) => Number(cat1.cveCatalogo) - Number(cat2.cveCatalogo)
          ),
        }))
      )
      .subscribe(
        (data) => {
          // Success
          this.areCatalogsLoaded[9] = true;
          this.validateIfCatalogsAreLoaded();
          this.catClase = data.body;
        },
        (error) => {
          this.areCatalogsLoaded[9] = true;
          this.validateIfCatalogsAreLoaded();
          console.error(error);
        }
      );

    this.catalogoInput11.nameCatalog = "MccFraccion";
    this.findCatalogo
      .find(this.catalogoInput11)
      .pipe(
        map((response) => ({
          ...response,
          body: response.body.sort(
            (cat1, cat2) => Number(cat1.cveCatalogo) - Number(cat2.cveCatalogo)
          ),
        }))
      )
      .subscribe(
        (data) => {
          // Success
          this.areCatalogsLoaded[10] = true;
          this.validateIfCatalogsAreLoaded();
          this.catFraccion = data.body;
        },
        (error) => {
          this.areCatalogsLoaded[10] = true;
          this.validateIfCatalogsAreLoaded();
          console.error(error);
        }
      );
    this.formToMemory = JSON.parse(localStorage.getItem("formCasuistry"));
    if (!!this.formToMemory) {
      this.areCatalogsLoaded[11] = false;
      this.chargeSubDelegation(this.formToMemory.delegation);
      this.spinner.show();
      setTimeout(() => {
        this.chargeToForm(this.formToMemory);
        this.searchParams = JSON.parse(localStorage.getItem("paginador"));
        this.cambiosResponse.changesMinorThanMovements =
          this.searchParams.changesMinorThanMovements;
        this.cambiosResponse.size = this.searchParams.size;
        this.page = this.searchParams.page;
        this.paginatorEvent(this.searchParams.page);
      }, 0);
    }
  }

  public selectSuggestion(clave: string) {
    if (clave === "2") {
      this.setCampos("isNSS");
    } else if (clave === "1") {
      this.setCampos("isRP");
    } else if (clave === "3") {
      this.setCampos("isRFC");
    } else if (clave === "4") {
      this.setCampos("isClase");
    } else if (clave === "5") {
      this.setCampos("isFraccion");
    } else if (clave === "6") {
      this.setCampos("isLaudo");
    } else {
      this.setCampos("");
    }
  }

  public setCampos(campo: string) {
    this.isNSS = campo === "isNSS" ? true : false;
    this.isRP = campo === "isRP" ? true : false;
    this.isRFC = campo === "isRFC" ? true : false;
    this.isClase = campo === "isClase" ? true : false;
    this.isFraccion = campo === "isFraccion" ? true : false;
    this.isLaudo = campo === "isLaudo" ? true : false;
  }

  public selectSuggestionTipoFecha(tipoFecha: string) {
    if (tipoFecha === "1") {
      this.tipoFechaConsulta = true;
      this.tipoFechaProceso = false;
      $("#divFechaConsulta").collapse("show");
      $("#divFechaProceso").collapse("hide");
    } else if (tipoFecha === "2") {
      this.tipoFechaConsulta = false;
      this.tipoFechaProceso = true;
      $("#divFechaConsulta").collapse("hide");
      $("#divFechaProceso").collapse("show");
    } else {
      $("#divFechaConsulta").collapse("hide");
      $("#divFechaProceso").collapse("hide");
      this.chargeCalendarConsulta();
      this.chargeCalendarProceso();
      this.tipoFechaConsulta = false;
      this.tipoFechaProceso = false;
    }
  }

  public getError(controlName: string): string {
    let error = "";
    const control = this.formGroup.get(controlName);
    if (
      control.touched &&
      control.errors != null &&
      control.status !== "VALID"
    ) {
      // error = JSON.stringify(control.errors) + control.status;
      error = "Campo no valido";
    }
    return error;
  }

  public clearLocalStorage() {
    localStorage.removeItem("detail");
    localStorage.removeItem("selected");
  }

  public chargeToForm(formToMemory: any) {
    if (formToMemory !== undefined && formToMemory !== null) {
      if (formToMemory.tipoFecha && formToMemory.tipoFecha != "-1") {
        this.selectSuggestionTipoFecha(formToMemory.tipoFecha);
        this.formGroup.get("tipoFecha").setValue(formToMemory.tipoFecha);
        if (formToMemory.tipoFecha == 1) {
          this.formGroup.get("date2").setValue(formToMemory.date2);
          this.formGroup.get("date").setValue(formToMemory.date);
        } else {
          this.formGroup.get("date4").setValue(formToMemory.date4);
          this.formGroup.get("date3").setValue(formToMemory.date3);
        }
      }
      this.formGroup.get("delegation").setValue(formToMemory.delegation);
      this.formGroup.get("subDelegation").setValue(formToMemory.subDelegation);
      this.formGroup.get("casoRegistro").setValue(formToMemory.casoRegistro);
      this.formGroup.get("tipoRiesgo").setValue(formToMemory.tipoRiesgo);
      this.formGroup.get("consecuencia").setValue(formToMemory.consecuencia);
      this.formGroup
        .get("estadoRegistroList")
        .setValue(formToMemory.estadoRegistroList);
      this.formGroup
        .get("situacionRegistro")
        .setValue(formToMemory.situacionRegistro);
      this.formGroup.get("campoSugerido").setValue(formToMemory.campoSugerido);
      this.formGroup
        .get("accionRegistro")
        .setValue(
          formToMemory.accionRegistro != null
            ? formToMemory.accionRegistro
            : "-1"
        );
      switch (this.formGroup.get("campoSugerido").value) {
        case "1": {
          this.selectSuggestion("1");
          this.formGroup
            .get("registroPatronal")
            .setValue(formToMemory.registroPatronal);
          break;
        }
        case "2": {
          this.selectSuggestion("2");
          this.formGroup.get("nss").setValue(formToMemory.nss);
          break;
        }
        case "3": {
          this.selectSuggestion("3");
          this.formGroup.get("rfc").setValue(formToMemory.rfc);
          break;
        }
        case "4": {
          this.selectSuggestion("4");
          this.formGroup.get("clase").setValue(formToMemory.clase);
          break;
        }
        case "5": {
          this.selectSuggestion("5");
          this.formGroup.get("fraccion").setValue(formToMemory.fraccion);
          break;
        }
        case "6": {
          this.selectSuggestion("6");
          this.formGroup.get("laudo").setValue(formToMemory.laudo);
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  public filterDelegation(user: Login) {
    if (user !== null) {
      if (
        user.userInfo.businessCategory !== undefined &&
        user.userInfo.businessCategory !== null
      ) {
        const result = this.selectDelegacion.filter(
          (delegacion) => delegacion.id === user.userInfo.businessCategory
        );
        if (result.length > 0) {
        this.selectDelegacion = result;
          const contador = timer(700);
          contador.subscribe((n) => {
          });
        }
      }
      if (
        user.userInfo.departmentNumber !== undefined &&
        user.userInfo.departmentNumber !== null
      ) {
        const result = this.selectSubDelegacion.filter(
          (subDelegacion) => subDelegacion.id === user.userInfo.departmentNumber
        );
        if (result.length > 0) {
          this.selectSubDelegacion = result;
          const contador = timer(700);
          contador.subscribe((n) => {
            this.formGroup
              .get("subDelegation")
              .setValue(
                this.formToMemory !== null
                  ? this.formToMemory.subDelegation.toString()
                  : result[0].clave
              );
          });
          this.formGroup
            .get("subDelegation")
            .setValidators(
              Validators.compose([Validators.required, ValidateSelect])
            );
        }
      } else if (!!this.formToMemory && !!this.formToMemory.subDelegation) {
        const sub = this.selectSubDelegacion.filter(
          (subdel) => subdel.clave === this.formToMemory.subDelegation
        );
        setTimeout(() => {
          this.subDelegationForm.setValue(
            sub && sub.length ? sub[0].clave : "-1"
          );
        }, 0);
      }
    }
  }

  public paginatorEvent(page: number) {
    this.spinner.show();
    if (
      this.firstTime &&
      !!this.searchParams &&
      !!this.searchParams.totalElements &&
      !!this.searchParams.size
    ) {
      this.hideLastPage =
        page <=
        Math.floor(this.searchParams.totalElements / this.searchParams.size) -
          6;
      this.firstTime = false;
    } else {
      this.hideLastPage =
        page <=
        Math.floor(
          this.cambiosResponse.totalElements / this.cambiosResponse.size
        ) -
          6;
    }
    this.searchParams.page = page;
    this.searchParams.totalElements = this.cambiosResponse?.totalElements;
    this.searchParams.totalElementsMovement =
      this.cambiosResponse?.totalElementsMovement;
    this.searchParams.changesMinorThanMovements =
      this.cambiosResponse?.changesMinorThanMovements;
    this.buscarMovmientosModificados(this.searchParams);
  }

  private formatDateToISOInit(date: string): string {
    if (date) {
      return `${new Date(date).toISOString().substring(0, 10)}T07:00:00.000Z`;
    }
    return "";
  }

  public buscarMovmientosModificados(formData: FormSearchRecords) {
    formData.isOperative = this.isOperative;
    formData.isApprover = this.isApprover;
    formData.isCasuistry = true;
    this.saveMovementService
      .getCambiosMovimientos(formData)
      .pipe(
        map((response: any) => {
          if (response?.body?.data) {
            response.body.data = response.body.data.map((movimiento) => {
              return {
                ...movimiento,

                fecInicio: movimiento.fecInicio,
                fecFin: movimiento.fecFin,
              };
            });
          }
          return response;
        })
      )
      .subscribe(
        (response: any) => {
          this.areCatalogsLoaded[11] = true;
          this.validateIfCatalogsAreLoaded();
          switch (response.status) {
            case 200:
            case 206:
              this.cambiosResponse = response.body;
              formData.page = this.cambiosResponse?.page;
              formData.totalElements = this.cambiosResponse?.totalElements;
              formData.totalElementsMovement =
                this.cambiosResponse?.totalElementsMovement;
              formData.changesMinorThanMovements =
                this.cambiosResponse?.changesMinorThanMovements;
              formData.size = this.cambiosResponse?.size;
              localStorage.setItem("paginador", JSON.stringify(formData));
              if (this.cambiosResponse.page === 1) {
                this.hideLastPage =
                  1 <=
                  Math.floor(
                    this.cambiosResponse.totalElements /
                      this.cambiosResponse.size
                  ) -
                    6;
              }
              this.visualizarExportar = true;
              break;
            case 204:
              this.clearResponse();
              break;
            case 504:
              this.clearResponse();
              break;
            case 500:
              this.clearResponse();
              break;
          }
          if (
            this.cambiosResponse?.data === null ||
            this.cambiosResponse?.data?.length <= 0
          ) {
            this.visualizarExportar = false;
            this.showMessage(
              "No se encontraron resultados con los criterios ingresados",
              "Atención"
            );
          }
        },
        (err) => {
          this.areCatalogsLoaded[11] = true;
          this.validateIfCatalogsAreLoaded();
          this.visualizarExportar = false;
          this.showMessage(
            "Problemas con el servicio " + err.message,
            "Atención"
          );
        },
        () => {
          this.areCatalogsLoaded[11] = true;
          this.validateIfCatalogsAreLoaded();
        }
      );
  }

  public irDetalle(seleccionado: DetailSearchRecordsDTO) {
    localStorage.setItem("selectedCasuistry", JSON.stringify(seleccionado));
    //localStorage.setItem('formCasuistry', JSON.stringify(this.formGroup.value));
    this.router.navigate(["/consultCasuistry", {}]);
  }

  public reporte() {
    if (this.cambiosResponse?.totalElements > 400) {
      $("#dialogMessageReporteMuyLargo").modal("show");
    } else {
      this.showMessageReporte(
        "Elija el formato en que desea descargar el reporte actual",
        "Atención"
      );
    }
  }

  public hideMessageReporteMuyLargo() {
    $("#dialogMessageReporteMuyLargo").modal("hide");
  }

  public showMessageReporte(message: string, title: string) {
    this.titDialogo = title;
    this.messDialogo = message;
    $("#dialogMessageReporte").modal("show");
  }

  public hideMessageReporte() {
    $("#dialogMessageReporte").modal("hide");
  }

  public downloadXlsReport() {
    this.dataForReport.isOperative = this.isOperative;
    this.dataForReport.isApprover = this.isApprover;
    this.dataForReport.isCasuistry = true;
    this.spinner.show();
    this.saveMovementService.getExportar2(
      this.dataForReport,
      this.spinner,
      "consultaGeneralCasuistica.xlsx"
    );
    this.hideMessageReporte();
  }

  public downloadFile = (data, contentType) => {
    const fileName = "consultaGeneralCasuistica.xlsx";
    FileSaver.saveAs(data.body, fileName);
  };

  public downloadPDFReport() {
    this.dataForReport.isCasuistry = true;
    console.log("dataReport: ", this.dataForReport);
    this.spinner.show();
    this.dataForReport.desDelegacion =
      this.dataForReport?.cveDelegacion &&
      this.dataForReport?.cveDelegacion !== "-1"
        ? this.selectDelegacion?.find(
            (del) =>
              del.clave ===
              (this.dataForReport.cveDelegacion as unknown as number)
          )?.descripcion
        : undefined;
    this.dataForReport.desSubdelegacion =
      this.dataForReport?.cveSubdelegacion &&
      this.dataForReport?.cveSubdelegacion !== "-1"
        ? this.selectSubDelegacion?.find(
            (subDel) =>
              subDel.clave ===
              (this.dataForReport.cveSubdelegacion as unknown as number)
          )?.descripcion
        : undefined;
    this.saveMovementService
      .reporteGeneralCasuisticaPDF(this.dataForReport)
      .subscribe(
        (data) => {
          // Success
          this.spinner.hide();
          this.hideMessageReporte();
          const contentType = "application/pdf";
          this.b64toBlob(data, contentType);
          this.hideMessageReporte();
        },
        (error) => {
          const contentType = "application/pdf";
          this.b64toBlob(error.error.text, contentType);
          this.spinner.hide();
          this.hideMessageReporte();
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
    const fileName = "ConsultaGeneralCasuistica.pdf";
    FileSaver.saveAs(blob, fileName);
  };

  public diasEnUnMes(año, mes, tipoAnio: number) {
    let retornoAnio = new Date();
    if (tipoAnio === 1) {
      const dia = 15;
      retornoAnio = new Date(año, mes, 1);
    }
    if (tipoAnio === 2) {
      const dia = 15;
      // alert("ANTRA A MAYOR ");
      retornoAnio = new Date(año, mes, 31);
    }

    return new Date(año, mes, 1);
  }
}
