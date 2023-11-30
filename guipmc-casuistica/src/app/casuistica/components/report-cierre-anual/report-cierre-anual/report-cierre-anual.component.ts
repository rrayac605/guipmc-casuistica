import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Login} from 'src/app/common/models/security/login';
import {timer} from 'rxjs';
import {ValidateSelect} from 'src/app/common/validators/common.validator';
import {Delegacion} from 'src/app/common/models/delegation.model';
import {DelegationService} from 'src/app/common/services/catalogs/delegation.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { ReporteService } from 'src/app/common/services/reportes/reporte.service';

declare var jQuery: any;
declare var $: any;

interface DelegacionModel {
  ciz: number;
  clave: number;
  descripcion: string;
  id: number;
  subdelegacion: number;
  idSub: string;
}
@Component({
  selector: 'app-report-cierre-anual',
  templateUrl: './report-cierre-anual.component.html',
  styleUrls: ['./report-cierre-anual.component.scss']
})
export class ReportCierreAnualComponent implements OnInit {

  public titulo = ' / Reporte Cierre Anual';
  public formGroup: FormGroup;
  public user: Login = new Login();
  public selectDelegacion: DelegacionModel[] = [];
  public anios = [2021];
  public anioActual: Date = new Date();

  public titDialogo = '';
  public messDialogo = '';

  private areCatalogsLoaded = [false, false, false];

  constructor(private findDelegation: DelegationService,
              private spinner: NgxSpinnerService, private formBuilder: FormBuilder,
              private reporteServie: ReporteService,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.spinner.show();
    }, 0);
    this.user = JSON.parse(localStorage.getItem('user'));
    for (let i=2022; i < this.anioActual.getFullYear(); i++){
      this.anios.push(i);
    }
    this.chargeDelegation();
    this.formGroup = this.formBuilder.group({
        delegation: [-1, Validators.required],
        cicloActual: [-2, Validators.required],
        rfc: [-3, Validators.required]
      }
    );
  }

  public filterDelegation(user: Login) {
    if (user !== null) {
      if (user.userInfo.businessCategory !== undefined && user.userInfo.businessCategory !== null) {
        let subdele = 0;
        let isDesconcentrado = true;
        if(this.user.userInfo.departmentNumber !== undefined && this.user.userInfo.departmentNumber !== null){
          subdele = this.user.userInfo.departmentNumber;

          const result2 = this.selectDelegacion.filter(delegacion => delegacion.idSub === subdele.toString());
          if(result2.length > 0){
            isDesconcentrado = false; 
          }
        }

        if(isDesconcentrado){
          const result = this.selectDelegacion.filter(delegacion => delegacion.id === user.userInfo.businessCategory);
          if (result.length > 0) {
            this.selectDelegacion = result;
            const contador = timer(700);
            contador.subscribe((n) => {
              this.formGroup.get('delegation').setValue(this.user.userInfo.businessCategory.toString());
            });
            this.formGroup.get('delegation').setValidators(Validators.compose([
              Validators.required, ValidateSelect]));
          }
        }else{
          const result = this.selectDelegacion.filter(delegacion => delegacion.idSub === subdele.toString());
          if (result.length > 0) {
            this.selectDelegacion = result;
            const contador = timer(700);
            contador.subscribe((n) => {
              this.formGroup.get('delegation').setValue(result[0].id);
            });
            this.formGroup.get('delegation').setValidators(Validators.compose([
              Validators.required, ValidateSelect]));
          }
        }

      }

    }
  }

  public chargeDelegation() {
    this.findDelegation.find().subscribe(
      (data) => { // Success
        this.areCatalogsLoaded[0] = true;
        // SE anexan delegaciones restantes
        console.log(data);
        data.push({
            ciz: 8,
            clave: '8',
            descripcion: 'JUAREZ 1',
            subdelegacion: '10',
            id: 108,
            idSub : '28'
          },
          {
            ciz: 8,
            clave: '27',
            descripcion: 'HERMOSILLO',
            subdelegacion: '01',
            id: 127,
            idSub : '97'
          },
          {
            ciz: 8,
            clave: '29',
            descripcion: 'MATAMOROS',
            subdelegacion: '19',
            id: 129,
            idSub : '112'
          },
          {
            ciz: 8,
            clave: '26',
            descripcion: 'MAZATLAN',
            subdelegacion: '5',
            id: 126,
            idSub : '96'
          },
          {
            ciz: 8,
            clave: '2',
            descripcion: 'TIJUANA',
            subdelegacion: '5',
            id: 102,
            idSub : '7'
          },
          {
            ciz: 8,
            clave: '5',
            descripcion: 'TORREON',
            subdelegacion: '9',
            id: 105,
            idSub : '14'
          },
          {
            ciz: 8,
            clave: '31',
            descripcion: 'VERACRUZ PUERTO',
            subdelegacion: '12',
            id: 131,
            idSub : '117'
          },
          {
            ciz: 0,
            clave: '0',
            descripcion: '--',
            subdelegacion: '0',
            id: 0,
            idSub : '0'
          });
        this.validateIfCatalogsAreLoaded();
        this.selectDelegacion = data;
        this.filterDelegation(this.user);
        console.log(this.selectDelegacion);
      },
      (error) => {
        this.areCatalogsLoaded[0] = true;
        this.validateIfCatalogsAreLoaded();
        console.error(error);
      }
    );

  }

  private validateIfCatalogsAreLoaded() {
    if (this.areCatalogsLoaded.reduce((prev, current) => prev && current)) {
      this.spinner.hide();
    }
  }

  public clear() {
  }
  public hideMessage() {
    $('#dialogMessage').modal('hide');
  }
  public show(title, message) {
    console.log('showmessa');
    this.titDialogo = title;
    this.messDialogo = message;
    $('#dialogMessage').modal('show');
  }

  public generar() {
    console.log('-----------Generando------------');
    if (this.formGroup.controls.cicloActual.value !== -1 && this.formGroup.controls.delegation.value !== -1) {

      const delegacion = this.selectDelegacion.find(del => del.id == this.formGroup.controls.delegation.value);

      const global = delegacion.id === 0 ? true : false;
      this.spinner.show();
      this.reporteServie.generar(delegacion.clave + '',
        this.formGroup.controls.cicloActual.value,
        !!this.formGroup.controls.rfc.value,
        delegacion.subdelegacion ? delegacion.subdelegacion + '' : '0',
        global
      ).subscribe((response: any) => {
        if (response == null || response.status === 204) {
          this.show("",'El proceso de cierre anual de la casuística del año de revisión seleccionado no se ha ejecutado, favor de intentar nuevamente después del 15 de Marzo.');
          return;
        }
        const dataType = response.type;
        const binaryData = [];
        binaryData.push(response);
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
        // if (filename)
        downloadLink.setAttribute('download', 'ReporteCierreAnual.xlsx');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
      });
    } else {
      this.show("Campos requeridos", "Ingresar datos requeridos.");
    }
  }
}