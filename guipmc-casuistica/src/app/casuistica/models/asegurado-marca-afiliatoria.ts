import { Subdelegacion } from "./subdelegacion";
import { Umf } from "./umf";

export class AseguradoMarcaAfiliatoria {
    agregadoAfiliacion:string;
    agregadoMedico:string;
    bajaNss:boolean;
    consultorio:string;
    cubeta:boolean;
    curp:string;
    cveIdAsignacionNssGrupoFamiliar:number;
    cveIdPersona:number;
    datosPersonaRenapo:string;
    domicilio:string;
    estadoCivil:any;
    estadoDerechohabiente:string;
    fechaDefuncion:string;
    fechaFinVigencia:string;
    fechaInicioVigencia:string;
    fechaNacimiento:string;
    lugarNacimiento:string;
    nombre:string;
    nss:string;
    nssCabezaGrupoFamiliar:string;
    ooad:string;
    pais:string;
    parentesco:any;
    primerApellido:string;
    rfc:string;
    segundoApellido:string;
    sexo:any;
    subdelegacion:Subdelegacion;
    subEstadoDerechohabiente:string;
    turno:any;
    umf:Umf;
}
