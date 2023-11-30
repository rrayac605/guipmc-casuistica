import { Component, OnInit, Input } from '@angular/core';
import { Login } from 'src/app/common/models/security/login';
import { Router, NavigationEnd } from '@angular/router';
import { SecurityService } from 'src/app/common/services/security/security.service';
import { timer } from 'rxjs/internal/observable/timer';
import { filter } from 'rxjs/operators';
import { NgZone } from '@angular/core';
import Swal from 'sweetalert2';
import { TokenBody } from 'src/app/common/models/security/tokenBody';
import { NgxSpinnerService } from 'ngx-spinner';
import { browserRefresh } from '../../app.component';
import { DateUtils } from 'src/app/common/functions/DateUtils';
import { OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LifeTimeSessionService } from 'src/app/common/services/security/life-time-session.service';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  // private subscription: Subscription = new Subscription();
  @Input() public loginOutput: number;

  public contador$: Observable<number>;
  public user: Login = new Login();
  public viewMovimientos: boolean;
  public viewCifrasControl: boolean;
  public viewEstatusArchivo: boolean;
  public viewAltaCasuistica: boolean;
  public viewAltaAprobacion: boolean;
  public viewConsultarCasuistry: boolean;
  public expireTokenRes;
  loginOutput2 = new Login();
   tokenBody = new TokenBody();

  constructor(private router: Router, private security: SecurityService,
              private lifeTimeSessionService: LifeTimeSessionService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));

    this.viewMovimientos = this.security.visualizaPerfil2(this.user) || this.security.visualizaPerfil3(this.user) ||
                            this.security.visualizaPerfil4(this.user);
    this.viewCifrasControl = this.security.visualizaPerfil5(this.user);
    this.viewEstatusArchivo = this.viewCifrasControl;
    this.viewAltaCasuistica = this.security.visualizaPerfil1(this.user);
    this.viewAltaAprobacion = this.security.visualizaPerfil6(this.user);
    this.viewConsultarCasuistry = this.security.visualizaConsultarCasuistry(this.user);

    if (browserRefresh) {
        const expireToken = JSON.parse(localStorage.getItem('expireToken'));
        const timeRemaining = expireToken - new Date().getTime();
        if (timeRemaining > 0) {
            this.lifeTimeSessionService.updateLifeTime(expireToken);
        } else {
          this.router.navigate(['/login', {}]);
        }
      }

  }

  public goToBuscarMovimientos() {
    this.router.navigate(['/searchRecords', {}]);
  }

  public goToBuscarCasuistica() {
    this.router.navigate(['/searchRecordsCasuistry', {}]);
  }

  public goToConsultarCasuistica() {
    this.router.navigate(['/recordsDetailUiComponent', {}]);
  }

  public goToCifrasControlSub() {
    this.router.navigate(['/searchRecordsCausiticaUiComponent', {}]);
  }

  public goToConsultarMovimientosCIC() {
    this.router.navigate(['/movementsCasuistry', {}]);
  }

  public goToCifrasControl() {
    this.router.navigate(['/controlFigures', {}]);
  }

  public goToEstatusArchivos() {
    this.router.navigate(['/searchStatusFiles', {}]);
  }

  public goToCifrasIntegracionCasuistica() {
    this.router.navigate(['/recordsDetailUiComponent', {}]);
  }

  public goToReportes() {
    this.router.navigate(['/recordsDetailUiComponent', {}]);
  }

  public goToAltaCasuistica() {
    this.router.navigate(['/createCasuistry', {}]);
  }

  public goToDetalleCasuistica() {
    this.router.navigate(['/consultCasuistry', {}]);
  }
  public goToReporteTipoRiesgo() {
    this.router.navigate(['/reportTypeRiskComponent', {}]);
  }

  public goToAltaAprovacion() {
    this.router.navigate(['/createCasuistrySt', {}]);
  }
  public goToReporteCierreAnual() {
    this.router.navigate(['/reportCierreAnual', {}]);
  }

  say() {
    console.log('hola');
  }

    ngOnDestroy() {
  }
}
