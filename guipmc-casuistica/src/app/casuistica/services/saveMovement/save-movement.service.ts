import { Injectable } from '@angular/core';
import { DetalleRegistroDTO } from '../../models/validation/detalleRegistroDTO';
import { Login } from 'src/app/common/models/security/login';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseValidation } from '../../models/validation/responseValidation';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { FormSearchRecords } from '../../models/search-records/form-search-records';
import { DetailSearchRecordsDTO } from '../../models/search-records/detailSearchRecordsDTO';
import { FormSearchDetailRecords } from '../../models/records-detail/form-search-detail-records';
import { UpdateStatusDTO } from '../../models/update-status/updateStatusDTO';
import { ConsultCasuistryForm } from '../../models/consult-casuistry/consultForm';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SaveMovementService {
  private baseEndpoint = '/mscambios/v1/insertar';
  private movimientosEndpoint = '/mscambios/v1/cambios';
  private detalleMovimientoEndpoint = '/mscambios/v1/detallemovimientos';
  private cambioStatusEndpoint = '/mscambios/v1/cambios';
  private sinCambioStatusEndpoint = '/mscambios/v1/guardarSinCambios';
  private aprobarSinCambioStatusEndpoint = '/mscambios/v1/aprobarSinCambios';
  private eliminarEndpoint = '/mscambios/v1/eliminar';
  private reporteDetallepdfEndpoint = '/mscambios/v1/reporteDetallepdf';
  private baseEndpointExportXLSX = '/mscambios/v1/reporteDetallexls';
  private reporteGeneralpdfEndpoint = '/mscambios/v1/reporteGeneralPdf';
  private baseEndpointExportGeneralXLSX = '/mscambios/v1/reporteGeneralExcel';

  private baseEndpointModiSus='/mscambios/v1/modificarCambiosSus';
  private baseEndpointSus='/mscambios/v1/insertarNuevoSus';
  private user: Login = new Login();

  constructor(private http: HttpClient) { }

  insertar(form: DetalleRegistroDTO): Observable<ResponseValidation> {
    this.user = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({'Content-Type': 'application/json',
    Authorization: 'Bearer '.concat(this.user.tokenBody.access_token)
      });
    return this.http.post<ResponseValidation[]>(this.baseEndpoint, form,
     {observe: 'response', headers: httpHeadersAuth}).pipe(
      (response: any) => {
        return response;
      },
      catchError(e => {
        return throwError(e);
      })
    );
  }


  getMovimientos(searchRecords: FormSearchRecords): Observable<DetailSearchRecordsDTO[]> {
    this.user = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({'Content-Type': 'application/json',
    Authorization: 'Bearer '.concat(this.user.tokenBody.access_token)});
    return this.http.get<DetailSearchRecordsDTO[]>(this.movimientosEndpoint + this.getQueryParams(searchRecords),
     {observe: 'response', headers: httpHeadersAuth}).pipe(
      (response: any) => {
        return response;
      },
      catchError(e => {
        return throwError(e);
      })
    );
  }

  getMovimientosFreeInput(searchRecords: FormSearchRecords): Observable<DetailSearchRecordsDTO[]> {
    this.user = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({'Content-Type': 'application/json',
    Authorization: 'Bearer '.concat(this.user.tokenBody.access_token)});
    return this.http.get<DetailSearchRecordsDTO[]>(this.movimientosEndpoint + this.getQueryParamsFreeInput(searchRecords),
     {observe: 'response', headers: httpHeadersAuth}).pipe(
      (response: any) => {
        return response;
      },
      catchError(e => {
        return throwError(e);
      })
    );
  }

  getDetalleMovimientos(searchRecord: FormSearchDetailRecords): Observable<DetailSearchRecordsDTO[]> {
    this.user = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({'Content-Type': 'application/json'
    ,Authorization: 'Bearer '.concat(this.user.tokenBody.access_token)
  });
    return this.http.get<DetailSearchRecordsDTO[]>(this.detalleMovimientoEndpoint + this.getDetailQueryParams(searchRecord),
     {observe: 'response', headers: httpHeadersAuth}).pipe(
      (response: any) => {
        return response;
      },
      catchError(e => {
        return throwError(e);
      })
    );
  }

  updateStatus(form: UpdateStatusDTO): Observable<UpdateStatusDTO> {
    this.user = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({'Content-Type': 'application/json'
    , Authorization: 'Bearer '.concat(this.user.tokenBody.access_token)
      });
    return this.http.post<UpdateStatusDTO[]>(this.cambioStatusEndpoint, form,
     {observe: 'response', headers: httpHeadersAuth}).pipe(
      (response: any) => {
        return response;
      },
      catchError(e => {
        return throwError(e);
      })
    );
  }

  guardarSinCambios(form: UpdateStatusDTO): Observable<any> {
    this.user = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({'Content-Type': 'application/json'
    , Authorization: 'Bearer '.concat(this.user.tokenBody.access_token)
      });
    return this.http.post<any[]>(this.sinCambioStatusEndpoint, form,
     {observe: 'response', headers: httpHeadersAuth}).pipe(
      (response: any) => {
        return response;
      },
      catchError(e => {
        return throwError(e);
      })
    );
  }

  aprobarSinCambios(form: UpdateStatusDTO): Observable<UpdateStatusDTO> {
    this.user = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({'Content-Type': 'application/json'
    , Authorization: 'Bearer '.concat(this.user.tokenBody.access_token)
      });
    return this.http.post<UpdateStatusDTO[]>(this.aprobarSinCambioStatusEndpoint, form,
     {observe: 'response', headers: httpHeadersAuth}).pipe(
      (response: any) => {
        return response;
      },
      catchError(e => {
        return throwError(e);
      })
    );
  }

  eliminar(form: DetalleRegistroDTO): Observable<ResponseValidation> {
    this.user = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({'Content-Type': 'application/json',
    Authorization: 'Bearer '.concat(this.user.tokenBody.access_token)
      });
    return this.http.post<ResponseValidation[]>(this.eliminarEndpoint, form,
     {observe: 'response', headers: httpHeadersAuth}).pipe(
      (response: any) => {
        return response;
      },
      catchError(e => {
        return throwError(e);
      })
    );
  }

  reporteDetalleCasuisticaPDF(form: ConsultCasuistryForm): Observable<any> {
    this.user = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({'Content-Type': 'application/json',
    Authorization: 'Bearer '.concat(this.user.tokenBody.access_token)
      });
    return this.http.post<any>(this.reporteDetallepdfEndpoint, form,
     {observe: 'response', headers: httpHeadersAuth}).pipe(
      (response: any) => {
        return response;
      },
      catchError(e => {
        return throwError(e);
      })
    );
  }
  getExportar3(formStatus: ConsultCasuistryForm, spinner: NgxSpinnerService, filename: string = null) {
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post(this.baseEndpointExportXLSX, formStatus, { responseType: 'blob', headers: httpHeaders })
      .subscribe(response => this.downLoadFile(response, filename, spinner));
  }
  downLoadFile(data: any, filename: string, spinner: NgxSpinnerService) {
    if (spinner) {
      spinner.hide();
    }
    const blob = new Blob([data], { type: 'application/octet-stream' });
    if (window.navigator.msSaveOrOpenBlob) {
    //para IE 11
    window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      //para chrome
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename); //any other extension
      document.body.appendChild(link);
      link.click();
      link.remove();
    }

  }

  public exportXLSX(formStatus: ConsultCasuistryForm): Observable<any> {
    this.user = JSON.parse(localStorage.getItem('user'));
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    const httpHeadersAuth = new HttpHeaders({'Content-Type': 'application/json',
    Authorization: 'Bearer '.concat(this.user.tokenBody.access_token)});
    return this.http.post<any>(this.baseEndpointExportXLSX, formStatus,
      {observe: 'response', headers: httpHeadersAuth, responseType: 'blob' as 'json'}).pipe(
       (response: any) => {
         return response;
       },
       catchError(e => {
         return throwError(e);
       })
     );
  }



  reporteGeneralCasuisticaPDF(searchRecords: FormSearchRecords): Observable<any> {
    this.user = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer '.concat(this.user.tokenBody.access_token)
    });
    return this.http.post<any>(this.reporteGeneralpdfEndpoint, searchRecords,
      { observe: 'response', headers: httpHeadersAuth }).pipe(
        (response: any) => {
          return response;
        },
        catchError(e => {
          return throwError(e);
        })
      );
  }
  getExportar2(searchRecords: FormSearchRecords, spinner: NgxSpinnerService, filename: string = null) {
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post(this.baseEndpointExportGeneralXLSX, searchRecords, { responseType: 'blob', headers: httpHeaders })
      .subscribe(response => this.downLoadFile(response, filename, spinner));
  }

  public exportGeneralXLSX(searchRecords: FormSearchRecords): Observable<any> {
    this.user = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer '.concat(this.user.tokenBody.access_token)
    });
    return this.http.post<any>(this.baseEndpointExportGeneralXLSX, searchRecords,
      { observe: 'response', headers: httpHeadersAuth, responseType: 'blob' as 'json' }).pipe(
        (response: any) => {
          return response;
        },
        catchError(e => {
          return throwError(e);
        })
      );
  }

  public getQueryParams(searchRecords: FormSearchRecords) {
    let myQuery = '?';
    if (searchRecords.cveDelegacion !== undefined && searchRecords.cveDelegacion.length > 0 && searchRecords.cveDelegacion !== '-1') {
      myQuery += 'cveDelegacion' + '=' + encodeURIComponent(searchRecords.cveDelegacion) + '&';
    }
    if (searchRecords.cveSubdelegacion !== undefined && searchRecords.cveSubdelegacion.length > 0
      && searchRecords.cveSubdelegacion !== '-1') {
      myQuery += 'cveSubdelegacion' + '=' + encodeURIComponent(searchRecords.cveSubdelegacion) + '&';
    }
    if (searchRecords.cveConsecuencia !== undefined && searchRecords.cveConsecuencia.length > 0 && searchRecords.cveConsecuencia !== '-1') {
      myQuery += 'cveConsecuencia' + '=' + encodeURIComponent(searchRecords.cveConsecuencia) + '&';
    }
    if (searchRecords.cveCasoRegistro !== undefined && searchRecords.cveCasoRegistro.length > 0 && searchRecords.cveCasoRegistro !== '-1') {
      myQuery += 'cveCasoRegistro' + '=' + encodeURIComponent(searchRecords.cveCasoRegistro) + '&';
    }
    if (searchRecords.cveTipoRiesgo !== undefined && searchRecords.cveTipoRiesgo.length > 0 && searchRecords.cveTipoRiesgo !== '-1') {
      myQuery += 'cveTipoRiesgo' + '=' + encodeURIComponent(searchRecords.cveTipoRiesgo) + '&';
    }
    if (searchRecords.fromMonth !== undefined && searchRecords.fromMonth.length > 0 && searchRecords.fromMonth !== '-1') {
      myQuery += 'fromMonth' + '=' + encodeURIComponent(searchRecords.fromMonth) + '&';
    }
    if (searchRecords.fromYear !== undefined && searchRecords.fromYear.length > 0 && searchRecords.fromYear !== '-1') {
      myQuery += 'fromYear' + '=' + encodeURIComponent(searchRecords.fromYear) + '&';
    }
    if (searchRecords.toMonth !== undefined && searchRecords.toMonth.length > 0 && searchRecords.toMonth !== '-1') {
      myQuery += 'toMonth' + '=' + encodeURIComponent(searchRecords.toMonth) + '&';
    }
    if (searchRecords.toYear !== undefined && searchRecords.toYear.length > 0 && searchRecords.toYear !== '-1') {
      myQuery += 'toYear' + '=' + encodeURIComponent(searchRecords.toYear) + '&';
    }
    if (searchRecords.toDay !== undefined && searchRecords.toDay != "null") {
      myQuery += 'toDay' + '=' + encodeURIComponent(searchRecords.toDay) + '&';
    }
    if (searchRecords.fromDay !== undefined && searchRecords.fromDay != "null") {
      myQuery += 'fromDay' + '=' + encodeURIComponent(searchRecords.fromDay) + '&';
    }
    if (searchRecords.cveEstadoArchivo !== undefined && searchRecords.cveEstadoArchivo.length > 0
      && searchRecords.cveEstadoArchivo !== '-1') {
      myQuery += 'cveEstadoArchivo' + '=' + encodeURIComponent(searchRecords.cveEstadoArchivo) + '&';
    }
    if (searchRecords.campoSugerido !== undefined && searchRecords.campoSugerido === '2' &&
      searchRecords.numNss !== undefined && searchRecords.numNss.length > 0) {
      myQuery += 'numNss' + '=' + encodeURIComponent(searchRecords.numNss) + '&';
    }
    if (searchRecords.campoSugerido !== undefined && searchRecords.campoSugerido === '1' &&
      searchRecords.refRegistroPatronal !== undefined && searchRecords.refRegistroPatronal.length > 0) {
      myQuery += 'refRegistroPatronal' + '=' + encodeURIComponent(searchRecords.refRegistroPatronal) + '&';
    }
    if (searchRecords.campoSugerido !== undefined && searchRecords.campoSugerido === '3' &&
      searchRecords.rfc !== undefined && searchRecords.rfc.length > 0) {
      myQuery += 'rfc' + '=' + encodeURIComponent(searchRecords.rfc) + '&';
    }
    if (searchRecords.campoSugerido !== undefined && searchRecords.campoSugerido === '4' &&
      searchRecords.cveClase !== undefined && searchRecords.cveClase.length > 0
      && searchRecords.cveClase !== '-1') {
      myQuery += 'cveClase' + '=' + encodeURIComponent(searchRecords.cveClase) + '&';
    }
    if (searchRecords.campoSugerido !== undefined && searchRecords.campoSugerido === '5' &&
      searchRecords.cveFraccion !== undefined && searchRecords.cveFraccion.length > 0
      && searchRecords.cveFraccion !== '-1') {
      myQuery += 'cveFraccion' + '=' + encodeURIComponent(searchRecords.cveFraccion) + '&';
    }
    if (searchRecords.campoSugerido !== undefined && searchRecords.campoSugerido === '6' &&
      searchRecords.cveLaudo !== undefined && searchRecords.cveLaudo.length > 0
      && searchRecords.cveLaudo !== '-1') {
      myQuery += 'cveLaudo' + '=' + encodeURIComponent(searchRecords.cveLaudo) + '&';
    }
    if (searchRecords.cveIdAccionRegistro !== undefined && searchRecords.cveIdAccionRegistro.length > 0
      && searchRecords.cveIdAccionRegistro !== '-1') {
      myQuery += 'cveIdAccionRegistro' + '=' + encodeURIComponent(searchRecords.cveIdAccionRegistro) + '&';
    }
    if (searchRecords.cveSituacionRegistro !== undefined && searchRecords.cveSituacionRegistro.length > 0
      && searchRecords.cveSituacionRegistro !== '-1') {
      myQuery += 'cveSituacionRegistro' + '=' + encodeURIComponent(searchRecords.cveSituacionRegistro) + '&';
    }
    if (searchRecords.cveEstadoRegistro !== undefined && searchRecords.cveEstadoRegistro.length > 0
      && searchRecords.cveEstadoRegistro !== '-1') {
      myQuery += 'cveEstadoRegistro' + '=' + encodeURIComponent(searchRecords.cveEstadoRegistro) + '&';
    }
    if (searchRecords.origenAlta) {
      myQuery += `origenAlta=${encodeURIComponent(searchRecords.origenAlta)}&`;
    }
    // remove last '&'
    myQuery = myQuery.substring(0, myQuery.length - 1);
    return myQuery;
  }

  public getQueryParamsFreeInput(searchRecords: FormSearchRecords) {
    let myQuery = '?';
    if (searchRecords.cveDelegacion !== undefined && searchRecords.cveDelegacion.length > 0 && searchRecords.cveDelegacion !== '-1') {
      myQuery += 'cveDelegacion' + '=' + encodeURIComponent(searchRecords.cveDelegacion) + '&';
    }
    if (searchRecords.cveSubdelegacion !== undefined && searchRecords.cveSubdelegacion.length > 0
      && searchRecords.cveSubdelegacion !== '-1') {
      myQuery += 'cveSubdelegacion' + '=' + encodeURIComponent(searchRecords.cveSubdelegacion) + '&';
    }
    if (searchRecords.cveConsecuencia !== undefined && searchRecords.cveConsecuencia.length > 0 && searchRecords.cveConsecuencia !== '-1') {
      myQuery += 'cveConsecuencia' + '=' + encodeURIComponent(searchRecords.cveConsecuencia) + '&';
    }
    if (searchRecords.cveCasoRegistro !== undefined && searchRecords.cveCasoRegistro.length > 0 && searchRecords.cveCasoRegistro !== '-1') {
      myQuery += 'cveCasoRegistro' + '=' + encodeURIComponent(searchRecords.cveCasoRegistro) + '&';
    }
    if (searchRecords.cveTipoRiesgo !== undefined && searchRecords.cveTipoRiesgo.length > 0 && searchRecords.cveTipoRiesgo !== '-1') {
      myQuery += 'cveTipoRiesgo' + '=' + encodeURIComponent(searchRecords.cveTipoRiesgo) + '&';
    }
    if (searchRecords.fromMonth !== undefined && searchRecords.fromMonth.length > 0 && searchRecords.fromMonth !== '-1') {
      myQuery += 'fromMonth' + '=' + encodeURIComponent(searchRecords.fromMonth) + '&';
    }
    if (searchRecords.fromYear !== undefined && searchRecords.fromYear.length > 0 && searchRecords.fromYear !== '-1') {
      myQuery += 'fromYear' + '=' + encodeURIComponent(searchRecords.fromYear) + '&';
    }
    if (searchRecords.toMonth !== undefined && searchRecords.toMonth.length > 0 && searchRecords.toMonth !== '-1') {
      myQuery += 'toMonth' + '=' + encodeURIComponent(searchRecords.toMonth) + '&';
    }
    if (searchRecords.toYear !== undefined && searchRecords.toYear.length > 0 && searchRecords.toYear !== '-1') {
      myQuery += 'toYear' + '=' + encodeURIComponent(searchRecords.toYear) + '&';
    }
    if (searchRecords.toDay !== undefined && searchRecords.toDay != "null") {
      myQuery += 'toDay' + '=' + encodeURIComponent(searchRecords.toDay) + '&';
    }
    if (searchRecords.fromDay !== undefined && searchRecords.fromDay != "null") {
      myQuery += 'fromDay' + '=' + encodeURIComponent(searchRecords.fromDay) + '&';
    }
    if (searchRecords.cveEstadoArchivo !== undefined && searchRecords.cveEstadoArchivo.length > 0
      && searchRecords.cveEstadoArchivo !== '-1') {
      myQuery += 'cveEstadoArchivo' + '=' + encodeURIComponent(searchRecords.cveEstadoArchivo) + '&';
    }
    if (searchRecords.numNss !== undefined && searchRecords.numNss.length > 0) {
      myQuery += 'numNss' + '=' + encodeURIComponent(searchRecords.numNss) + '&';
    }
    if (searchRecords.refRegistroPatronal !== undefined && searchRecords.refRegistroPatronal.length > 0) {
      myQuery += 'refRegistroPatronal' + '=' + encodeURIComponent(searchRecords.refRegistroPatronal) + '&';
    }
    if (searchRecords.rfc !== undefined && searchRecords.rfc.length > 0) {
      myQuery += 'rfc' + '=' + encodeURIComponent(searchRecords.rfc) + '&';
    }
    if (searchRecords.cveClase !== undefined && searchRecords.cveClase.length > 0
      && searchRecords.cveClase !== '-1') {
      myQuery += 'cveClase' + '=' + encodeURIComponent(searchRecords.cveClase) + '&';
    }
    if (searchRecords.cveFraccion !== undefined && searchRecords.cveFraccion.length > 0
      && searchRecords.cveFraccion !== '-1') {
      myQuery += 'cveFraccion' + '=' + encodeURIComponent(searchRecords.cveFraccion) + '&';
    }
    if (searchRecords.cveLaudo !== undefined && searchRecords.cveLaudo.length > 0
      && searchRecords.cveLaudo !== '-1') {
      myQuery += 'cveLaudo' + '=' + encodeURIComponent(searchRecords.cveLaudo) + '&';
    }
    if (searchRecords.cveIdAccionRegistro !== undefined && searchRecords.cveIdAccionRegistro.length > 0
      && searchRecords.cveIdAccionRegistro !== '-1') {
      myQuery += 'cveIdAccionRegistro' + '=' + encodeURIComponent(searchRecords.cveIdAccionRegistro) + '&';
    }
    if (searchRecords.cveSituacionRegistro !== undefined && searchRecords.cveSituacionRegistro.length > 0
      && searchRecords.cveSituacionRegistro !== '-1') {
      myQuery += 'cveSituacionRegistro' + '=' + encodeURIComponent(searchRecords.cveSituacionRegistro) + '&';
    }
    if (searchRecords.cveEstadoRegistro !== undefined && searchRecords.cveEstadoRegistro.length > 0
      && searchRecords.cveEstadoRegistro !== '-1') {
      myQuery += 'cveEstadoRegistro' + '=' + encodeURIComponent(searchRecords.cveEstadoRegistro) + '&';
    }

    // remove last '&'
    myQuery = myQuery.substring(0, myQuery.length - 1);
    return myQuery;
  }

 public getDetailQueryParams(searchRecords: FormSearchDetailRecords) {
  let myQuery = '?';

  if (searchRecords.objectId !== undefined && searchRecords.objectId !== null && searchRecords.objectId.length > 0
    && searchRecords.objectId !== '-1') {
    myQuery += 'objectId' + '=' + encodeURIComponent(searchRecords.objectId) + '&';
  }
  if (searchRecords.numNss !== undefined && searchRecords.numNss !== null && searchRecords.numNss.length > 0
    && searchRecords.numNss !== '-1') {
    myQuery += 'numNss' + '=' + encodeURIComponent(searchRecords.numNss) + '&';
  }
  if (searchRecords.position !== undefined && searchRecords.position !== null && searchRecords.position > -1) {
    myQuery += 'position' + '=' + encodeURIComponent(searchRecords.position) + '&';
  }
  if (searchRecords.numFolioMovtoOriginal !== undefined && searchRecords.numFolioMovtoOriginal !== null
    && searchRecords.numFolioMovtoOriginal.length > 0 && searchRecords.numFolioMovtoOriginal !== '-1') {
    myQuery += 'numFolioMovtoOriginal' + '=' + encodeURIComponent(searchRecords.numFolioMovtoOriginal) + '&';
  }
  if (searchRecords.objectIdOrigen !== undefined && searchRecords.objectIdOrigen !== null
    && searchRecords.objectIdOrigen.length > 0) {
    myQuery += 'objectIdOrigen' + '=' + encodeURIComponent(searchRecords.objectIdOrigen) + '&';
  }

  // remove last '&'
  myQuery = myQuery.substring(0, myQuery.length - 1);
  return myQuery;
 }

 insertarSus(form: DetalleRegistroDTO ,pantalla:string): Observable<ResponseValidation> {
  this.user = JSON.parse(localStorage.getItem('user'));
  const httpHeadersAuth = new HttpHeaders({
     'Content-Type': 'application/json',
     Authorization: 'Bearer '.concat(this.user.tokenBody.access_token)
  });
 
return this.http.post<ResponseValidation[]>(this.baseEndpointSus, form,
  { observe: 'response', headers: httpHeadersAuth }).pipe(
    (response: any) => {
      return response;
    },
    catchError(e => {
      return throwError(e);
    })
  );
}
}
