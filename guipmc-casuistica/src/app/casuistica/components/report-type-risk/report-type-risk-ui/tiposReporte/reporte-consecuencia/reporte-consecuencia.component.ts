import { Component, OnInit ,Input} from '@angular/core';
import {DetalleConsultaConsecuenciaDTO} from 'src/app/casuistica/models/control-figures/detalleConsultaConsecuenciaDTO';


@Component({
  selector: 'app-reporte-consecuencia',
  templateUrl: './reporte-consecuencia.component.html',
  styleUrls: ['./reporte-consecuencia.component.scss']
})
export class ReporteConsecuenciaComponent implements OnInit {
  @Input()  subtituloPadre: string;
  @Input()  detalleConsultaConsecuencia1DTO:DetalleConsultaConsecuenciaDTO[] = [];
  @Input()  detalleConsultaConsecuencia2DTO:DetalleConsultaConsecuenciaDTO[] = [];
  @Input()  detalleConsultaConsecuencia3DTO:DetalleConsultaConsecuenciaDTO[] = [];
  @Input()  detalleConsultaConsecuencia4DTO:DetalleConsultaConsecuenciaDTO[] = [];


   public detalleConsecuencia1Pres:DetalleConsultaConsecuenciaDTO[] = [];
   public detalleConsecuencia2Pres:DetalleConsultaConsecuenciaDTO[] = [];
   public detalleConsecuencia3Pres:DetalleConsultaConsecuenciaDTO[] = [];
   public detalleConsecuencia4Pres:DetalleConsultaConsecuenciaDTO[] = [];

   public totalConsecuencia1:DetalleConsultaConsecuenciaDTO;
   public totalConsecuencia2:DetalleConsultaConsecuenciaDTO;
   public totalConsecuencia3:DetalleConsultaConsecuenciaDTO;
   public totalConsecuencia4:DetalleConsultaConsecuenciaDTO;

  subtitulo:string;
  constructor() { }

  ngOnInit(): void {
    this.subtitulo=this.subtituloPadre;
    this.detalleConsecuencia1Pres=this.detalleConsultaConsecuencia1DTO;
    this.detalleConsecuencia2Pres=this.detalleConsultaConsecuencia2DTO;
    this.detalleConsecuencia3Pres=this.detalleConsultaConsecuencia3DTO;
    this.detalleConsecuencia4Pres=this.detalleConsultaConsecuencia4DTO;

    this.totalConsecuencia1=new DetalleConsultaConsecuenciaDTO();
    this.totalConsecuencia2=new DetalleConsultaConsecuenciaDTO();
    this.totalConsecuencia3=new DetalleConsultaConsecuenciaDTO();
    this.totalConsecuencia4=new DetalleConsultaConsecuenciaDTO();


    this.totalConsecuencia1.numRegistro=0;
    this.totalConsecuencia1.numDias=0;
    this.totalConsecuencia1.porcentaje=0;
    this.detalleConsecuencia1Pres.forEach(value => {
     console.log("------------------------     TOTALES   1 ----------------------- "); 
     console.log(JSON.stringify(value));
     this.totalConsecuencia1.numRegistro=this.totalConsecuencia1.numRegistro+value['numRegistro'];
   
      this.totalConsecuencia1.numDias=this.totalConsecuencia1.numDias+value['numDias'];
      console.log(" ++++"+this.totalConsecuencia1.numRegistro+" SE SUMA A "+value['numRegistro']);
    
      this.totalConsecuencia1.porcentaje=this.totalConsecuencia1.porcentaje+value['porcentaje'];
  })

  this.totalConsecuencia2.numRegistro=0;
  this.totalConsecuencia2.numDias=0;
  this.totalConsecuencia2.porcentaje=0;
  this.detalleConsecuencia2Pres.forEach(value => {
   // console.log("------------------------     TOTALES    ----------------------- "); 
   //console.log(JSON.stringify(value));
   this.totalConsecuencia2.numRegistro=this.totalConsecuencia2.numRegistro+value['numRegistro'];
   this.totalConsecuencia2.numDias=this.totalConsecuencia2.numDias+value['numDias'];
   this.totalConsecuencia2.porcentaje=this.totalConsecuencia2.porcentaje+value['porcentaje'];
})


this.totalConsecuencia3.numRegistro=0;
this.totalConsecuencia3.numDias=0;
this.totalConsecuencia3.porcentaje=0;
this.detalleConsecuencia3Pres.forEach(value => {
 // console.log("------------------------     TOTALES    ----------------------- "); 
 //console.log(JSON.stringify(value));
 this.totalConsecuencia3.numRegistro=this.totalConsecuencia3.numRegistro+value['numRegistro'];
 this.totalConsecuencia3.numDias=this.totalConsecuencia3.numDias+value['numDias'];
 this.totalConsecuencia3.porcentaje=this.totalConsecuencia3.porcentaje+value['porcentaje'];
})


this.totalConsecuencia4.numRegistro=0;
this.totalConsecuencia4.numDias=0;
this.totalConsecuencia4.porcentaje=0;
this.detalleConsecuencia4Pres.forEach(value => {
 // console.log("------------------------     TOTALES    ----------------------- "); 
 //console.log(JSON.stringify(value));
 this.totalConsecuencia4.numRegistro=this.totalConsecuencia4.numRegistro+value['numRegistro'];
 this.totalConsecuencia4.numDias=this.totalConsecuencia4.numDias+value['numDias'];
 this.totalConsecuencia4.porcentaje=this.totalConsecuencia4.porcentaje+value['porcentaje'];
})



  }

}
