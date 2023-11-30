import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { DetailSearchRecordsDTO } from 'src/app/casuistica/models/search-records/detailSearchRecordsDTO';
import { catchError } from 'rxjs/operators';
import { FormSearchRecords } from 'src/app/casuistica/models/search-records/form-search-records';
import { FormSearchDetailRecords } from 'src/app/casuistica/models/records-detail/form-search-detail-records';
import { Login } from 'src/app/common/models/security/login';
import { ResponseDTO } from '../../models/responseDTO';

@Injectable({
  providedIn: 'root'
})
export class MovementsService {

  private baseEndpoint = 'msmovimientos/v1/movimientos';
  private detalleEndpoint = 'msmovimientos/v1/detallemovimientos';
  private userLogin: Login = new Login();

  constructor(private http: HttpClient) { }

  getMovimientos(searchRecords: FormSearchRecords): Observable<ResponseDTO<DetailSearchRecordsDTO[]>> {
    this.userLogin = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({'Content-Type': 'application/json',
    Authorization: 'Bearer '.concat(this.userLogin.tokenBody.access_token)});
    return this.http.get<DetailSearchRecordsDTO[]>(this.baseEndpoint + this.getQueryParams(searchRecords),
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
    this.userLogin = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({'Content-Type': 'application/json',
    Authorization: 'Bearer '.concat(this.userLogin.tokenBody.access_token)});
    return this.http.get<DetailSearchRecordsDTO[]>(this.detalleEndpoint + this.getDetailQueryParams(searchRecord),
     {observe: 'response', headers: httpHeadersAuth}).pipe(
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

  if (searchRecords.cveDelegacion !== undefined && searchRecords.cveDelegacion.length > 0 && searchRecords.cveDelegacion !== '-1' ) {
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
  if (searchRecords.cveEstadoArchivo !== undefined && searchRecords.cveEstadoArchivo.length > 0
    && searchRecords.cveEstadoArchivo !== '-1') {
    myQuery += 'cveEstadoArchivo' + '=' + encodeURIComponent(searchRecords.cveEstadoArchivo) + '&';
  }
  if (searchRecords.campoSugerido !== undefined && searchRecords.campoSugerido === '2' &&
    searchRecords.numNss !== undefined && searchRecords.numNss.length > 0 ) {
    myQuery += 'numNss' + '=' + encodeURIComponent(searchRecords.numNss) + '&';
  }
  if (searchRecords.campoSugerido !== undefined && searchRecords.campoSugerido === '1' &&
    searchRecords.refRegistroPatronal !== undefined && searchRecords.refRegistroPatronal.length > 0 ) {
    myQuery += 'refRegistroPatronal' + '=' + encodeURIComponent(searchRecords.refRegistroPatronal) + '&';
  }
  if (searchRecords.cveSituacionRegistro !== undefined && searchRecords.cveSituacionRegistro.length > 0
    && searchRecords.cveSituacionRegistro !== '-1') {
    myQuery += 'cveSituacionRegistro' + '=' + encodeURIComponent(searchRecords.cveSituacionRegistro) + '&';
  }
  if (searchRecords.cveEstadoRegistro !== undefined && searchRecords.cveEstadoRegistro.length > 0
    && searchRecords.cveEstadoRegistro !== '-1') {
    myQuery += 'cveEstadoRegistro' + '=' + encodeURIComponent(searchRecords.cveEstadoRegistro) + '&';
  }
  if (searchRecords.cveEstadoRegistroList !== undefined && searchRecords.cveEstadoRegistroList.length > 0) {
    myQuery += 'cveEstadoRegistroList' + '=' + encodeURIComponent(searchRecords.cveEstadoRegistroList.toString()) + '&';
  }

  if (searchRecords.page !== undefined && searchRecords.page > 0) {
    myQuery += 'page' + '=' + encodeURIComponent(searchRecords.page) + '&';
  }

  if (searchRecords.totalElements !== undefined && searchRecords.totalElements > 0) {
    myQuery += 'totalElements' + '=' + encodeURIComponent(searchRecords.totalElements) + '&';
  }
  if (searchRecords.origenAlta && searchRecords.origenAlta === 'EP') {
    myQuery += `origenAlta=${encodeURIComponent(searchRecords.origenAlta)}&`;
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

  // remove last '&'
  myQuery = myQuery.substring(0, myQuery.length - 1);
  return myQuery;
 }


}
