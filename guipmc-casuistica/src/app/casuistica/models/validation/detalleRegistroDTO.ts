import { AseguradoDTO } from '../aseguradoDTO';
import { PatronDTO } from '../patronDTO';
import { IncapacidadDTO } from '../incapacidadDTO';
import { BitacoraErroresDTO } from './bitacoraErroresDTO';
import { Auditorias } from '../auditorias';

export class DetalleRegistroDTO {
  aseguradoDTO: AseguradoDTO;
  patronDTO: PatronDTO;
  incapacidadDTO: IncapacidadDTO;
  bitacoraErroresDTO: BitacoraErroresDTO[];
  auditorias: Auditorias[];
  fecProcesoCarga: Date;
  objectIdOrigen: string;
  desObservacionesSol: string;
  desObservacionesAprobador: string;
  desSituacionRegistro: string;
  cveSituacionRegistro: number;
  cveOrigenArchivo: string;
  origenAlta: string;
  objectIdArchivoDetalle: string;
  numNss: string;
  public listaSuceptible: string[] = [];
  origenPantalla:string ;
  existeRelacionLaboral: boolean;
  

}
