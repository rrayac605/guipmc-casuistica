import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { FormControlFigure } from 'src/app/casuistica/models/control-figures/form-control-figure';
import { Login } from 'src/app/common/models/security/login';
import { catchError } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class FindControlFiguresService {

  private baseEndpoint = '/cifrascontrol/v1/cifrascontrol';
  private baseEndpointExportPDF = '/cifrascontrol/v1/reportpdf';
  private baseEndpointExportXLSX = '/cifrascontrol/v1/reportxls';

  private userLogin: Login = new Login();

  constructor(private http: HttpClient) { }

  public find(formStatus: FormControlFigure): Observable<any> {
    this.userLogin = JSON.parse(localStorage.getItem('user'));
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

   public exportPDF(formStatus: FormControlFigure): Observable<any> {
    this.userLogin = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({'Content-Type': 'application/json',
    Authorization: 'Bearer '.concat(this.userLogin.tokenBody.access_token)});
    return this.http.post<any>(this.baseEndpointExportPDF, formStatus,
      {observe: 'response', headers: httpHeadersAuth}).pipe(
       (response: any) => {
         return response;
       },
       catchError(e => {
         return throwError(e);
       })
     );
  }
  getExportar3(formStatus: FormControlFigure, spinner: NgxSpinnerService, filename: string = null) {
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


   public exportXLSX(formStatus: FormControlFigure): Observable<any> {
    this.userLogin = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({'Content-Type': 'application/json',
    Authorization: 'Bearer '.concat(this.userLogin.tokenBody.access_token)});
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


}
