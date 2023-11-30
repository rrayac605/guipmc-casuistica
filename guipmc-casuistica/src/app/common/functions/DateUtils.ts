import { Injectable } from '@angular/core';


// tslint:disable-next-line: max-line-length
const months = new Array ('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
// tslint:disable-next-line: max-line-length
const meses = new Array ('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');


@Injectable({
  providedIn: 'root'
})
export class DateUtils {
static monthToEnglish(mes: string) {
  switch (mes) {
    case meses[0]:
        return months[0] + '1';
    case meses[1]:
        return months[1] + '1';
    case meses[2]:
        return months[2] + '1';
    case meses[3]:
        return months[3] + '1';
    case meses[4]:
        return months[4] + '1';
    case meses[5]:
        return months[5] + '1';
    case meses[6]:
        return months[6] + '1';
    case meses[7]:
        return months[7] + '1';
    case meses[8]:
        return months[8] + '1';
    case meses[9]:
        return months[9] + '1';
    case meses[10]:
        return months[10] + '1';
    case meses[11]:
        return months[11] + '1';
}


}

static timeRefresh(segundos: number) {
  var fechams: number = new Date().getTime();
  var sumarsesion = segundos * 1000;
  sumarsesion = sumarsesion - (160000);
  fechams = fechams + sumarsesion;
  return  fechams;
}

static milisecondsRefresh(segundos: number) {
  var sumarsesion = segundos * 1000;
  sumarsesion = sumarsesion - (160000);
  return  sumarsesion;
}


static dateFormat(date: Date){
  return date.toISOString().slice(0, 10);
}

}
