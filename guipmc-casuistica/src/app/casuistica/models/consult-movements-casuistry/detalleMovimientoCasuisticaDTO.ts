export class DetalleMovimientoCasuisticaDTO {
  tipoEntrada: string;
  desDelegacion: string;
  numRegistrosCorrectos: number;
  numRegistrosErroneos: number;
  numRegistrosDuplicados: number;
  numRegistrosSusAjuste: number;
  numTotalRegistros: number;

  numRegistrosCorrectosOtrDel: number;
  numRegistrosErroneosOtrDel: number;
  numRegistrosDuplicadosOtrDel: number;
  numRegistrosSusAjusteOtrDel: number;
  numTotalRegistrosOtrDel: number;

  numTotalGenerales: number;
}
