import { Injectable } from '@angular/core';
const codigos = [
    {
      codigo: "4030",
      desc: "Número de Seguridad Social"
    },
    {
        codigo: "4032",
        desc: "Registro Patronal"
    },
    {
        codigo: "4061",
        desc: "Delegación de Adscripción"
    },

    {
        codigo: "4062",
        desc: "Subdelegación de Adscripción"
    },
    {
        codigo: "4063",
        desc: "UMF de Adscripción"
    },
    {
        codigo: "4064",
        desc: "Delegación de Atención"
    },
    {
        codigo: "4065",
        desc: "Subdelegación de Atención"
    },
    {
        codigo: "4066",
        desc: "UMF de Expedición"
    },
    {
        codigo: "4067",
        desc: "UMF Pagadora"
    },
    {
        codigo: "4018",
        desc: "Tipo de Riesgo"
    },
    {
        codigo: "5000",
        desc: "Laudo"
    },
    {
        codigo: "4010",
        desc: "Consecuencia"
    },
    {
        codigo: "4014",
        desc: "Días subsidiados"
    },
    {
        codigo: "4020",
        desc: "Porcentaje de Incapacidad"
    },
    {
        codigo: "4012",
        desc: "Fecha de inicio"
    },
    {
        codigo: "4016",
        desc: "Fecha fin"
    },

    {
        codigo: "5001",
        desc: "Fecha de accidente"
    },
   
    {
        codigo: "5002",
        desc: "Fecha de inicio de pensión"
    },
    {
        codigo: "5003",
        desc: "Fecha de accidente"
    },
    {
        codigo: "5004",
        desc: "Fecha de Alta"
    },
    {
        codigo: "5005",
        desc: "Tipo de incapacidad"
    },
   {
       codigo: "5006",
       desc: "Paso Al"
   }   
];
@Injectable({
  providedIn: 'root'
})
export class CodigoErrorUtil {
    static buscarCodigo(codBuscar: string) {
      var validar=0;
      console.log("+++++ EL CODIGO A BUSCAR ES "+codBuscar);
      var descRegresar:string;
      codigos.forEach(value => {
        var codComp:string=value["codigo"];
        console.log(codComp);
        if(codComp === codBuscar){
            validar=1;
            descRegresar=value["desc"];
        }
      })
      if(validar==0){
        console.log("ENTRO AL NAN ");
        descRegresar= "NAN";
      }
      console.log("___________ANTES "+descRegresar);
      return  descRegresar;
    }
}