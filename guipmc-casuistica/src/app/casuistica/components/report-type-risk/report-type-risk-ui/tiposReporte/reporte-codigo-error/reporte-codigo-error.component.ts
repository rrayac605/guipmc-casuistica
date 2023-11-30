import { Component, OnInit ,Input, OnChanges } from '@angular/core';
import { DetalleConsultaCodErrorDTO } from 'src/app/casuistica/models/control-figures/detalleConsultaCodErrorDTO';
import { DetalleTotalesCodErrorDTO } from 'src/app/casuistica/models/control-figures/detalleTotalesCodErrorDTO';

@Component({
  selector: 'app-reporte-codigo-error',
  templateUrl: './reporte-codigo-error.component.html',
  styleUrls: ['./reporte-codigo-error.component.scss']
})
export class ReporteCodigoErrorComponent implements OnInit, OnChanges {
  @Input() subtituloPadre: string;
  @Input() detalleConsultaCodErrorDTO: DetalleConsultaCodErrorDTO[];
  @Input() detalleTotalesCodErrorDTO: DetalleTotalesCodErrorDTO;
  @Input() mapAnteriorNuevo: Map<string, DetalleConsultaCodErrorDTO>;
  detallePresentacion: DetalleConsultaCodErrorDTO[];
  detalleTotalPresentacion:DetalleTotalesCodErrorDTO;
  subtitulo:string;
  constructor() { }

  ngOnInit(): void {
    this.detallePresentacion=this.detalleConsultaCodErrorDTO;
    this.detalleTotalPresentacion=this.detalleTotalesCodErrorDTO;
    console.log("ENTRO A LA CONPONENTE DE REPORTE CODIGO  "+JSON.stringify(this.detalleConsultaCodErrorDTO)); 
    this.subtitulo=this.subtituloPadre;
  }

  ngOnChanges(): void{
    console.log("Mapa recibido ---> ", this.mapAnteriorNuevo);
  }

}
