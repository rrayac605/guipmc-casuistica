import { Component, OnInit, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DetailSearchRecordsDTO } from 'src/app/casuistica/models/search-records/detailSearchRecordsDTO';
import { MovementsService } from 'src/app/casuistica/services/movements/movements.service';
import { FormSearchDetailRecords } from 'src/app/casuistica/models/records-detail/form-search-detail-records';
import { RecordsDetailInfo } from 'src/app/casuistica/models/records-detail/recordsDetailInfo';
import { Login } from 'src/app/common/models/security/login';
import { NgxSpinnerService } from 'ngx-spinner';
import { SecurityService } from 'src/app/common/services/security/security.service';
import { SaveMovementService } from 'src/app/casuistica/services/saveMovement/save-movement.service';
import { DatosPatronComponent } from 'src/app/common/components/datos-patron/datos-patron.component';
import moment from 'moment';
import { Moment } from 'moment';
import { ValidationForm } from 'src/app/casuistica/models/validation/validationForm';
import { AseguradosService } from 'src/app/casuistica/services/bdtu/asegurados.service';
import { ResponseWhareHouseValidation } from 'src/app/casuistica/models/validation/responseWharehouseValidation';
import { ResponseValidation } from 'src/app/casuistica/models/validation/responseValidation';
import { isApprover, isOperative } from 'src/app/common/functions/user-type.utils';
import { UpdateStatusDTO } from 'src/app/casuistica/models/update-status/updateStatusDTO';
import { Auditorias } from 'src/app/casuistica/models/auditorias';
import { timer } from 'rxjs';
import { ReporteService } from 'src/app/common/services/reportes/reporte.service';
import { RequestConsultDictamenSist } from 'src/app/common/models/reporte/RequestConsultDictamenSist';

declare var $: any;
@Component({
  selector: 'app-records-detail-ui',
  templateUrl: './records-detail-ui.component.html',
  styleUrls: ['./records-detail-ui.component.scss']
})

export class RecordsDetailUiComponent implements OnInit {
  public form: any;
  public details: DetailSearchRecordsDTO[] = [];
  public selectedItem: DetailSearchRecordsDTO;
  public formDetail: FormSearchDetailRecords = new FormSearchDetailRecords();
  public info: RecordsDetailInfo = new RecordsDetailInfo();
  public titDialogo: string;
  public messDialogo: string;
  public user: Login = new Login();
  public responseSearch: ResponseWhareHouseValidation;
  public responseValidation: ResponseValidation[] = [];
  public cveIdAccionRegistroSI: number;
  public cveIdAccionRegistroNO: number;
  public responsUpdateStatus: string;

  public isOperative = isOperative();
  public isApprover = isApprover();
  public validaDelegacion: boolean = false;
  public visualizaPerfil3;
  public visualizaPerfil4;
  public isBaja;
  public modificable = false;
  public titulo = 'Realizar movimientos / Consulta de movimientos';
  public registroPatroInput: string = "asdasdasd";
  @ViewChild(DatosPatronComponent) hijoPatron: DatosPatronComponent;

  public pdfContent: any;
  @ViewChild('pdfview') pdfview: ElementRef;
  @ViewChild('pdfviewSIST') pdfviewSIST: ElementRef;

  public blob: any;
  public showBtnDictamen: boolean = false;
  public ditamenName: string;
  public ditamenNameSIST: string;
  public strDescConsecuencia: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private findMovements: MovementsService,
    private spinner: NgxSpinnerService, private securityService: SecurityService,
    private saveMovementService: SaveMovementService,
    private aseguradosService: AseguradosService, private reporteServie: ReporteService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.selectedItem = JSON.parse(localStorage.getItem('selected'));
    this.form = JSON.parse(localStorage.getItem('form'));
    console.log('selected: ' + JSON.stringify(this.selectedItem));
    console.log('form: ' + this.form);

    this.formDetail.objectId = this.selectedItem.objectId;
    this.formDetail.numNss = this.selectedItem.numNss;
    this.formDetail.position = this.selectedItem.position;
    this.formDetail.numFolioMovtoOriginal = this.selectedItem.numFolioMovtoOriginal;
    this.formDetail.objectIdOrigen = this.info.objectIdOrigen;
    console.log('selected: ' + JSON.stringify(this.formDetail));
    if (this.selectedItem.isChange) {
      this.getDetalleModificado();
    } else {
      this.getDetalle();
    }
    this.clearLocalStorage();
    this.visualizaPerfil3 = this.securityService.visualizaPerfil3(this.user);
    console.log('visualizaPerfil3 --> ' + this.visualizaPerfil3);
    this.visualizaPerfil4 = this.securityService.visualizaPerfil4(this.user);
    console.log('visualizaPerfil4 --> ' + this.visualizaPerfil4);
    this.visualizaPerfil4 = this.visualizaPerfil4 && this.selectedItem.cveSituacionRegistro === 2;
    console.log('visualizaPerfil4 --> ' + this.visualizaPerfil4);
  }


  public regresar() {
    localStorage.setItem('form', JSON.stringify(this.form));
    this.router.navigate(['/searchRecords', {}]);
  }
  public modificar() {
    localStorage.setItem('form', JSON.stringify(this.form));
    localStorage.setItem('info', JSON.stringify(this.info));
    localStorage.setItem('selected', JSON.stringify(this.selectedItem));
    this.router.navigate(['/modifyRecords', {}]);
    console.log("Modificar----->", JSON.stringify(this.selectedItem));
  }
  public eliminar() {
    localStorage.setItem('form', JSON.stringify(this.form));
    localStorage.setItem('info', JSON.stringify(this.info));
    localStorage.setItem('selected', JSON.stringify(this.selectedItem));
    this.router.navigate(['/deleteCasuistry', {}]);
  }
  public aprobar() {
    localStorage.setItem('form', JSON.stringify(this.form));
    localStorage.setItem('selected', JSON.stringify(this.selectedItem));
    localStorage.setItem('info', JSON.stringify(this.info));
    this.router.navigate(['/approveModifications', {}]);
  }


  public aprobarSinCambiosConfirmacion() {
    this.showMessageConfirmAprobar('¿Está seguro que el registro considerado como Susceptible de ajuste no requiere ningún cambio?', "Confirmar sin cambios");
  }

  public confirmarSinCambiosConfirmacion() {
    this.showMessageConfirm('¿Está seguro que el registro considerado como Susceptible de ajuste no requiere ningún cambio?', "Confirmar sin cambios");
  }

  public confirmar() {
    this.cancelarConfirmar();
    this.seleccionaAccion();
    const updateForm: UpdateStatusDTO = new UpdateStatusDTO();
    if (this.selectedItem.cveSituacionRegistro == 2) {
      updateForm.cveSituacionRegistro = '1';
    }
    else {
      updateForm.cveSituacionRegistro = '2';
    }
    // Aprobado
    updateForm.numFolioMovtoOriginal = this.selectedItem.numFolioMovtoOriginal;
    updateForm.numNss = this.selectedItem.numNss;
    updateForm.objectId = this.selectedItem.objectId;
    updateForm.cveCurp = this.user.userInfo.uid;
    updateForm.cveIdAccionRegistro = this.cveIdAccionRegistroSI;//Modificado

    this.updateStatusMovmientos(updateForm);
  }

  public confirmarAprobar() {
    this.seleccionaAccion();
    const updateForm: UpdateStatusDTO = new UpdateStatusDTO();
    if (this.selectedItem.cveSituacionRegistro == 2) {
      updateForm.cveSituacionRegistro = '1';
    }
    else {
      updateForm.cveSituacionRegistro = '2';
    }
    // Aprobado
    updateForm.numFolioMovtoOriginal = this.selectedItem.numFolioMovtoOriginal;
    updateForm.numNss = this.selectedItem.numNss;
    updateForm.objectId = this.selectedItem.objectId;
    updateForm.cveCurp = this.user.userInfo.uid;
    updateForm.cveIdAccionRegistro = this.cveIdAccionRegistroSI;//Modificado

    this.aprobarSinCambios(updateForm);
    this.hideMessage();
  }

  public seleccionaAccion() {
    let ultimaAccion: Auditorias;
    if (!!this.info.auditorias && this.info.auditorias.length) {
      ultimaAccion = this.info.auditorias.filter(audit => !audit.fecBaja)?.[0];
    }
    if (this.selectedItem.cveSituacionRegistro == 2) {
      this.cveIdAccionRegistroSI = 11; // Alta
    }
    else {
      this.cveIdAccionRegistroSI = 12; // Alta
    }

  }

  public updateStatusMovmientos(formData: UpdateStatusDTO) {
    this.saveMovementService.guardarSinCambios(formData).subscribe(
      (response: any) => {
        switch (response.status) {
          case 200:
          case 204:
          case 206:
            this.responsUpdateStatus = response.body;
            localStorage.setItem('form', JSON.stringify(this.form));
            this.router.navigate(['/searchRecords/true', {}]);

            break;
          case 406:
            this.responsUpdateStatus = response.body;
            this.showMessage(this.responsUpdateStatus, 'Atención');
            break;
          case 504:
            this.responsUpdateStatus = response.body;
            this.showMessage(this.responsUpdateStatus, 'Atención');
            break;
          case 500:
            this.responsUpdateStatus = response.body;
            this.showMessage(this.responsUpdateStatus, 'Atención');
            break;
        }
        if (this.responsUpdateStatus === null || this.responsUpdateStatus === undefined) {
          this.showMessage('No se encontraron resultados con los criterios ingresados', 'Atención');
        }
      }, err => {
        localStorage.setItem('form', JSON.stringify(this.form));
        this.router.navigate(['/searchRecords/true', {}]);
      }, () => {
        this.spinner.hide();
      });
  }

  public aprobarSinCambios(formData: UpdateStatusDTO) {
    this.saveMovementService.aprobarSinCambios(formData).subscribe(
      (response: any) => {
        this.spinner.hide();
        // this.mostrarTabla = true;
        switch (response.status) {
          case 200:
          case 204:
          case 206:
            this.responsUpdateStatus = response.body;
            const contador$ = timer(2000);
            localStorage.setItem('form', JSON.stringify(this.form));
            this.router.navigate(['/searchRecords', {}]);

            break;
          case 406:
            this.responsUpdateStatus = response.body;
            this.showMessage(this.responsUpdateStatus, 'Atención');
            break;
          case 504:
            this.responsUpdateStatus = response.body;
            this.showMessage(this.responsUpdateStatus, 'Atención');
            break;
          case 500:
            this.responsUpdateStatus = response.body;
            this.showMessage(this.responsUpdateStatus, 'Atención');
            break;
        }
        if (this.responsUpdateStatus === null || this.responsUpdateStatus === undefined) {
          this.showMessage('No se encontraron resultados con los criterios ingresados', 'Atención');
        }
      }, err => {
        this.spinner.hide();
        localStorage.setItem('form', JSON.stringify(this.form));
        this.router.navigate(['/searchRecords', {}]);
      }, () => {
        this.spinner.hide();
      });
  }


  public cancelarConfirmar() {
    $('#dialogMessageConfirm').modal('hide');
  }

  public cancelarConfirmarAprobar() {
    $('#dialogMessageConfirmAprobar').modal('hide');
  }

  public showMessageConfirm(message: string, title: string) {
    console.log('showmessa');
    this.titDialogo = title;
    this.messDialogo = message;
    $('#dialogMessageConfirm').modal('show');
  }

  public showMessageResult(message: string, title: string) {
    console.log('showMessageResult');
    this.titDialogo = title;
    this.messDialogo = message;
    $('#dialogMessageResult').modal('show');
  }

  public hideMessageResult() {
    $('#dialogMessage').modal('hide');
  }

  public returnMoves() {
    this.hideMessageResult();
    localStorage.setItem('form', JSON.stringify(this.form));
    this.router.navigate(['/searchRecords', {}]);
  }

  public showMessageConfirmAprobar(message: string, title: string) {
    console.log('showmessa');
    this.titDialogo = title;
    this.messDialogo = message;
    $('#dialogMessageConfirmAprobar').modal('show');
  }


  public hideMessage() {
    $('#dialogMessage').modal('hide');
  }

  // localStorage.removeItem('tutorial');
  public showMessage(message: string, title: string) {
    console.log('showmessa');
    this.titDialogo = title;
    this.messDialogo = message;
    $('#dialogMessage').modal('show');
  }

  public clearLocalStorage() {
    localStorage.removeItem('detail');
    localStorage.removeItem('selected');
    localStorage.removeItem('form');
    localStorage.removeItem('info');

  }


  public getDetalle() {
    this.spinner.show();
    this.findMovements.getDetalleMovimientos(this.formDetail).subscribe(
      (response: any) => {
        this.spinner.hide();
        switch (response.status) {
          case 200:
          case 206:
            this.info = response.body;

            this.info.aseguradoDTO.nombreCompleto = `${this.info.aseguradoDTO.nomAsegurado ? this.info.aseguradoDTO.nomAsegurado : ""} ${this.info.aseguradoDTO.refPrimerApellido ? this.info.aseguradoDTO.refPrimerApellido : ""} ${this.info.aseguradoDTO.refSegundoApellido ? this.info.aseguradoDTO.refSegundoApellido : ""}`;
            this.updateDate();
            //RN 32 solo se pueden modificar nss de la delegacion en la que estas logueado
            this.strDescConsecuencia = this.getDescConsecuencia();
            this.buscarAsegurado();
            this.selectedItem.cveOrigenArchivo = response.body.cveOrigenArchivo;
            this.viewBtnDictamen()
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
        window.scrollTo(0, 600);
      });
  }

  public getDetalleModificado() {
    this.spinner.show();
    this.saveMovementService.getDetalleMovimientos(this.formDetail).subscribe(
      (response: any) => {
        this.spinner.hide();
        switch (response.status) {
          case 200:
          case 206:
            this.info = response.body;
            this.info.aseguradoDTO.nombreCompleto = `${this.info.aseguradoDTO.nomAsegurado ? this.info.aseguradoDTO.nomAsegurado : ""} ${this.info.aseguradoDTO.refPrimerApellido ? this.info.aseguradoDTO.refPrimerApellido : ""} ${this.info.aseguradoDTO.refSegundoApellido ? this.info.aseguradoDTO.refSegundoApellido : ""}`;
            this.updateDate();
            //RN 32 solo se pueden modificar nss de la delegacion en la que estas logueado    
            this.strDescConsecuencia = this.getDescConsecuencia();
            this.buscarAsegurado();
            this.changeTipoDictamen();
            this.selectedItem.cveOrigenArchivo = response.body.cveOrigenArchivo;
            this.viewBtnDictamen()
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
        window.scrollTo(0, 600);
      });
  }

  public updateDate() {
    if (this.info.incapacidadDTO.fecInicio !== null) {
      const f1: Moment = moment.utc(this.info.incapacidadDTO.fecInicio);
      this.info.incapacidadDTO.fecInicio = new Date(f1.year(), f1.month(), f1.date());
    }
    if (this.info.incapacidadDTO.fecAtencion !== null) {
      const f2: Moment = moment.utc(this.info.incapacidadDTO.fecAtencion);
      this.info.incapacidadDTO.fecAtencion = new Date(f2.year(), f2.month(), f2.date());
    }
    if (this.info.incapacidadDTO.fecAccidente !== null) {
      const f3: Moment = moment.utc(this.info.incapacidadDTO.fecAccidente);
      this.info.incapacidadDTO.fecAccidente = new Date(f3.year(), f3.month(), f3.date());
    }
    if (this.info.incapacidadDTO.fecIniPension !== null) {
      const f4: Moment = moment.utc(this.info.incapacidadDTO.fecIniPension);
      this.info.incapacidadDTO.fecIniPension = new Date(f4.year(), f4.month(), f4.date());
    }
    if (this.info.incapacidadDTO.fecAltaIncapacidad !== null) {
      const f5: Moment = moment.utc(this.info.incapacidadDTO.fecAltaIncapacidad);
      this.info.incapacidadDTO.fecAltaIncapacidad = new Date(f5.year(), f5.month(), f5.date());
    }
    if (this.info.incapacidadDTO.fecExpDictamen !== null) {
      const f6: Moment = moment.utc(this.info.incapacidadDTO.fecExpDictamen);
      this.info.incapacidadDTO.fecExpDictamen = new Date(f6.year(), f6.month(), f6.date());
    }
    if (this.info.incapacidadDTO.fecFin !== null) {
      const f7: Moment = moment.utc(this.info.incapacidadDTO.fecFin);
      this.info.incapacidadDTO.fecFin = new Date(f7.year(), f7.month(), f7.date());
    }
  }

  //Se remueve consumo servicios digitales para validacion mostrar botones
  public buscarAsegurado() {
    if (this.user !== null && this.info !== null) {
      if (this.user.userInfo !== null && this.info.aseguradoDTO !== null) {

        if (Number(this.info.aseguradoDTO.cveEstadoRegistro) == 10 || Number(this.info.aseguradoDTO.cveEstadoRegistro) == 11) {
          this.isBaja = false;
        } else {
          this.isBaja = true;
        }

        if (this.info.aseguradoDTO.sinUMF) {
          this.modificable = (Number(this.user.userInfo.businessCategory) === Number(this.info.patronDTO.cveDelRegPatronal))
            && (Number(this.user.userInfo.departmentNumber) === Number(this.info.patronDTO.cveSubDelRegPatronal));
        }
        else if (this.user.userInfo.businessCategory !== null && this.info.aseguradoDTO.cveDelegacionNss !== null) {
          this.modificable = Number(this.user.userInfo.businessCategory) === Number(this.info.aseguradoDTO.cveDelegacionNss);
        }
        else if (this.info.aseguradoDTO.cveDelegacionAtencion === null || this.info.aseguradoDTO.cveDelegacionAtencion === undefined
          && this.info.patronDTO.cveSubDelRegPatronal === null || this.info.patronDTO.cveSubDelRegPatronal === undefined) {
          if (this.user.userInfo.businessCategory !== null && this.info.patronDTO.cveDelRegPatronal !== null) {
            this.modificable = Number(this.user.userInfo.businessCategory) === Number(this.info.patronDTO.cveDelRegPatronal);
          }
        }
      }
    }
    this.modificarBotones(this.modificable);
  }

  public modificarBotones(permitido: boolean) {
    if (!permitido) {
      console.log("No permitido");
      $("#btnModificar").hide();
      $("#btnEliminar").hide();
      $("#btnAprobar").hide();
    }
    else {
      console.log("permitido");
      $("#btnModificar").show();
      $("#btnEliminar").show();
      $("#btnAprobar").show();
    }
  }

  public changeTipoDictamen() {
    if (this.validaDictamen()) {
      this.info.incapacidadDTO.bitacoraDictamen = this.info.incapacidadDTO.bitacoraDictamen.filter(bitacoraDictamen => bitacoraDictamen.activo);
    }
  }

  public getTipoDictamen() {
    if (this.validaDictamen()) {
      return this.info.incapacidadDTO.bitacoraDictamen.filter(bitacoraDictamen => bitacoraDictamen.activo)?.[0]?.tipoDictamen;
    }
    return ''
  }

  public getNombreDictamen() {
    if (this.validaDictamen()) {
      return this.info.incapacidadDTO.bitacoraDictamen.filter(bitacoraDictamen => bitacoraDictamen.activo)?.[0]?.nomArchivo;
    }
    return ''
  }

  public getNumeroDictamen() {
    if (this.validaDictamen()) {
      return this.info.incapacidadDTO.bitacoraDictamen.filter(bitacoraDictamen => bitacoraDictamen.activo)?.[0]?.numFolio;
    }
    return ''
  }

  public generar() {
    if (this.validaDictamen()) {
      this.spinner.show();
      this.ditamenName = this.info.incapacidadDTO?.bitacoraDictamen[0]?.nomArchivo + '';
      this.reporteServie.downloadDictamen(this.info.aseguradoDTO.numNss, this.ditamenName
      ).subscribe((response: any) => {
        if (response == null || response.status === 204) {
          this.showMessage("", 'No existe archivo');
          return;
        }
        var nomCompleto = this.getTipoArchivo(this.ditamenName);
        let content = response;
        this.pdfContent = URL.createObjectURL(this.b64toBlob2(content, nomCompleto));
        this.pdfview.nativeElement.setAttribute('data', this.pdfContent);
        this.showModalDictamen();
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
      });

    } else {
      this.showMessage('Archivo no disponible', 'Informacion de solicitud');
    }
  }

  public validaDictamen() {
    if (this.info.incapacidadDTO?.bitacoraDictamen === null || this.info.incapacidadDTO?.bitacoraDictamen === undefined) {
      return false;
    }

    if (this.info.incapacidadDTO?.bitacoraDictamen[0] === null && this.info.incapacidadDTO?.bitacoraDictamen[0] === undefined) {
      return false;
    }

    var name = this.info.incapacidadDTO.bitacoraDictamen.filter(bitacoraDictamen => bitacoraDictamen.activo)?.[0]?.nomArchivo;
    if (name === null || name === undefined) {
      return false;
    }

    return true;
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
    this.blob = new Blob(byteArrays, { type: contentType });
    return this.blob;
  }

  public showModalDictamen() {
    this.titDialogo = 'Dictamen';
    $('#modalFiles').modal('show');
  }

  public closeModal() {
    $('#modalFiles').modal('hide');
  }

  public showModalDictamenSIST() {
    this.titDialogo = 'Dictamen';
    $('#modalFilesSIST').modal('show');
  }

  public closeModalSIST() {
    $('#modalFilesSIST').modal('hide');
  }

  public getTipoArchivo(name: any) {
    if (name.endsWith('png')) {
      return 'image/png';
    }

    if (name.endsWith('jpg')) {
      return 'image/jpeg';
    }

    return 'application/pdf';
  }

  public imprimir() {
    const blobUrl = window.URL.createObjectURL((this.blob));
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
    iframe.contentWindow.print();
  }

  public downloadDictamen() {
    var elementA = document.createElement('a');
    elementA.href = URL.createObjectURL(this.blob);
    elementA.download = this.ditamenName;
    elementA.click();
  }

  public imprimirSIST() {
    const blobUrl = window.URL.createObjectURL((this.blob));
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
    iframe.contentWindow.print();
  }

  public downloadDictamenSIST() {
    var elementA = document.createElement('a');
    elementA.href = URL.createObjectURL(this.blob);
    elementA.download = this.ditamenNameSIST;
    elementA.click();
  }

  public viewBtnDictamen() {
    this.showBtnDictamen = this.validaBtnDictamen();
  }

  public validaBtnDictamen() {
    if (this.info?.cveOrigenArchivo === null && this.info?.cveOrigenArchivo === undefined) {
      return false;
    }

    if (this.info?.aseguradoDTO?.refFolioOriginal === undefined && this.info?.aseguradoDTO?.refFolioOriginal === null) {
      return false;
    }

    if (this.info.cveOrigenArchivo !== 'ST3') {
      return false;
    }

    let refFolio = this.info.aseguradoDTO.refFolioOriginal;
    if (refFolio.length != 17) {
      return false;
    }

    if (!Number(refFolio)) {
      return false;
    }

    return true;
  }

  public dictamen() {
    this.spinner.show();
    let req = new RequestConsultDictamenSist();
    req.numNss = this.info?.aseguradoDTO?.numNss;
    req.refFolioOriginal = this.info?.aseguradoDTO?.refFolioOriginal;
    req.objectIdOrigen = this.info.objectIdOrigen;
    this.reporteServie.downloadDictamenST3(req
    ).subscribe((response: any) => {
      if (response == null || response.status === 204 || response.status === 500) {
        this.showMessage('No existe archivo', 'Consulta dictamen');
        return;
      }

      if (response.body.codigo === 0) {
        var archivoBase = response.body.dictamen;
        this.pdfContent = URL.createObjectURL(this.b64toBlob2(archivoBase, 'application/pdf'));
        this.pdfviewSIST.nativeElement.setAttribute('data', this.pdfContent);
        this.ditamenNameSIST = response.body.nameArchivo;
        this.showModalDictamenSIST();
      } else {
        this.showMessage(response.body.mensaje, "Falla al obtener archivo");
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.showMessage(error.error.message, 'Atención');
    });
  }

  public getAccionRegistro() {
    var accionReg = this.info?.auditorias?.filter(auditoria => !auditoria.fecBaja)?.[0]?.desAccionRegistro;
    if (accionReg === null || accionReg === undefined) {
      return '';
    }

    return accionReg;
  }

  public getSituacionRegistro() {
    var situacionReg = this.info?.auditorias?.filter(auditoria => !auditoria.fecBaja)?.[0]?.desSituacionRegistro;
    if (situacionReg === null || situacionReg === undefined) {
      return '';
    }

    return situacionReg;
  }

  public getUsuarioModificador() {
    var usuarioModificador = this.info?.auditorias?.filter(auditoria => !auditoria.fecBaja)?.[0]?.nomUsuario;
    if (usuarioModificador === null || usuarioModificador === undefined) {
      return '';
    }

    return usuarioModificador;
  }

  public getEstadoResgistro() {
    var estadoReg = this.info?.aseguradoDTO?.desEstadoRegistro;
    if (estadoReg === null || estadoReg === undefined) {
      return '';
    }
    return estadoReg;
  }

  public getDescConsecuencia() {
    var cveConsecuencia = this.info?.incapacidadDTO?.cveConsecuencia;
    if (cveConsecuencia === null || cveConsecuencia === undefined) {
      return '';
    }
    
    if (Number(this.info.incapacidadDTO.cveConsecuencia) === 6) {
      return "Con Valuación inicial provisional posterior a la fecha de alta"
    }

    var descConsecuencia = this.info.incapacidadDTO.desConsecuencia;
    if (descConsecuencia === null || descConsecuencia === undefined) {
      return '';
    }

    return this.info.incapacidadDTO.desConsecuencia;
    
  }

}
