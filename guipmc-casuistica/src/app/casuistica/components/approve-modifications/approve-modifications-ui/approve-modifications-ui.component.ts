import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DetailSearchRecordsDTO } from 'src/app/casuistica/models/search-records/detailSearchRecordsDTO';
import { FormSearchDetailRecords } from 'src/app/casuistica/models/records-detail/form-search-detail-records';
import { RecordsDetailInfo } from 'src/app/casuistica/models/records-detail/recordsDetailInfo';
import { Login } from 'src/app/common/models/security/login';
import { NgxSpinnerService } from 'ngx-spinner';
import { SaveMovementService } from 'src/app/casuistica/services/saveMovement/save-movement.service';
import { SecurityService } from 'src/app/common/services/security/security.service';
import { UpdateStatusDTO } from 'src/app/casuistica/models/update-status/updateStatusDTO';
import { timer } from 'rxjs';
import { Auditorias } from 'src/app/casuistica/models/auditorias';
import { ReporteService } from 'src/app/common/services/reportes/reporte.service';
import { RequestConsultDictamenSist } from 'src/app/common/models/reporte/RequestConsultDictamenSist';
// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-approve-modifications-ui',
  templateUrl: './approve-modifications-ui.component.html',
  styleUrls: ['./approve-modifications-ui.component.scss']
})
export class ApproveModificationsUiComponent implements OnInit {
  public formGroup: FormGroup;
  public titDialogo: string;
  public messDialogo: string;
  // mostramos el boton de si en Modal de aporbar
  public mostrarSi: boolean;
  // mostramos el boton de si en Modal de rechazar
  public mostrarRechazoSi: boolean;

  public isDisabledConfirmar: boolean = false;

  public form: any;
  public details: DetailSearchRecordsDTO[] = [];
  public selectedItem: DetailSearchRecordsDTO;
  public formDetail: FormSearchDetailRecords = new FormSearchDetailRecords();
  public info: RecordsDetailInfo = new RecordsDetailInfo();
  public user: Login = new Login();
  public comentario: string;
  public responsUpdateStatus: string;
  public cveIdAccionRegistroSI: number;
  public cveIdAccionRegistroNO: number;
  public titulo = 'Realizar movimientos/Aprobar movimientos';

  public pdfContent: any;
  @ViewChild('pdfview') pdfview: ElementRef;
  public showBtnDictamen: boolean = false;
  public ditamenName: string;
  public blob: any;

  constructor(private formBuilder: FormBuilder,
    private modalService: NgbModal, private router: Router, private route: ActivatedRoute, private spinner: NgxSpinnerService,
    private securityService: SecurityService, private saveMovementService: SaveMovementService,
    private reporteService: ReporteService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.buildForm();
    this.selectedItem = JSON.parse(localStorage.getItem('selected'));
    this.form = JSON.parse(localStorage.getItem('form'));
    this.info = JSON.parse(localStorage.getItem('info'));
    this.viewBtnDictamen();
    this.clearLocalStorage();
  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      comentarioAprobador: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(250),
        Validators.pattern('[A-Za-z0-9\\\s\\\u00f1\\\u00d1áéíóúÁÉÍÓÚàèìòùÀÈÌÒÙ\\\°\\\!\\\”#$%&\\\/\\\(\\\)=?¡*\\\¨\\\]\\\[\\\}\\\{\\\-,.:;\\\<\\\>\\\+]+$')
      ])],
    });
  }

  public aprobarMovimiento() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      this.showMessage('Ingresar datos requeridos.', 'Atención');
      this.mostrarSi = false;
      this.mostrarRechazoSi = false;
    } else {
      this.showMessage('¿Esta seguro que desea aprobar el registro?', 'Atención');
      this.mostrarSi = true;
      this.mostrarRechazoSi = false;
    }
  }


  public rechazarMovimiento() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      this.showMessage('Ingresar datos requeridos.', 'Atención');
      this.mostrarSi = false;
      this.mostrarRechazoSi = false;
    } else {
      this.showMessage('¿Esta seguro que desea rechazar el registro?', 'Atención');
      this.mostrarSi = false;
      this.mostrarRechazoSi = true;
    }
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
  public hideMessageV2() {
    $('#dialogMessageV2').modal('hide');
  }

  public siGuardar() {
    this.seleccionaAccion();
    const updateForm: UpdateStatusDTO = new UpdateStatusDTO();
    updateForm.cveSituacionRegistro = '1'; // Aprobado
    updateForm.desObservaciones = this.formGroup.get('comentarioAprobador').value;
    updateForm.numFolioMovtoOriginal = this.selectedItem.numFolioMovtoOriginal;
    updateForm.numNss = this.selectedItem.numNss;
    updateForm.objectId = this.selectedItem.objectId;
    updateForm.cveCurp = this.user.userInfo.uid;
    updateForm.cveIdAccionRegistro = this.cveIdAccionRegistroSI;//Modificado

    this.updateStatusMovmientos(updateForm);
    this.hideMessage();
    this.mostrarSi = false;
    this.mostrarRechazoSi = false;
  }

  public siRechazar() {
    this.seleccionaAccion();
    const updateForm: UpdateStatusDTO = new UpdateStatusDTO();
    updateForm.cveSituacionRegistro = '3'; // Rechazado
    updateForm.desObservaciones = this.formGroup.get('comentarioAprobador').value;
    updateForm.numFolioMovtoOriginal = this.selectedItem.numFolioMovtoOriginal;
    updateForm.numNss = this.selectedItem.numNss;
    updateForm.objectId = this.selectedItem.objectId;
    updateForm.cveCurp = this.user.userInfo.uid;
    updateForm.cveIdAccionRegistro = this.cveIdAccionRegistroNO; //Modificación rechazado

    this.updateStatusMovmientos(updateForm);
    this.hideMessage();
    this.mostrarSi = false;
    this.mostrarRechazoSi = false;
  }

  public esAprobarSinCambios() {
    return this.info.auditorias.filter(audit => !audit.fecBaja)?.[0]?.cveIdAccionRegistro == 11;
  }

  public seleccionaAccion() {
    let ultimaAccion: Auditorias;
    if (!!this.info.auditorias && this.info.auditorias.length) {
      ultimaAccion = this.info.auditorias.filter(audit => !audit.fecBaja)?.[0];
    }
    switch (ultimaAccion?.cveIdAccionRegistro) {
      case 4:
        this.cveIdAccionRegistroSI = 1; // Alta
        this.cveIdAccionRegistroNO = 7; // Alta rechazado
        break;
      case 5:
        this.cveIdAccionRegistroSI = 2;  // Modificado
        this.cveIdAccionRegistroNO = 8;  // Modificado rechazado
        break;
      case 6:
        this.cveIdAccionRegistroSI = 3; // Eliminacion
        this.cveIdAccionRegistroNO = 9; // Baja rechazado
        break;
      case 11:
        this.cveIdAccionRegistroSI = 12; // Eliminacion
        this.cveIdAccionRegistroNO = 13; // Baja rechazado
        break;
      default:
        break;
    }

  }

  public showMessageV2(message: string, title: string) {
    console.log('showmessa');
    this.titDialogo = title;
    this.messDialogo = message;
    $('#dialogMessageV2').modal('show');
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

  public updateStatusMovmientos(formData: UpdateStatusDTO) {
    this.saveMovementService.updateStatus(formData).subscribe(
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
            this.showMessageV2(this.responsUpdateStatus, 'Atención');
            break;
          case 504:
            this.responsUpdateStatus = response.body;
            this.showMessageV2(this.responsUpdateStatus, 'Atención');
            break;
          case 500:
            this.responsUpdateStatus = response.body;
            this.showMessageV2(this.responsUpdateStatus, 'Atención');
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

  public aprobarSinCambiosConfirmacion() {
    this.showMessageConfirmAprobar('¿Está seguro que el registro considerado como Susceptible de ajuste no requiere ningún cambio?', "Confirmar sin cambios");
  }

  public showMessageConfirmAprobar(message: string, title: string) {
    console.log('showmessa');
    this.titDialogo = title;
    this.messDialogo = message;
    $('#dialogMessageConfirmAprobar').modal('show');
  }

  public changeConsecuencia() {
    if (this.info !== null) {
      if (this.info.incapacidadDTO !== null) {
        if (this.info.incapacidadDTO.cveConsecuencia !== null) {
          if (Number(this.info.incapacidadDTO.cveConsecuencia) === 6)
            this.info.incapacidadDTO.desConsecuencia = "Con Valuación inicial provisional posterior a la fecha de alta"
        }
      }
    }
  }

  public cancelarConfirmarAprobar() {
    $('#dialogMessageConfirmAprobar').modal('hide');
  }

  public confirmarAprobar() {
    this.isDisabledConfirmar = true;
    this.seleccionaAccionSinCambios();
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
        this.spinner.hide();
        localStorage.setItem('form', JSON.stringify(this.form));
        this.router.navigate(['/searchRecords/true', {}]);
      }, () => {
        this.spinner.hide();
      });
  }

  public seleccionaAccionSinCambios() {
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

  public getTipoDictamen() {
    if (this.validaDictamen()) {
      return this.info.incapacidadDTO.bitacoraDictamen.filter(bitacoraDictamen => bitacoraDictamen.activo)?.[0]?.tipoDictamen;
    }
    return "";
  }

  public getNombreDictamen() {
    if (this.validaDictamen()) {
      return this.info.incapacidadDTO.bitacoraDictamen.filter(bitacoraDictamen => bitacoraDictamen.activo)?.[0]?.nomArchivo;
    }
    return "";
  }

  public getNumeroDictamen() {
    if (this.validaDictamen()) {
      return this.info.incapacidadDTO.bitacoraDictamen.filter(bitacoraDictamen => bitacoraDictamen.activo)?.[0]?.numFolio;
    }
    return "";
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
    this.reporteService.downloadDictamenST3(req
    ).subscribe((response: any) => {
      if (response == null || response.status === 204 || response.status === 500) {
        this.showMessage(response.message, "Falla al obtener archivo");
        return;
      }

      if (response.body.codigo === 0) {
        var archivoBase = response.body.dictamen;
        this.pdfContent = URL.createObjectURL(this.b64toBlob2(archivoBase, 'application/pdf'));
        this.pdfview.nativeElement.setAttribute('data', this.pdfContent);
        this.ditamenName = response.body.nameArchivo;
        this.showModalDictamen();
      } else {
        this.showMessage(response.body.mensaje, "Falla al obtener archivo");
      }

      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.showMessage(error.error.message, 'Atención');
    });
  }

  public b64toBlob2(b64Data, contentType) {
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

  public downloadDictamen() {
    var elementA = document.createElement('a');
    elementA.href = URL.createObjectURL(this.blob);
    elementA.download = this.ditamenName;
    elementA.click();
  }

  public imprimir() {
    const blobUrl = window.URL.createObjectURL((this.blob));
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
    iframe.contentWindow.print();
  }

}
