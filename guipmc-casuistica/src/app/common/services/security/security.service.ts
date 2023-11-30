import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { FormLogin } from 'src/app/common/models/security/formLogin';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Login } from 'src/app/common/models/security/login';
import { Router } from '@angular/router';
import { TokenBody } from 'src/app/common/models/security/tokenBody';
// tslint:disable-next-line: max-line-length

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  getJwtToken() {
    throw new Error("Method not implemented.");
  }

  private getToken = 'msseguridad/v1/logintoken';
  private logoutURL = 'msseguridad/v1/logout';
  private refreshURL = 'msseguridad/v1/refresh';

  public user: Login = new Login();


  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});


  constructor(private http: HttpClient, private router: Router) { }

  getTokenLogin(login: FormLogin): Observable<Login> {
    localStorage.clear();
    return this.http.post<Login>(this.getToken, login,
     {observe: 'response', headers: this.httpHeaders}).pipe(
      (response: any) => {
        return response;
      },
      catchError(e => {
        return throwError(e);
      })
    );
  }

  logout(user: Login): Observable<any> {
    console.log('estas en el servicio de logout ****************************************');
    const httpHeadersAuth = new HttpHeaders({'Content-Type': 'application/json',
    Authorization: 'Bearer '.concat(user.tokenBody.access_token)});
    return this.http.post<any>(this.logoutURL, {refresh_token: user.tokenBody.refresh_token},
     {observe: 'response', headers: httpHeadersAuth}).pipe(
      (response: any) => {
        return response;
      },
      catchError(e => {
        return throwError(e);
      })
    );
    localStorage.clear();
  }

  refresh(user: Login): Observable<TokenBody> {
    console.log('este es el refresh token ');
    console.log(user.tokenBody.refresh_token);
    const httpHeadersAuth = new HttpHeaders({'Content-Type': 'application/json',
    Authorization: 'Bearer '.concat(localStorage.getItem('acces_token'))});
    return this.http.post<TokenBody>(this.refreshURL, {refresh_token: user.tokenBody.refresh_token},
     {observe: 'response', headers: httpHeadersAuth}).pipe(
      (response: any) => {
        return response;
      },
      catchError(e => {
        return throwError(e);
      })
    );
    localStorage.clear();
  }

  public getQueryParams(login: FormLogin) {
    let myQuery = '?';

    if (login.usrName !== undefined && login.usrName.length > 0) {
      myQuery += 'usrName' + '=' + encodeURIComponent(login.usrName) + '&';
    }
    if (login.password !== undefined && login.password.length > 0) {
      myQuery += 'password' + '=' + encodeURIComponent(login.password) + '&';
    }
    // remove last '&'
    myQuery = myQuery.substring(0, myQuery.length - 1);
    return myQuery;
   }

  public estaLogueado() {
    this.user = JSON.parse(localStorage.getItem('user'));
    return ( this.user !== null && this.user.tokenBody.access_token.length > 500 ) ? true : false;
  }

  public visualizaPerfil1(user: Login) {
    let result =  false;
    this.user = JSON.parse(localStorage.getItem('user'));
    if (user !== null) {
      const t = this.user.userInfo.imssperfiles.split(',');
      const perfil1: string[] = ['JEFE DE OFICINA DE CLASIFICACION DE EMPRESAS', 'ESPECIALISTA CLASIFICACION',
      'TITULAR DE LA COORDINACION DE PRESUPUESTO Y GESTION DEL GASTO EN SERVICIOS PERSONALES',
      'JEFE DE AREA DE OBLIGACIONES LABORALES', 'JEFE DE DEPARTAMENTO DE SUPERVISION DE AFILIACION VIGENCIA',
      'JEFE DE DEPARTAMENTO AFILIACION VIGENCIA', 'TITULAR DE LA DIVISION DE RELACIONES LABORALES',
      'VENTANILLA CE'];
      t.forEach(function(item) {
        const perfiles = perfil1.filter(perfil => perfil === item);
        if (perfiles.length > 0) {
          result = true;
        }
      });

      return result;
    }
  }

  public visualizaPerfil2(user: Login) {
    let result =  false;
    this.user = JSON.parse(localStorage.getItem('user'));
    if (user !== null) {
      const t = this.user.userInfo.imssperfiles.split(',');
      const perfil2: string[] = ['JEFE DE DEPARTAMENTO DE SUPERVISION DE AFILIACION VIGENCIA',
      'JEFE DE DEPARTAMENTO AFILIACION VIGENCIA', 'JEFE DE OFICINA DE CLASIFICACION DE EMPRESAS',
      'ESPECIALISTA CLASIFICACION', 'TITULAR DE LA COORDINACION DE PRESUPUESTO Y GESTION DEL GASTO EN SERVICIOS PERSONALES',
      'TITULAR DE LA DIVISION DE OBLIGACIONES PATRONALES', 'JEFE DE AREA DE OBLIGACIONES LABORALES',
      'TITULAR DE LA DIVISION DE RELACIONES LABORALES', 'MEDICO OPERATIVO DE SALUD EN EL TRABAJO',
      'VENTANILLA CE'];
      t.forEach(function(item) {
        const perfiles = perfil2.filter(perfil => perfil === item);
        if (perfiles.length > 0) {
          result = true;
        }
      });

      return result;
    }
  }

  public visualizaPerfil3(user: Login) {
    let result =  false;
    this.user = JSON.parse(localStorage.getItem('user'));
    if (user !== null) {
      const t = this.user.userInfo.imssperfiles.split(',');
      const perfil3: string[] = ['JEFE DE OFICINA DE CLASIFICACION DE EMPRESAS', 'ESPECIALISTA CLASIFICACION',
            'TITULAR DE LA COORDINACION DE PRESUPUESTO Y GESTION DEL GASTO EN SERVICIOS PERSONALES',
            'JEFE DE AREA DE OBLIGACIONES LABORALES', 'JEFE DE DEPARTAMENTO DE SUPERVISION DE AFILIACION VIGENCIA',
            'JEFE DE DEPARTAMENTO AFILIACION VIGENCIA', 'TITULAR DE LA DIVISION DE RELACIONES LABORALES',
            'VENTANILLA CE'];
      t.forEach(function(item) {
        const perfiles = perfil3.filter(perfil => perfil === item);
        if (perfiles.length > 0) {
          result = true;
        }
      });

      return result;
    }
  }

  public visualizaPerfil4(user: Login) {
    let result =  false;
    this.user = JSON.parse(localStorage.getItem('user'));
    if (user !== null) {
      const t = this.user.userInfo.imssperfiles.split(',');
      const perfil4: string[] = ['JEFE DE DEPARTAMENTO DE SUPERVISION DE AFILIACION VIGENCIA',
       'JEFE DE DEPARTAMENTO AFILIACION VIGENCIA', 'TITULAR DE LA DIVISION DE OBLIGACIONES PATRONALES',
       'JEFE DE OFICINA DE CLASIFICACION DE EMPRESAS', 'TITULAR DE LA DIVISION DE RELACIONES LABORALES',
       'ESPECIALISTA CLASIFICACION', 'JEFE DE AREA DE OBLIGACIONES LABORALES', 'VENTANILLA CE'];
      t.forEach( function( item ) {
        const perfiles = perfil4.filter(perfil => perfil === item);
        if (perfiles.length > 0) {
          result = true;
         }
      });

      return result;
    }
  }

  public visualizaPerfil5(user: Login) {
    let result =  false;
    this.user = JSON.parse(localStorage.getItem('user'));
    if (user !== null) {
      const t = this.user.userInfo.imssperfiles.split(',');
      const perfil5: string[] = ['TITULAR DE LA DIVISION DE ADMINISTRACION DE LA PRIMA DEL SEGURO DE RIESGOS DE TRABAJO',
                                 'TITULAR DE LA SUBJEFATURA DE DIVISION DE INTEGRACION DE CASUISTICA'];
      t.forEach( function( item ) {
        const perfiles = perfil5.filter(perfil => perfil === item);
        if (perfiles.length > 0) {
          result = true;
        }
      });

      return result;
    }
  }

//Salud en el trabajo
  public visualizaPerfil6(user: Login) {
    let result =  false;
    this.user = JSON.parse(localStorage.getItem('user'));
    if (user !== null) {
      const t = this.user.userInfo.imssperfiles.split(',');
      const perfil6: string[] = ['MEDICO OPERATIVO DE SALUD EN EL TRABAJO'];
      t.forEach( function( item ) {
        const perfiles = perfil6.filter(perfil => perfil === item);
        if (perfiles.length > 0) {
          result = true;
        }
      });

      return result;
    }
  }

  public visualizaConsultarCasuistry(user: Login) {
    let result = false;
    this.user = JSON.parse(localStorage.getItem('user'));
    if(user != null) {
      const t = this.user.userInfo.imssperfiles.split(',');
      const consultaCasuistica: string[] = ['DELEGADO', 'JEFE DE SERVICIOS DE AFILIACION Y COBRANZA',
        'JEFE DE DEPARTAMENTO DE SUPERVISION DE AFILIACION VIGENCIA', 'SUBDELEGADO',
        'JEFE DE DEPARTAMENTO AFILIACION VIGENCIA', 'JEFE DE OFICINA DE CLASIFICACION DE EMPRESAS',
        'ESPECIALISTA CLASIFICACION', 'JEFE DE DIVISION NORMATIVA DE PRESTACIONES ECONOMICAS',
        'JEFE DE UNIDAD DE PRESTACIONES ECONOMICAS Y SALUD EN EL TRABAJO',
        'TITULAR DE LA DIVISION DE ADMINISTRACION DE LA PRIMA EN EL SEGURO DE RIESGOS DE TRABAJO',
        'TITULAR DE LA OFICINA DE EJERCICIO PRESUPUESTAL Y OBLIGACIONES (OEPO)',
        'TITULAR DE LA DIVISION DE RELACIONES LABORALES', 'JEFE DE AREA DE OBLIGACIONES LABORALES',
        'TITULAR DE LA SUBJEFATURA DE DIVISION DE INTEGRACION DE CASUISTICA',
        'TITULAR DE LA DIVISION DE ADMINISTRACION DE LA PRIMA DEL SEGURO DE RIESGOS DE TRABAJO',
        'MEDICO OPERATIVO DE SALUD EN EL TRABAJO'];
      t.forEach(function(item) {
        const perfiles = consultaCasuistica.filter(perfil => perfil === item);
        if(perfiles.length > 0) {
          result = true;
        }
      });
      return result;
    }
  }

  public visualizaReporteCierreAnual(user: Login) {
    let result = false;
    this.user = JSON.parse(localStorage.getItem('user'));
    if(user != null) {
      const t = this.user.userInfo.imssperfiles.split(',');
      const consultaCasuistica: string[] = ['DELEGADO',
        'JEFE DE AFILIACION COBRANZA',
        'SUBDELEGADO',
        'JEFE DE DEPARTAMENTO DE SUPERVISION DE AFILIACION VIGENCIA',
        'JEFE DE DEPARTAMENTO DE AFILIACION VIGENCIA',
        'JEFE DE OFICINA DE CLASIFICACION DE EMPRESAS',
        'ESPECIALISTA DE CLASIFICACION DE EMPRESAS',
        'NORMATIVO PRESTACIONES ECONOMICAS',
        'NORMATIVO SALUD EN EL TRABAJO',
        'NORMATIVO CCEVD',
        'RH IMSS NORMATIVO',
        'RH IMSS OPERATIVO',
        'JEFE RH IMSS NORMATIVO',
        'MEDICO OPERATIVO DE SALUD EN EL TRABAJO',
        'TITULAR DE LA SUBDIVISION DE INTEGRACION DE CASUISTICA.',
        'TITULAR DE LA DIVISION DE ADMINISTRACION DE LA PRIMA DEL SEGURO DE RIESGOS DE TRABAJO',
        'ESPECIALISTA CLASIFICACION',
        'TITULAR DE LA SUBJEFATURA DE DIVISION DE INTEGRACION DE CASUISTICA',
        'TITULAR DE LA OFICINA DE EJERCICIO PRESUPUESTAL Y OBLIGACIONES (OEPO)',
        'TITULAR DE LA DIVISION DE RELACIONES LABORALES',
        'JEFE DE AREA DE OBLIGACIONES LABORALES',
        'JEFE DE SERVICIOS DE AFILIACION Y COBRANZA',
        'JEFE DE DEPARTAMENTO AFILIACION VIGENCIA',
        'JEFE DE UNIDAD DE PRESTACIONES ECONOMICAS Y SALUD EN EL TRABAJO',
        'TITULAR DE LA COORDINACION DE PRESUPUESTO Y GESTION DEL GASTO EN SERVICIOS PERSONALES',
        'VENTANILLA CE',
        'TITULAR DE LA DIVISION DE OBLIGACIONES PATRONALES',
        'JEFE DE DIVISION NORMATIVA DE PRESTACIONES ECONOMICAS'];
      t.forEach(item => {
        const perfiles = consultaCasuistica.filter(perfil => perfil === item);
        if (perfiles.length > 0) {
          result = true;
        }
      });
      return result;
    }
  }

  cleanItems(): void {
    //localStorage.clear();
    localStorage.removeItem('expireToken');
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    this.router.navigate(["/login"]);
  }
}
