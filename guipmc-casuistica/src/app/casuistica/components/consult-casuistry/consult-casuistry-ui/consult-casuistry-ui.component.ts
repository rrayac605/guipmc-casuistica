import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormSearchDetailRecords } from 'src/app/casuistica/models/records-detail/form-search-detail-records';
import { RecordsDetailInfo } from 'src/app/casuistica/models/records-detail/recordsDetailInfo';
import { DetailSearchRecordsDTO } from 'src/app/casuistica/models/search-records/detailSearchRecordsDTO';
import { MovementsService } from 'src/app/casuistica/services/movements/movements.service';
import { SaveMovementService } from 'src/app/casuistica/services/saveMovement/save-movement.service';
import { Login } from 'src/app/common/models/security/login';
import { SecurityService } from 'src/app/common/services/security/security.service';
import * as FileSaver from 'file-saver';
import { ConsultCasuistryForm } from 'src/app/casuistica/models/consult-casuistry/consultForm';
import moment, { Moment } from 'moment';
import { ReporteService } from 'src/app/common/services/reportes/reporte.service';
import { RequestConsultDictamenSist } from 'src/app/common/models/reporte/RequestConsultDictamenSist';

// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-consult-casuistry-ui',
  templateUrl: './consult-casuistry-ui.component.html',
  styleUrls: ['./consult-casuistry-ui.component.scss']
})

export class ConsultCasuistryUiComponent implements OnInit {
  public form: any;
  public formCasustica: any;
  public details: DetailSearchRecordsDTO[] = [];
  public selectedItem: DetailSearchRecordsDTO;
  public formDetail: FormSearchDetailRecords = new FormSearchDetailRecords();
  public info: RecordsDetailInfo = new RecordsDetailInfo();
  public titDialogo: string;
  public messDialogo: string;
  public user: Login = new Login();
  public visualizaPerfil3;
  public visualizaPerfil4;
  public titulo = '/Consultar Casuística';

  public pdfContent: any;
  @ViewChild('pdfview') pdfview: ElementRef;
  @ViewChild('pdfviewSIST') pdfviewSIST: ElementRef;

  public blob: any;
  public ditamenName: string;
  public ditamenNameSIST: string;
  public showBtnDictamen: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private findMovements: MovementsService,
    private spinner: NgxSpinnerService, private securityService: SecurityService,
    private saveMovementService: SaveMovementService, private reporteServie: ReporteService) { }

  ngOnInit(): void {
    console.log('entraste en consult caustry');

    this.user = JSON.parse(localStorage.getItem('user'));
    this.selectedItem = JSON.parse(localStorage.getItem('selectedCasuistry'));
    this.form = JSON.parse(localStorage.getItem('formCasuistry'));
    this.formCasustica = JSON.parse(localStorage.getItem('form'));

    this.formDetail.objectId = this.selectedItem.objectId;
    this.formDetail.numNss = this.selectedItem.numNss;
    this.formDetail.position = this.selectedItem.position;
    this.formDetail.numFolioMovtoOriginal = this.selectedItem.numFolioMovtoOriginal;
    this.formDetail.objectIdOrigen = this.info.objectIdOrigen;

    if (this.selectedItem.isChange) {
      console.log('isChange');
      this.getDetalleModificado();
    } else {
      this.getDetalle();
    }

    this.clearLocalStorage();

  }

  public regresar() {
    localStorage.setItem('form', JSON.stringify(this.formCasustica));
    this.router.navigate(['/searchRecordsCasuistry', {}]);
  }
  public modificar() {
    localStorage.setItem('form', JSON.stringify(this.form));
    localStorage.setItem('info', JSON.stringify(this.info));
    localStorage.setItem('selected', JSON.stringify(this.selectedItem));
    this.router.navigate(['/modifyRecords', {}]);
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

  public hideMessage() {
    $('#dialogMessage').modal('hide');
  }

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
            this.info.auditorias = this.info?.auditorias?.filter(auditoria => !auditoria.fecBaja);
            this.changeConsecuencia();
            this.viewBtnDictamen();
            this.updateDate();
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
            this.info.auditorias = this.info?.auditorias?.filter(auditoria => !auditoria.fecBaja);
            this.changeConsecuencia();
            this.viewBtnDictamen();
            this.updateDate();
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

  public downloadPDFReport() {
    const formData = new ConsultCasuistryForm();

    formData.isChange = this.selectedItem.isChange;
    formData.numNss = this.selectedItem.numNss;
    formData.objectId = this.selectedItem.objectId;
    if (this.selectedItem.position !== null) {
      formData.position = this.selectedItem.position;
    }
    if (this.selectedItem.numFolioMovtoOriginal !== null && this.selectedItem.numFolioMovtoOriginal !== '') {
      formData.numFolioMovtoOriginal = this.selectedItem.numFolioMovtoOriginal;
    }
    formData.cveSituacionRegistro = this.form.situacionRegistro;

    formData.cveIdAccionRegistro = this.form.accionRegistro;



    console.log(formData);
    this.spinner.show();
    this.saveMovementService.reporteDetalleCasuisticaPDF(formData).subscribe(
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
    const fileName = 'ConsultaCasuistica.pdf';
    FileSaver.saveAs(blob, fileName);
  }

  public reporte() {
    this.showMessageReporte('Elija el formato en que desea descargar el reporte actual', 'Atención');
  }

  public showMessageReporte(message: string, title: string) {
    this.titDialogo = title;
    this.messDialogo = message;
    $('#dialogMessageReporte').modal('show');
  }

  public hideMessageReporte() {
    $('#dialogMessageReporte').modal('hide');
  }


  public downloadXlsReport() {
    const formData = new ConsultCasuistryForm();
    formData.isChange = this.selectedItem.isChange;
    formData.numNss = this.selectedItem.numNss;
    formData.objectId = this.selectedItem.objectId;
    if (this.selectedItem.position !== null) {
      formData.position = this.selectedItem.position;
    }
    if (this.selectedItem.numFolioMovtoOriginal !== null && this.selectedItem.numFolioMovtoOriginal !== '') {
      formData.numFolioMovtoOriginal = this.selectedItem.numFolioMovtoOriginal;
    }
    formData.cveSituacionRegistro = this.form.situacionRegistro;
    formData.cveIdAccionRegistro = this.form.accionRegistro;

    console.log(formData);
    this.spinner.show();
    this.saveMovementService.getExportar3(formData, this.spinner, 'consultaCasuistica.xls');
  }
  downloadFile = (data, contentType) => {
    const fileName = 'consultaCasuistica.xlsx';
    FileSaver.saveAs(data.body, fileName);


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

  public verDictamen() {
    this.showFile('Archivos', 'Vista archivos');
  }

  public hideFile() {
    $('#dialogFiles').modal('hide');
  }

  public showFile(message: string, title: string) {
    this.titDialogo = title;
    this.messDialogo = message;
    $('#dialogFiles').modal('show');
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
        var archivoBase = response;
        this.pdfContent = URL.createObjectURL(this.b64toBlob2(archivoBase, nomCompleto));
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

  public getTipoDictamen() {
    if (this.validaDictamen()) {
      return this.info.incapacidadDTO.bitacoraDictamen.filter(bitacoraDictamen => bitacoraDictamen.activo)?.[0]?.tipoDictamen;
    }
    return '';
  }

  public getNumFolio() {
    if (this.validaDictamen()) {
      return this.info.incapacidadDTO.bitacoraDictamen.filter(bitacoraDictamen => bitacoraDictamen.activo)?.[0]?.numFolio;
    }
    return '';
  }

  public getNomArchivo() {
    if (this.validaDictamen()) {
      return this.info.incapacidadDTO.bitacoraDictamen.filter(bitacoraDictamen => bitacoraDictamen.activo)?.[0]?.nomArchivo;
    }
    return '';
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
    console.log("cveOrigenArchivo " + this.info?.cveOrigenArchivo);
    console.log("refFolioOriginal " + this.info?.aseguradoDTO?.refFolioOriginal);

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
        this.showMessage(response.message, "Falla al obtener archivo");
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

}