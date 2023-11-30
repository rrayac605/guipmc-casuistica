import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from '../security/security.service';
import { Login } from 'src/app/common/models/security/login';

@Injectable({
  providedIn: 'root'
})
export class Perfil1Guard implements CanActivate {
  public user: Login = new Login();
  constructor(private security: SecurityService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      this.user = JSON.parse(localStorage.getItem('user'));
      if ( this.security.visualizaPerfil1(this.user) ) {
        return true;
      } else {
        this.router.navigate(['/login', {}]);
        return false;
      }
  }

}
