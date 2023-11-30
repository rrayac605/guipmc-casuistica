import { Component, OnInit ,Input } from '@angular/core';
import {DetalleConsultaTipoRiesgoDTO} from 'src/app/casuistica/models/control-figures/detalleConsultaTipoRiesgoDTO';


@Component({
  selector: 'app-reporte-tipo-riesgo',
  templateUrl: './reporte-tipo-riesgo.component.html',
  styleUrls: ['./reporte-tipo-riesgo.component.scss']
})
export class ReporteTipoRiesgoComponent implements OnInit {

  @Input() subtituloPadre: string;
  @Input() detalleRegistro: DetalleConsultaTipoRiesgoDTO;
  @Input() detalleDias: DetalleConsultaTipoRiesgoDTO;
  @Input() detallePorcentaje: DetalleConsultaTipoRiesgoDTO;
  @Input() detalleDefunciones: DetalleConsultaTipoRiesgoDTO;

  @Input() detalleRegistro2: DetalleConsultaTipoRiesgoDTO;
  @Input() detalleDias2: DetalleConsultaTipoRiesgoDTO;
  @Input() detallePorcentaje2: DetalleConsultaTipoRiesgoDTO;
  @Input() detalleDefunciones2: DetalleConsultaTipoRiesgoDTO;

    subtitulo:string;
    detalleRegistroPresentacion: DetalleConsultaTipoRiesgoDTO;
    detalleDiasPresentacion: DetalleConsultaTipoRiesgoDTO;
    detallePorcentajePresentacion: DetalleConsultaTipoRiesgoDTO;
    detalleDefuncionesPresentacion: DetalleConsultaTipoRiesgoDTO;

    detalleRegistroPresentacion2: DetalleConsultaTipoRiesgoDTO;
    detalleDiasPresentacion2: DetalleConsultaTipoRiesgoDTO;
    detallePorcentajePresentacion2: DetalleConsultaTipoRiesgoDTO;
    detalleDefuncionesPresentacion2: DetalleConsultaTipoRiesgoDTO;

  constructor() { }

  ngOnInit(): void {
    //alert("EL NITI EN EL TIPO DE RISGO  ");
    this.subtitulo=this.subtituloPadre;
    this.detalleRegistroPresentacion=this.detalleRegistro;
    this.detalleDiasPresentacion=this.detalleDias;
    this.detallePorcentajePresentacion=this.detallePorcentaje;
    this.detalleDefuncionesPresentacion=this.detalleDefunciones;

    this.detalleRegistroPresentacion2=this.detalleRegistro2;
    this.detalleDiasPresentacion2=this.detalleDias2;
    this.detallePorcentajePresentacion2=this.detallePorcentaje2;
    this.detalleDefuncionesPresentacion2=this.detalleDefunciones2;
  }

  get computeYear() { return new Date().getFullYear(); }

}
