import { Component, OnInit, AfterViewInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";

import * as _moment from "moment";
import { default as _rollupMoment } from "moment";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, Router } from "@angular/router";
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
import { Observable, Subscription, timer } from "rxjs";
import { ResponseDTO } from "src/app/casuistica/models/responseDTO";
import { TokenBody } from "src/app/common/models/security/tokenBody";
import { map } from "rxjs/operators";
import { validateOrigenAlta } from "src/app/common/functions/origenAlta.utils";
import { ConsultCasuistry } from "src/app/casuistica/services/saveMovement/consult-casuistry";
import {
  CalendarOptions,
  chargeBeginCalendar,
  chargeEndCalendar,
  months,
} from "src/app/common/utils/date-picker.util";
import {
  isApprover,
  isOperative,
} from "src/app/common/functions/user-type.utils";

declare var $: any;
@Component({
  selector: "app-search-records-ui",
  templateUrl: "./search-records-ui.component.html",
  styleUrls: ["./search-records-ui.component.scss"],
})
export class SearchRecordsUiComponent implements OnInit, AfterViewInit {
  // variables para la busqueda paginada
  public movimientosResponse: ResponseDTO<DetailSearchRecordsDTO[]> = {};
  private searchParams = new FormSearchRecords();

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
  public selected: DetailSearchRecordsDTO;
  public isNSS = null;
  public optionsAreVisible = false;

  public selectDelegacion: Delegacion[] = [];
  public selectSubDelegacion: SubDelegacion[] = [];
  public catalogoInput: GetCatalogs = new GetCatalogs();
  public catalogoInput2: GetCatalogs = new GetCatalogs();
  public catalogoInput3: GetCatalogs = new GetCatalogs();
  public catalogoInput4: GetCatalogs = new GetCatalogs();
  public catalogoInput5: GetCatalogs = new GetCatalogs();
  public catalogoInput6: GetCatalogs = new GetCatalogs();
  public catalogoInput7: GetCatalogs = new GetCatalogs();
  public fileTypeSelect: Catalogs[] = [];
  public catTipoRiesgo: Catalogs[] = [];
  public catConsecuencia: Catalogs[] = [];
  public catCasoRegistro: Catalogs[] = [];
  public catEstadoRegistro: Catalogs[] = [];
  public catSituacionRegistro: Catalogs[] = [];
  public catCampoSugerido = [
    { cveCatalogo: 1, descCatalogo: "Registro Patronal" },
    { cveCatalogo: 2, descCatalogo: "Número de seguridad social" },
  ];
  public formToMemory: any;
  public user: Login = new Login();
  public alcance;

  public visualizaPerfil2;
  titulo = "Realizar movimientos / Buscar movimientos";

  page = 1;
  pageSize = 7;
  previousPage: number;

  private isOperative = isOperative();
  private isApprover = isApprover();

  public loginOutput: Login = new Login();
  loginOutput2: Login = new Login();
  tokenBody: TokenBody = new TokenBody();
  public contador$: Observable<number>;
  private subscription: Subscription = new Subscription();

  private areCatalogsLoaded = [
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
  public muestraModal: boolean = false;

  // ******************    BORRAR   ***************************/
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
    private saveMovementService: ConsultCasuistry,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.muestraModal = params['id'];      
    });
    setTimeout(() => {
      this.spinner.show();
    }, 0);
    $(".modal-backdrop").hide();
    this.user = JSON.parse(localStorage.getItem("user"));
    this.formToMemory = JSON.parse(localStorage.getItem("form"));

    this.buildForm();
    this.chargeCalendar();

    this.chargeDelegation();
    if (this.user.userInfo.businessCategory !== null) {
      console.log('revisar ' + this.user.userInfo.businessCategory.toString());
      this.chargeSubDelegation(this.user.userInfo.businessCategory.toString());
    } else {
      this.areCatalogsLoaded[1] = true;
      this.validateIfCatalogsAreLoaded();
    }

    this.visualizaPerfil2 = this.securityService.visualizaPerfil2(this.user);
    localStorage.setItem('delegacionId', this.user.userInfo.businessCategory.toString());
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
          if (data?.length > 0) {
            this.selectSubDelegacion = data;
            this.filterDelegation(this.user);
          } else {
            this.selectSubDelegacion = [];
          }
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
        if (data?.length > 0) {
          this.selectDelegacion = data;
          this.filterDelegation(this.user);
          console.log(this.selectDelegacion);
        } else {
          this.selectDelegacion = [];
          length;
        }
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
  get subDelegationForm() {
    return this.formGroup.get("subDelegation") as FormControl;
  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      date: [],
      date2: [],
      delegation: [
        "-1",
        this.user.userInfo.businessCategory !== null
          ? Validators.compose([Validators.required, ValidateSelect])
          : "",
      ],
      subDelegation: [
        "-1",
        this.user.userInfo.departmentNumber !== null
          ? Validators.compose([Validators.required, ValidateSelect])
          : "",
      ],
      casoRegistro: ["-1"],
      fileTypeSelect: ["-1"],
      tipoRiesgo: ["-1"],
      consecuencia: [-1],
      estadoRegistroList: [""],
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
    });
  }

  public hideMessage() {
    $("#dialogMessage").modal("hide");
  }

  public search() {
    const valid = this.validateFormSearch();
    this.searchParams = new FormSearchRecords();
    this.clearResponse();
    this.page = 1;

    console.log("is valid: " + valid);
    if (valid === 1) {
      const result = this.formGroup.value;
      const arrayDate: string[] = result.date.split(" ");
      const arrayDate2: string[] = result.date2.split(" ");
      if (arrayDate.length > 0) {
        const fDate: Date = new Date(
          Date.parse(
            DateUtils.monthToEnglish(arrayDate[0].toString()) +
              "," +
              arrayDate[1]
          )
        );
        const toDate: Date = new Date(
          Date.parse(
            DateUtils.monthToEnglish(arrayDate2[0].toString()) +
              "," +
              arrayDate2[1]
          )
        );
        console.log(fDate.getMonth() + 1 + "-" + fDate.getFullYear());
        console.log(toDate.getMonth() + 1 + "-" + toDate.getFullYear());
        this.searchParams.fromMonth = fDate.getMonth() + 1 + "";
        this.searchParams.fromYear = fDate.getFullYear() + "";
        this.searchParams.toMonth = toDate.getMonth() + 1 + "";
        this.searchParams.toYear = toDate.getFullYear() + "";
      }

      this.searchParams.cveDelegacion =
        result.delegation.length <= 0 ? "" : result.delegation;
      this.searchParams.cveSubdelegacion =
        result.subDelegation.length <= 0 ? "" : result.subDelegation;
      this.searchParams.cveTipoRiesgo =
        result.tipoRiesgo.length <= 0 ? "-1" : result.tipoRiesgo;
      this.searchParams.cveConsecuencia =
        result.consecuencia.length <= 0 ? "-1" : result.consecuencia;
      this.searchParams.cveCasoRegistro =
        result.casoRegistro.length <= 0 ? "-1" : result.casoRegistro;
      this.searchParams.cveEstadoRegistroList =
        result.estadoRegistroList?.length <= 0
          ? undefined
          : result.estadoRegistroList;
      this.searchParams.campoSugerido =
        result.campoSugerido.length <= 0 ? "" : result.campoSugerido;
      this.searchParams.cveSituacionRegistro =
        result.situacionRegistro.length <= 0 ? "-1" : result.situacionRegistro;
      if (result.campoSugerido === "2") {
        this.searchParams.numNss = result.nss.length <= 0 ? "" : result.nss;
      } else {
        this.searchParams.refRegistroPatronal =
          result.registroPatronal.length <= 0 ? "" : result.registroPatronal;
      }
      console.log(this.searchParams);
      this.spinner.show();
      this.searchParams.origenAlta = validateOrigenAlta();
      this.searchParams.modificados = true;
      localStorage.setItem("form", JSON.stringify(this.formGroup.value));
      this.buscarMovmientosModificados(this.searchParams);
    } else {
      // this.showMessage('Ingresar datos requeridos.', 'Atención');
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
    this.movimientosResponse.data = [];
    this.movimientosResponse.page = undefined;
    this.movimientosResponse.size = undefined;
    this.movimientosResponse.totalElements = undefined;
    this.movimientosResponse.totalRows = undefined;
    this.movimientosResponse.totalElementsMovement = undefined;
    this.movimientosResponse.changesMinorThanMovements = undefined;
  }

  public showMessage(message: string, title: string) {
    console.log("showmessa");
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
    this.formGroup
      .get("date2")
      .setValue(meses[f.getMonth()] + " " + f.getFullYear());
    this.formGroup
      .get("date")
      .setValue(meses[f.getMonth()] + " " + f.getFullYear());
    this.formGroup.get("delegation").setValue("-1");
    this.formGroup.get("subDelegation").setValue("-1");
    this.formGroup.get("casoRegistro").setValue("-1");
    this.formGroup.get("fileTypeSelect").setValue("-1");
    this.formGroup.get("tipoRiesgo").setValue("-1");
    this.formGroup.get("consecuencia").setValue("-1");
    this.formGroup.get("estadoRegistroList").setValue("");
    this.formGroup.get("situacionRegistro").setValue("-1");
    this.formGroup.get("campoSugerido").setValue("-1");
    this.formGroup.get("registroPatronal").setValue("");
    this.formGroup.get("nss").setValue("");
    localStorage.removeItem("form");
    this.isNSS = null;
    if (this.user.userInfo.businessCategory !== null) {
      this.chargeSubDelegation(this.user.userInfo.businessCategory.toString());
    }
    this.clearResponse();
  }

  public validateFormSearch() {
    let result = 1;
    const res = this.formGroup.value;
    // tslint:disable-next-line: ban-types
    const arrayDate: string[] = res.date.split(" ");
    const arrayDate2: string[] = res.date2.split(" ");
    const fDate: Date = new Date(
      Date.parse(
        DateUtils.monthToEnglish(arrayDate[0].toString()) + "," + arrayDate[1]
      )
    );
    const toDate: Date = new Date(
      Date.parse(
        DateUtils.monthToEnglish(arrayDate2[0].toString()) + "," + arrayDate2[1]
      )
    );
    // tslint:disable-next-line: radix
    const anio = parseInt(arrayDate[1]);
    // tslint:disable-next-line: max-line-length
    const maxDate: Date = new Date(anio + 1, 2);
    console.log(fDate.getMonth() + 1 + "-" + fDate.getFullYear());
    console.log(toDate.getMonth() + 1 + "-" + toDate.getFullYear());

    if (
      this.formGroup.get("date").value === "" &&
      this.formGroup.get("date2").value === "" &&
      this.formGroup.get("casoRegistro").value === "" &&
      this.formGroup.get("fileTypeSelect").value === "" &&
      this.formGroup.get("tipoRiesgo").value === "" &&
      this.formGroup.get("consecuencia").value === "" &&
      this.formGroup.get("estadoRegistroList").value.length <= 0 &&
      this.formGroup.get("situacionRegistro").value === "" &&
      this.formGroup.get("campoSugerido").value === ""
    ) {
      this.showMessage("Por favor ingresa algun filtro", "Atención");
      result = 0;
    }

    if (
      (fDate === null && toDate === null) ||
      fDate === null ||
      toDate === null ||
      $("#fechaInicio3").val() === "" ||
      $("#fechaFin3").val() === ""
    ) {
      this.showMessage("Validar fechas ingresadas", "Atención");
      result = 0;
    }

    if (fDate > toDate) {
      this.showMessage("Fecha inicial mayor, favor de validar", "Atención");
      result = 0;
    }

    if (toDate > maxDate) {
      // tslint:disable-next-line: max-line-length
      this.showMessage(
        "La fecha hasta, solo puede ser maximo Marzo - " +
          maxDate.getFullYear(),
        "Atención"
      );
      $("#fechaFin3").datepicker("setDate", maxDate);
      result = 0;
    }

    // tslint:disable-next-line: max-line-length
    if (this.formGroup.get("campoSugerido").value === "1") {
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
    }

    // tslint:disable-next-line: max-line-length
    if (this.formGroup.get("campoSugerido").value === "2") {
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
    }

    if (!this.formGroup.valid) {
      this.showMessage("Ingresa datos requeridos", "Atención");
      result = 0;
    }

    return result;
  }

  public chargeCalendar() {
    const calendarOptions: CalendarOptions = {
      yearRange: new Date().getFullYear() - 30 + ":+3",
      dateFormat: "MM yy",
      showDays: false,
    };
    chargeBeginCalendar(
      "#fechaInicio3",
      this.toDateForm,
      this.fromDateForm,
      this.showMessage.bind(this),
      calendarOptions
    );
    chargeEndCalendar(
      "#fechaFin3",
      this.toDateForm,
      this.fromDateForm,
      this.showMessage.bind(this),
      calendarOptions
    );
    const f = new Date();
    this.formGroup
      .get("date2")
      .setValue(months[f.getMonth()] + " " + f.getFullYear());
    this.formGroup
      .get("date")
      .setValue(months[f.getMonth()] + " " + f.getFullYear());
  }

  ngAfterViewInit() {
    this.chargeCalendar();

    this.catalogoInput2.nameCatalog = "MccTipoArchivo";
    console.log(this.catalogoInput2);
    this.findCatalogo.find(this.catalogoInput2).subscribe(
      (data) => {
        // Success
        this.areCatalogsLoaded[2] = true;
        this.validateIfCatalogsAreLoaded();
        this.fileTypeSelect = data.body;
        console.log(this.fileTypeSelect);
      },
      (error) => {
        this.areCatalogsLoaded[2] = true;
        this.validateIfCatalogsAreLoaded();
        console.error(error);
      }
    );

    this.catalogoInput3.nameCatalog = "MccTipoRiesgo";
    console.log(this.catalogoInput3);
    this.findCatalogo.find(this.catalogoInput3).subscribe(
      (data) => {
        // Success
        this.areCatalogsLoaded[3] = true;
        this.validateIfCatalogsAreLoaded();
        if (data?.body?.length > 0) {
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
        } else {
          this.catTipoRiesgo = [];
          length;
        }
      },
      (error) => {
        this.areCatalogsLoaded[3] = true;
        this.validateIfCatalogsAreLoaded();
        console.error(error);
      }
    );

    this.catalogoInput4.nameCatalog = "MccConsecuencia";
    console.log(this.catalogoInput4);
    this.findCatalogo.find(this.catalogoInput4).subscribe(
      (data) => {
        // Success
        this.areCatalogsLoaded[4] = true;
        this.validateIfCatalogsAreLoaded();
        if (data?.body?.length > 0) {
          this.catConsecuencia = data.body;
          this.catConsecuencia = this.catConsecuencia.sort((a, b) => {
            if (a.cveCatalogo > b.cveCatalogo) {
              return 1;
            }
            if (a.cveCatalogo < b.cveCatalogo) {
              return -1;
            }
            return 0;
          });
          console.log(this.catConsecuencia);
        } else {
          this.catConsecuencia = [];
          length;
        }
      },
      (error) => {
        this.areCatalogsLoaded[4] = true;
        this.validateIfCatalogsAreLoaded();
        console.error(error);
      }
    );

    this.catalogoInput5.nameCatalog = "MccCasoRegistro";
    console.log(this.catalogoInput5);
    this.findCatalogo.find(this.catalogoInput5).subscribe(
      (data) => {
        // Success
        this.areCatalogsLoaded[5] = true;
        this.validateIfCatalogsAreLoaded();
        if (data?.body?.length > 0) {
          this.catCasoRegistro = data.body;
          console.log(this.catCasoRegistro);
        } else {
          this.catCasoRegistro = [];
          length;
        }
      },
      (error) => {
        this.areCatalogsLoaded[5] = true;
        this.validateIfCatalogsAreLoaded();
        console.error(error);
      }
    );

    this.catalogoInput6.nameCatalog = "MccEstadoRegistro";
    console.log(this.catalogoInput6);
    this.findCatalogo.find(this.catalogoInput6).subscribe(
      (data) => {
        // Success
        this.areCatalogsLoaded[6] = true;
        this.validateIfCatalogsAreLoaded();
        if (data?.body?.length > 0) {
          this.catEstadoRegistro = data.body;
          console.log(this.catEstadoRegistro);
        } else {
          this.catEstadoRegistro = [];
          length;
        }
      },
      (error) => {
        this.areCatalogsLoaded[6] = true;
        this.validateIfCatalogsAreLoaded();
        console.error(error);
      }
    );

    this.catalogoInput7.nameCatalog = "MccSituacionRegistro";
    console.log(this.catalogoInput7);
    this.findCatalogo.find(this.catalogoInput7).subscribe(
      (data) => {
        // Success
        this.areCatalogsLoaded[7] = true;
        this.validateIfCatalogsAreLoaded();
        if (data?.body?.length > 0) {
          this.catSituacionRegistro = data.body;
          console.log(this.catSituacionRegistro);
        } else {
          this.catSituacionRegistro = [];
          length;
        }
      },
      (error) => {
        this.areCatalogsLoaded[7] = true;
        this.validateIfCatalogsAreLoaded();
        console.error(error);
      }
    );

    this.formToMemory = JSON.parse(localStorage.getItem("form"));
    if (!!this.formToMemory) {
      this.areCatalogsLoaded[8] = false;
      if(this.formToMemory.delegation !== '-1'){
        this.chargeSubDelegation(this.formToMemory.delegation);
        this.spinner.show();
        setTimeout(() => {
          this.chargeToForm(this.formToMemory);
          this.searchParams = JSON.parse(localStorage.getItem("paginator"));
          this.movimientosResponse.changesMinorThanMovements =
            this.searchParams.changesMinorThanMovements;
          this.movimientosResponse.size = this.searchParams.size;
          this.page = this.searchParams.page;
          this.paginatorEvent(this.searchParams.page);
        }, 0);
      }
    }

    this.clearLocalStorage();
  }

  public selectSuggestion(clave: string) {
    if (clave === "1") {
      this.isNSS = true;
      this.formGroup.get("registroPatronal").setValue("");
    } else if (clave === "2") {
      this.isNSS = false;
      this.formGroup.get("nss").setValue("");
    } else {
      this.isNSS = null;
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

  public irDetalle(seleccionado: DetailSearchRecordsDTO) {
    localStorage.setItem("selected", JSON.stringify(seleccionado));
    this.router.navigate(["/recordsDetailUiComponent", {}]);
  }

  public clearLocalStorage() {
    localStorage.removeItem("detail");
    localStorage.removeItem("selected");
  }

  public chargeToForm(formToMemory: any) {
    if (formToMemory !== undefined && formToMemory !== null) {
      this.formGroup.get("date2").setValue(formToMemory.date2);
      this.formGroup.get("date").setValue(formToMemory.date);
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
      if (formToMemory.campoSugerido === "1") {
        this.isNSS = false;
        this.selectSuggestion("1");
        this.formGroup
          .get("registroPatronal")
          .setValue(formToMemory.registroPatronal);
      } else if (formToMemory.campoSugerido === "2") {
        this.isNSS = true;
        this.selectSuggestion("2");
        this.formGroup.get("nss").setValue(formToMemory.nss);
      } else {
        this.isNSS = null;
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
            this.formGroup
              .get("delegation")
              .setValue(
                this.formToMemory !== null
                  ? this.formToMemory.delegation.toString()
                  : this.user.userInfo.businessCategory.toString()
              );
          });
          this.formGroup
            .get("delegation")
            .setValidators(
              Validators.compose([Validators.required, ValidateSelect])
            );
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
          this.movimientosResponse.totalElements / this.movimientosResponse.size
        ) -
          6;
    }
    this.searchParams.page = page;
    this.searchParams.totalElements = this.movimientosResponse?.totalElements;
    this.searchParams.totalElementsMovement =
      this.movimientosResponse?.totalElementsMovement;
    this.searchParams.changesMinorThanMovements =
      this.movimientosResponse?.changesMinorThanMovements;
    this.buscarMovmientosModificados(this.searchParams);
  }

  private formatDateToISOInit(date: string): string {
    if (date) {
      return `${new Date(date).toISOString().substring(0, 10)}T07:00:00.000Z`;
    }
    return "";
  }

  public buscarMovmientos(formData: FormSearchRecords) {
    this.findMovements
      .getMovimientos(formData)
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
          this.spinner.hide();
          // this.mostrarTabla = true;
          switch (response.status) {
            case 200:
            case 206:
              this.movimientosResponse = response.body;
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
            this.movimientosResponse?.data === null ||
            this.movimientosResponse?.data?.length <= 0
          ) {
            this.showMessage(
              "No se encontraron resultados con los criterios ingresados",
              "Atención"
            );
          }
          else {
            if(this.muestraModal) {
              this.muestraModal = false;
              this.showMessage(
                "Operación exitosa",
                "Atención"
              );
            }
            this.hideMessage();              
          }
        },
        (err) => {
          this.spinner.hide();
          this.showMessage(
            "Problemas con el servicio " + err.message,
            "Atención"
          );
        },
        () => {
          // window.scrollTo(0, 600);
          this.spinner.hide();
        }
      );
  }

  public buscarMovmientosModificados(formData: FormSearchRecords) {
    formData.isOperative = this.isOperative;
    formData.isApprover = this.isApprover;
    formData.isCasuistry = false;
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
          this.areCatalogsLoaded[8] = true;
          this.validateIfCatalogsAreLoaded();
          switch (response.status) {
            case 200:
            case 206:
              this.movimientosResponse = response.body;
              formData.page = this.movimientosResponse?.page;
              formData.totalElements = this.movimientosResponse?.totalElements;
              formData.totalElementsMovement =
                this.movimientosResponse?.totalElementsMovement;
              formData.changesMinorThanMovements =
                this.movimientosResponse?.changesMinorThanMovements;
              formData.size = this.movimientosResponse?.size;
              localStorage.setItem("paginator", JSON.stringify(formData));
              if (this.movimientosResponse.page === 1) {
                this.hideLastPage =
                  1 <=
                  Math.floor(
                    this.movimientosResponse.totalElements /
                      this.movimientosResponse.size
                  ) -
                    6;
              }
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
            this.movimientosResponse?.data === null ||
            this.movimientosResponse?.data?.length <= 0
          ) {
            this.showMessage(
              "No se encontraron resultados con los criterios ingresados",
              "Atención"
            );
          }
          else {
            if(this.muestraModal) {
              this.muestraModal = false;
              this.showMessage(
                "Operación exitosa",
                "Atención"
              );
              this.hideMessage();
            }
          }
        },
        (err) => {
          this.areCatalogsLoaded[8] = true;
          this.validateIfCatalogsAreLoaded();
          this.showMessage(
            "Problemas con el servicio " + err.message,
            "Atención"
          );
        },
        () => {
          this.areCatalogsLoaded[8] = true;
          this.validateIfCatalogsAreLoaded();
        }
      );
  }

  //***********  VALIDACION 64 REPORTES  *********************/
  public fechaDentroAnioActual(fecha: any, tipoFecha: number) {
    //alert("FECHA DEL INPUT ,,,"+fecha);
    const fechaNow = new Date();
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

    //alert("LA FECHA ACTUAL"+fechaNow.getFullYear());
    const arrayDateAc: string[] = fecha.split(" ");

    const fDateInput: Date = new Date(
      Date.parse(
        DateUtils.monthToEnglish(arrayDateAc[0].toString()) +
          "," +
          arrayDateAc[1]
      )
    );

    const fechamMin = this.diasEnUnMes(fechaNow.getFullYear(), 0, 1);
    const fechamMax = this.diasEnUnMes(fechaNow.getFullYear() + 1, 2, 2);
    // alert(" LA FECHA Actual "+this.convertDate(fDateInput));

    if (fDateInput < fechamMin || fDateInput > fechamMax) {
      if (tipoFecha === 1) {
        this.formGroup
          .get("date")
          .setValue(meses[fechaNow.getMonth()] + " " + fechaNow.getFullYear());
      }
      if (tipoFecha === 2) {
        this.formGroup
          .get("date2")
          .setValue(
            meses[fechamMax.getMonth()] + " " + fechamMax.getFullYear()
          );
      }
      this.showMessage("Fuera del periodo 1 ", "Atención");
    }
  }

  public diasEnUnMes(año, mes, tipoAnio: number) {
    let retornoAnio = new Date();
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

  showOptions() {
    this.optionsAreVisible = true;
  }
}
