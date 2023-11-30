import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { FormControlFigure } from 'src/app/casuistica/models/control-figures/form-control-figure';
import { Login } from 'src/app/common/models/security/login';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FindTypeReportService {

  private baseEndpoint = '/msreportes/v1/reportesConsultaCodError';
  private baseTipoRiesgoEndpoint = '/msreportes/v1/reportesConsultaTipoRiesgo';
  private baseConcecuenciaEndpoint = '/msreportes/v1/reportesConsultaConcecuencia';
  private baseEndpointPDF = '/msreportes/v1/reportesConsultaCodErrorPDF';
  private baseTipoRiesgoEndpointPDF = '/msreportes/v1/reportesConsultaTipoRiesgoPDF';
  private baseConcecuenciaEndpointPDF = '/msreportes/v1/reportesConsultaConcecuenciaPDF';


  private userLogin: Login = new Login();

  constructor(private http: HttpClient) { }

  public find(formStatus: FormControlFigure): Observable<any> {

    this.userLogin = JSON.parse(localStorage.getItem('user'));
    console.log("ENTRO AL FINND DE REPORTES :" + this.userLogin.tokenBody.access_token);
    const httpHeadersAuth = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer '.concat(this.userLogin.tokenBody.access_token)
    });

    return this.http.post<any>(this.baseEndpoint, formStatus,
      { observe: 'response', headers: httpHeadersAuth }).pipe(
        (response: any) => {
          return response;
        },
        catchError(e => {
          return throwError(e);
        })
      );
  }

  public findPDF(form: FormControlFigure): Observable<any> {
    this.userLogin = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer '.concat(this.userLogin.tokenBody.access_token)
    });
    return this.http.post<any>(this.baseEndpointPDF, form,
      { observe: 'response', headers: httpHeadersAuth }).pipe(
        (response: any) => {
          return response;
        },
        catchError(e => {
          return throwError(e);
        })
      );
  }



  public findTipoRiesgo(formStatus: FormControlFigure): Observable<any> {

    this.userLogin = JSON.parse(localStorage.getItem('user'));
    console.log("ENTRO AL FINND TIPO DE RIESGOS :" + this.userLogin.tokenBody.access_token);
    const httpHeadersAuth = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer '.concat(this.userLogin.tokenBody.access_token)
    });

    return this.http.post<any>(this.baseTipoRiesgoEndpoint, formStatus,
      { observe: 'response', headers: httpHeadersAuth }).pipe(
        (response: any) => {
          return response;
        },
        catchError(e => {
          return throwError(e);
        })
      );
  }

  public findTipoRiesgoPDF(form: FormControlFigure): Observable<any> {
    this.userLogin = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer '.concat(this.userLogin.tokenBody.access_token)
    });
    return this.http.post<any>(this.baseTipoRiesgoEndpointPDF, form,
      { observe: 'response', headers: httpHeadersAuth }).pipe(
        (response: any) => {
          return response;
        },
        catchError(e => {
          return throwError(e);
        })
      );
  }


  public findConcecuencia(formStatus: FormControlFigure): Observable<any> {

    this.userLogin = JSON.parse(localStorage.getItem('user'));
    console.log("ENTRO AL FINND TIPO DE RIESGOS :" + this.userLogin.tokenBody.access_token);
    const httpHeadersAuth = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer '.concat(this.userLogin.tokenBody.access_token)
    });

    return this.http.post<any>(this.baseConcecuenciaEndpoint, formStatus,
      { observe: 'response', headers: httpHeadersAuth }).pipe(
        (response: any) => {
          return response;
        },
        catchError(e => {
          return throwError(e);
        })
      );
  }

  public findConcecuenciaPDF(form: FormControlFigure): Observable<any> {
    this.userLogin = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer '.concat(this.userLogin.tokenBody.access_token)
    });
    return this.http.post<any>(this.baseConcecuenciaEndpointPDF, form,
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
