import { AseguradoDTO } from '../aseguradoDTO';
import { PatronDTO } from '../patronDTO';
import { IncapacidadDTO } from '../incapacidadDTO';
import { ErroresDTO } from '../erroresDTO';
import { Auditorias } from '../auditorias';

export class RecordsDetailInfo {
  aseguradoDTO: AseguradoDTO =  new AseguradoDTO();
  patronDTO: PatronDTO =  new PatronDTO();
  incapacidadDTO: IncapacidadDTO = new IncapacidadDTO();
  bitacoraErroresDTO: ErroresDTO[] = [];
  fecProcesoCarga: Date;
  objectIdOrigen: string;
  desObservacionesSol: string;
  desObservacionesAprobador: string;
  desSituacionRegistro: string;
  cveSituacionRegistro: number;
  auditorias: Auditorias[] = [];
  isPending?: boolean;
  idOrigenAlta?: any;
  identificador: string;
  cveOrigenArchivo?: string;
}
