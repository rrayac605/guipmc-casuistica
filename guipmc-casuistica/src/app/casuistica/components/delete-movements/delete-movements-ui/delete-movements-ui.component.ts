import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Auditorias } from 'src/app/casuistica/models/auditorias';
import { CamposOriginalesDTO } from 'src/app/casuistica/models/camposOriginalesDTO';
import { FormSearchDetailRecords } from 'src/app/casuistica/models/records-detail/form-search-detail-records';
import { RecordsDetailInfo } from 'src/app/casuistica/models/records-detail/recordsDetailInfo';
import { DetailSearchRecordsDTO } from 'src/app/casuistica/models/search-records/detailSearchRecordsDTO';
import { UpdateStatusDTO } from 'src/app/casuistica/models/update-status/updateStatusDTO';
import { DetalleRegistroDTO } from 'src/app/casuistica/models/validation/detalleRegistroDTO';
import { ResponseValidation } from 'src/app/casuistica/models/validation/responseValidation';
import { MovementsService } from 'src/app/casuistica/services/movements/movements.service';
import { SaveMovementService } from 'src/app/casuistica/services/saveMovement/save-movement.service';
import { Login } from 'src/app/common/models/security/login';
import { ReporteService } from 'src/app/common/services/reportes/reporte.service';
import { RequestConsultDictamenSist } from 'src/app/common/models/reporte/RequestConsultDictamenSist';

// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-delete-movements-ui',
  templateUrl: './delete-movements-ui.component.html',
  styleUrls: ['./delete-movements-ui.component.scss']
})
export class DeleteMovementsUiComponent implements OnInit {
  public formGroup: FormGroup;
  titDialogo: string;
  public form: any;
  public details: DetailSearchRecordsDTO[] = [];
  public selectedItem: DetailSearchRecordsDTO;
  public formDetail: FormSearchDetailRecords = new FormSearchDetailRecords();
  public info: RecordsDetailInfo = new RecordsDetailInfo();
  public user: Login = new Login();
  public insertado: boolean;


  messDialogo: string;
  public mostrarSi: boolean;
  public originalNSS: string;
  public originalRP: string;
  public camposOriginales: CamposOriginalesDTO;

  public pdfContent: any;
  @ViewChild('pdfview') pdfview: ElementRef;
  public showBtnDictamen: boolean = false;
  public blob: any;
  public ditamenName: string;
  public titulo = "Realizar moviminetos / Baja de registro";

  constructor(private formBuilder: FormBuilder,
    private router: Router, private findMovements: MovementsService,
    private spinner: NgxSpinnerService, private saveMovementService: SaveMovementService,
    private reporteService: ReporteService) { }

  ngOnInit(): void {
    this.insertado = false;
    this.user = JSON.parse(localStorage.getItem('user'));
    this.selectedItem = JSON.parse(localStorage.getItem('selected'));
    this.form = JSON.parse(localStorage.getItem('form'));
    this.info = JSON.parse(localStorage.getItem('info'));
    this.viewBtnDictamen();

    this.buildForm();
    this.clearLocalStorage();

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

  } //end ngoninit

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      comentario: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(250),
        Validators.pattern('[A-Za-z0-9\\\s\\\u00f1\\\u00d1áéíóúÁÉÍÓÚàèìòùÀÈÌÒÙ\\\°\\\!\\\”#$%&\\\/\\\(\\\)=?¡*\\\¨\\\]\\\[\\\}\\\{\\\-,.:;\\\<\\\>\\\+]+$')
      ])]
    });
  }

  public clearLocalStorage() {
    localStorage.removeItem('detail');
    localStorage.removeItem('selected');
    localStorage.removeItem('form');
    localStorage.removeItem('info');

  }

  public eliminarMovimiento() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      this.showMessage('dialogMessage', 'Ingresar datos requeridos.', 'Atención');
      this.mostrarSi = true;
    } else {
      this.showMessage('dialogMessage', '¿Está seguro que desea eliminar el registro?', 'Atención');
      this.mostrarSi = false;
    }
  }

  public showMessage(div: string, message: string, title: string) {
    this.titDialogo = title;
    this.messDialogo = message;
    $('#' + div).modal('show');
  }

  public hideMessage(modal: string) {
    $('#' + modal).modal('hide');
  }

  public siEliminar() {
    this.hideMessage('dialogMessage');
    this.mostrarSi = false;

    this.getNewChanges();
    const formDup: DetalleRegistroDTO = new DetalleRegistroDTO();
    formDup.aseguradoDTO = this.info.aseguradoDTO;
    formDup.patronDTO = this.info.patronDTO;
    formDup.incapacidadDTO = this.info.incapacidadDTO;
    const auditoriaDTO: Auditorias = new Auditorias();
    auditoriaDTO.desObservacionesSol = this.formGroup.get('comentario').value;
    auditoriaDTO.desCambio = this.formGroup.get('comentario').value;
    auditoriaDTO.desAccionRegistro = "Baja pendiente";
    auditoriaDTO.cveIdAccionRegistro = 6;
    auditoriaDTO.nomUsuario = this.user.userInfo.uid;
    auditoriaDTO.camposOriginalesDTO = this.camposOriginales;
    formDup.auditorias = [auditoriaDTO];
    formDup.fecProcesoCarga = this.info.fecProcesoCarga;
    formDup.objectIdOrigen = this.info.objectIdOrigen;
    formDup.objectIdArchivoDetalle = this.info.identificador;
    formDup.cveOrigenArchivo = this.info.cveOrigenArchivo;
    console.log('Eliminado -->' + JSON.stringify(formDup));
    this.eliminarMovimientos(formDup);

    //this.showMessageV2('La eliminación se realizó correctamete.', 'Atención');
  }

  public regresar() {
    localStorage.setItem('form', JSON.stringify(this.form));
    localStorage.setItem('info', JSON.stringify(this.info));
    localStorage.setItem('selected', JSON.stringify(this.selectedItem));
    this.router.navigate(['/recordsDetailUiComponent', {}]);
  }

  private getNewChanges() {
    this.info.incapacidadDTO.fecBaja = new Date();
    this.info.incapacidadDTO.desCodigoDiagnostico = '';
    this.info.incapacidadDTO.numCodigoDiagnostico = '';
    this.info.incapacidadDTO.numMatMedTratante = '';
    this.info.aseguradoDTO.fecBaja = new Date();
    this.info.patronDTO.fecBaja = new Date();
  }

  public eliminarMovimientos(toForm: DetalleRegistroDTO) {
    // Validacion de duplicados
    this.spinner.show();
    console.log('form guardar:' + toForm);
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

    this.saveMovementService.eliminar(toForm).subscribe(
      (response: any) => {
        switch (response.status) {
          case 200:
          case 206:
            this.mostrarSi = true;
            this.insertado = true;
            //this.showMessage(err.error.text, 'Atención');
            this.showMessage('dialogMessageV2', "Movimiento eliminado", 'Atención');
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
              this.mostrarSi = true;
              this.insertado = true;
              //this.showMessage(err.error.text, 'Atención');
              this.showMessage('dialogMessageV2', "Movimiento eliminado", 'Atención');

              break;
            case 400:
            case 401:
            case 500:
            case 504:
              this.showMessage('dialogMessageV2', 'Operación no permitida.', 'Atención');
              break;
          }
        } else {
          this.showMessage('dialogMessageV2', 'Problemas con el servicio ' + err.error.error, 'Atención');
        }
      }, () => {
        this.spinner.hide();
      });
  }

  public salir() {
    this.hideMessage('dialogMessageV2');
    localStorage.setItem('form', JSON.stringify(this.form));
    this.router.navigate(['/searchRecords', {}]);
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
        this.showMessage('dialogMessageV2', response.message, "Falla al obtener archivo");
        return;
      }

      if (response.body.codigo === 0) {
        var archivoBase = response.body.dictamen;
        this.pdfContent = URL.createObjectURL(this.b64toBlob2(archivoBase, 'application/pdf'));
        this.pdfview.nativeElement.setAttribute('data', this.pdfContent);
        this.ditamenName = response.body.nameArchivo;
        this.showModalDictamen();
      } else {
        this.showMessage('dialogMessageV2', response.body.mensaje, "Falla al obtener archivo");
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.showMessage('dialogMessageV2', error.error.message, "Atención");
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

}
