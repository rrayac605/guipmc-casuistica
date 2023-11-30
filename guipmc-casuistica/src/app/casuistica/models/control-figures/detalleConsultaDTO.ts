export class DetalleConsultaDTO {
    tipoArchivo: string;
    desDelegacion: string;
    numTotalRegistros: number;
    numRegistrosCorrectos: number;
    numRegistrosCorrectosOtras: number;
    numRegistrosErrorOtras: number;
    numRegistrosError: number;
    numRegistrosSusOtras: number;
    numRegistrosDupOtras: number;
    numRegistrosBaja: number;
    numRegistrosBajaOtras: number;
    numRegistrosDup: number;
    numRegistrosSus: number;
}

export interface CifrasControlMovimientosResponseDTO {
    _id: string;
    correcto: number;
    erroneo: number;
    duplicado: number;
    susceptible: number;
    correctoOtras: number;
    erroneoOtras: number;
    duplicadoOtras: number;
    susceptibleOtras: number;
    baja: number;
    bajaOtrasDelegaciones: number;
    total: number;
    cveOrigenArchivo: string;
}
