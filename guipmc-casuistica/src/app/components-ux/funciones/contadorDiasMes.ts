export function diasFaltantes() {
    const fecha = new Date();
    const diaAcutal = fecha.getDate();
    const diasMes =  diasDelMesYAñoActual();


    return diasMes - diaAcutal;
}

export function diasRecorridos() {
    const fecha = new Date();
    const diaAcutal = fecha.getDate();


    return diaAcutal;
}

export function diasDelMesYAñoActual() {
    const fecha = new Date();
    return new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate();
  }
