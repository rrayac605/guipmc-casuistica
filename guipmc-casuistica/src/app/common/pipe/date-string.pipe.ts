import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateString'
})
export class DateStringPipe implements PipeTransform {

  transform(value: Date, type: string = 'Date'): string {
    if (value) {
      const date = new Date(value);
      switch (type.toUpperCase()) {
        case 'FULL':
          return `${this.adjustDateStyle(date.toLocaleDateString())} ${this.adjustHoursStyle(date.toLocaleTimeString())}`;
        case 'HOURS':
          return this.adjustHoursStyle(date.toLocaleTimeString());
        case 'DATE':
        default:
          return this.adjustDateStyle(date.toLocaleDateString());
      }
    }
    return '';
  }

  private adjustDateStyle(date: string): string {
    let splittedDate = date.split('/');
    splittedDate = splittedDate.map(digit => digit.length < 2 ? `0${digit}` : digit);
    return splittedDate.join('/');
  }

  private adjustHoursStyle(hours: string) {
    let splittedHours = hours.split(':');
    splittedHours = splittedHours.slice(0, 2);
    splittedHours = splittedHours.map(digit => digit.length < 2 ? `0${digit}` : digit);
    return splittedHours.join(':');
  }

}
