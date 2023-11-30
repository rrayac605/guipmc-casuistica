import { AseguradoDTO } from '../aseguradoDTO';
import { PatronDTO } from '../patronDTO';
import { BitacoraErroresDTO } from './bitacoraErroresDTO';


export class ResponseSusValidacion {
       aseguradoDTO: AseguradoDTO;
       patronDTO: PatronDTO;
       cveOrigenArchivo:string;
       objectIdOrigen:string;
       idArchivoDetalleSUS:string;
       existeCambios:boolean;
  }
  