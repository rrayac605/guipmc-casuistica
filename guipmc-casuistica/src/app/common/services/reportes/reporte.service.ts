import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RequestConsultDictamenSist } from '../../models/reporte/RequestConsultDictamenSist';
import { ResponseConsultDictamenSist } from '../../models/reporte/ResponseConsultDictamenSist';
import { Login } from '../../models/security/login';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private baseEndpointCierreAnual = 'msreportes/v1/reportecierreanual';
  private baseEndPointUpload = 'msreportes/v1/upload';
  private baseEndPointDownload = 'msreportes/v1/dictamen';
  private baseEndPointDownloadST3 = 'msreportes/v1/consultaDictamen';

  private user: Login = new Login();

  constructor(private http: HttpClient) {
  }

  public generar(ooad: string, cicloActual: string, 
    rfc: boolean, subdelegacion: string, global: boolean): Observable<any> {
    return this.http.get<any>(`${this.baseEndpointCierreAnual}?ooad=${ooad}&cicloActual=${cicloActual}&rfc=${rfc}&subdelegacion=${subdelegacion}&global=${global}`, {
      responseType: 'blob' as 'json'
    });
  }

  public uploadFile(formData: FormData, origenAlta: string, nss: string, cveOrigenArchivo: string): Observable<any> {

    const httpHeaders = new HttpHeaders({
      'origenAlta':origenAlta,
      'nss': nss,
      'cveOrigenArchivo': cveOrigenArchivo
    });
    return this.http.post<any>(this.baseEndPointUpload, formData,
      { observe: 'response', headers: httpHeaders }).pipe(
        (response: any) => {
          return response;
        },
        catchError(e => {
          return throwError(e);
        })
      );

  }

  public downloadDictamen(nss: string, nameFile: string): Observable<any> {
    return this.http.get<any>(`${this.baseEndPointDownload}?nss=${nss}&nameFile=${nameFile}`, {
      responseType: 'string' as 'json'
    });
  }

  public downloadDictamenST3(form: RequestConsultDictamenSist): Observable<ResponseConsultDictamenSist> {
    this.user = JSON.parse(localStorage.getItem("user"));
    const httpHeadersAuth = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer ".concat(this.user.tokenBody.access_token),
      "usuario": this.user.tokenInfo.user_id
    });
    return this.http
      .post<ResponseConsultDictamenSist[]>(this.baseEndPointDownloadST3, form, {
        observe: "response",
        headers: httpHeadersAuth,
      })
      .pipe(
        (response: any) => {
          return response;
        },
        catchError((e) => {
          return throwError(e);
        })
      );
  }

}
