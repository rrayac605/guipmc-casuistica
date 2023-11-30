import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { FormControlFigure } from 'src/app/casuistica/models/control-figures/form-control-figure';
import { Login } from 'src/app/common/models/security/login';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FindControlFiguresCausiticaService {

  private baseEndpoint = '/mscifrascasuistica/v1/cifrascasuistica';
  private baseEndpointExportPDF = '/mscifrascasuistica/v1/reportpdf';

  private endpointMovimientosCIC = '/mscifrascasuistica/v1/movimientosCasuistica';
  private endpointExportMovimientosCICPDF = '/mscifrascasuistica/v1/movimientosCICReport';

  private userLogin: Login = new Login();

  constructor(private http: HttpClient) { }

  public find(formStatus: FormControlFigure): Observable<any> {
    this.userLogin = JSON.parse(localStorage.getItem('user'));
    //console.log("ENTRO AL FINND 2"+this.userLogin.tokenBody.access_token);
    const httpHeadersAuth = new HttpHeaders({'Content-Type': 'application/json',
    Authorization: 'Bearer '.concat(this.userLogin.tokenBody.access_token)});
    return this.http.post<any>(this.baseEndpoint, formStatus,
      {observe: 'response', headers: httpHeadersAuth}).pipe(
       (response: any) => {
         return response;
       },
       catchError(e => {
         return throwError(e);
       })
     );
   }

   getExportPDF(formStatus: FormControlFigure): Observable<any> {
     const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.baseEndpointExportPDF, formStatus,
     {observe: 'response', headers: httpHeaders}).pipe(
      (response: any) => {
        return response;
      },
      catchError(e => {
        return throwError(e);
      })
    );
  }

   public findMovimientos(formStatus: FormControlFigure): Observable<any> {
    this.userLogin = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({'Content-Type': 'application/json',
    Authorization: 'Bearer '.concat(this.userLogin.tokenBody.access_token)});
    return this.http.post<any>(this.endpointMovimientosCIC, formStatus,
      {observe: 'response', headers: httpHeadersAuth}).pipe(
       (response: any) => {
         return response;
       },
       catchError(e => {
         return throwError(e);
       })
     );
   }

  public exportMovimientosPDF(formStatus: FormControlFigure): Observable<any> {
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.endpointExportMovimientosCICPDF, formStatus,
      {observe: 'response', headers: httpHeaders}).pipe(
       (response: any) => {
         return response;
       },
       catchError(e => {
         return throwError(e);
       })
     );
  }




}
