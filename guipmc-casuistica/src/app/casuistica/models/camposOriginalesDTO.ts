export class CamposOriginalesDTO{
  nss: string;
  rp: string;
  fechaInicio: Date;
  tipoRiesgo: string;
  consecuencia: string;
  diasSubsidiados: string;
  procentaje: string;
  fechaFin: Date;
  cambioNss: boolean;
  cambioRp: boolean;
  cveEstadoRegistro?: number;
  desEstadoRegistro?: string;
}
