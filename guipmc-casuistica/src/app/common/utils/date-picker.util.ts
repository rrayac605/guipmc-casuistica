import { FormControl } from '@angular/forms';
import { DateUtils } from 'src/app/common/functions/DateUtils';

declare var $: any;

export const months: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
  'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export const shortNameMonths: string[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export type MessageFunction = (message: string, title: string) => void;

export type CycleYearFunction = (date: string, messageFunction: MessageFunction, dateForm: FormControl) => void;

export type PeriodFunction = (date: string, fromDateForm: FormControl, toDateForm: FormControl, messageFunction: MessageFunction) => void;

export interface CalendarOptions {
  yearRange?: string;
  dateFormat?: string;
  showDays?: boolean;
}

let yMouse = 0;

export function onMouseMove(id: string) {
  $(id).mousemove((event) => {
    yMouse = 0;
    yMouse = event.pageY - event.offsetY + 15;
  });
}

export function chargeBeginCalendar(beginId: string, toDateForm: FormControl, dateForm: FormControl, messageFunction: MessageFunction,
                                    options: CalendarOptions = { dateFormat: 'MM yy', showDays: false },
                                    cycleYearFunction: CycleYearFunction = validateCycleYear,
                                    periodFunction: PeriodFunction = validatePeriod) {
  onMouseMove(beginId);
  const { showDays } = options;
  $(beginId).datepicker({
    closeText: 'Cerrar',
    prevText: '<Ant',
    nextText: 'Sig>',
    currentText: 'Hoy',
    monthNames: months,
    monthNamesShort: shortNameMonths,
    changeMonth: true,
    changeYear: true,
    showButtonPanel: true,
    ...options,

    onClose(_, inst) {
      if (!showDays) {
        $(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));
      }
      dateForm.setValue($(this).val());
      periodFunction(toDateForm.value, dateForm, toDateForm, messageFunction);
      cycleYearFunction($(this).val(), messageFunction, dateForm);
    },

    onChangeMonthYear(input, inst) {

      $(`${beginId}.ui-datepicker-calendar`).css('display', 'none');
      setTimeout(() => {
        if (!showDays) {
          $('.ui-datepicker-calendar').hide();
        }
        $('.ui-datepicker-header').css('width', '300px');
        $('.ui-datepicker-month').css('color', '#333');
      }, 0);
    },

    beforeShow(input, inst) {
      setTimeout(() => {
        inst.dpDiv.css({ top: yMouse + 25});
        if (!showDays) {
          $('.ui-datepicker-calendar').hide();
        }
        $('.ui-datepicker-header').css('width', '300px');
        $('.ui-datepicker-month').css('color', '#333');
      }, 0);
    },
  });
}
// fechaInicio3 fechaFin3
export function chargeEndCalendar(endId: string, toDateForm: FormControl, fromDateForm: FormControl, messageFunction: MessageFunction,
                                  options: CalendarOptions = { dateFormat: 'MM yy', showDays: false },
                                  cycleYearFunction: CycleYearFunction = validateCycleYear,
                                  periodFunction: PeriodFunction = validatePeriod) {
  onMouseMove(endId);
  const { showDays } = options;
  $(endId).datepicker({
    closeText: 'Cerrar',
    prevText: '<Ant',
    nextText: 'Sig>',
    currentText: 'Hoy',
    monthNames: months,
    monthNamesShort: shortNameMonths,
    changeMonth: true,
    changeYear: true,
    showButtonPanel: true,
    ...options,

    onClose(dateText, inst) {
      if (!showDays) {
        $(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));
      }
      toDateForm.setValue($(this).val());
      periodFunction($(this).val(), fromDateForm, toDateForm, messageFunction);
      cycleYearFunction($(this).val(), messageFunction, toDateForm);
    },

    onChangeMonthYear(input, inst) {

      $(`${endId} .ui-datepicker-calendar`).css('display', 'none');
      setTimeout(() => {
        if (!showDays) {
          $('.ui-datepicker-calendar').hide();
        }
        $('.ui-datepicker-header').css('width', '300px');
        $('.ui-datepicker-month').css('color', '#333');
      }, 0);
    },

    beforeShow(input, inst) {
      setTimeout(() => {
        inst.dpDiv.css({ top: yMouse + 25});
        if (!showDays) {
          $('.ui-datepicker-calendar').hide();
        }
        $('.ui-datepicker-header').css('width', '300px');
        $('.ui-datepicker-month').css('color', '#333');
      }, 0);
    },

  });
}

export function validateCycleYear(date: string, messageFunction: MessageFunction, dateForm: FormControl) {
  const splittedDate: string[] = date.split(' ');
  const currentDate = new Date();
  const selectedYear: number = Number(splittedDate[1]);
  const selectedMonth: number = months.indexOf(splittedDate[0]) + 1;
  const currentYear: number = currentDate.getFullYear();
  const currentMonth: number = currentDate.getMonth() + 1;
  if (currentMonth < 3 || (currentMonth === 3 && currentDate.getDate() <= 15)) {
    if (!(selectedYear === currentYear - 1 || selectedYear === currentYear ||
      (selectedYear === currentYear + 1 && selectedMonth <= 3))) {
        if (selectedYear < currentYear) {
          dateForm.setValue(`${months[0]} ${currentYear - 1}`);
        } else  {
          dateForm.setValue(`${months[2]} ${currentYear + 1}`);
        }
        messageFunction('Fuera del periodo', 'Atención');
    }
  } else if (!(selectedYear === currentYear || (selectedYear === currentYear + 1 && selectedMonth <= 3))) {
    if (selectedYear < currentYear) {
      dateForm.setValue(`${months[0]} ${currentYear}`);
    } else  {
      dateForm.setValue(`${months[2]} ${currentYear + 1}`);
    }
    messageFunction('Fuera del periodo', 'Atención');
  }
}

export function validateCycleYearDays(date: string, messageFunction: MessageFunction, dateForm: FormControl) {
  const cycleYearValidity = getCycleYearValidity(date);
  const splittedDate: string[] = date.split('/');
  const selectedDate = new Date(splittedDate.reverse().join(','));
  const selectedYear: number = selectedDate.getFullYear();
  const currentDate = new Date();
  const currentYear: number = currentDate.getFullYear();
  if (!cycleYearValidity) {
    if (selectedYear < currentYear) {
      dateForm.setValue(`01/01/${currentYear - 1}`);
    } else  {
      dateForm.setValue(`15/03/${currentYear + 1}`);
    }
    messageFunction('Fuera del periodo', 'Atención');
  }
}

export function getCycleYearValidity(date: string): boolean {
  const splittedDate: string[] = date.split('/');
  const selectedDate = new Date(splittedDate.reverse().join(','));
  const currentDate = new Date();
  const selectedYear: number = selectedDate.getFullYear();
  const selectedMonth: number = selectedDate.getMonth() + 1;
  const selectedDay: number = selectedDate.getDate();
  const currentYear: number = currentDate.getFullYear();
  const currentMonth: number = currentDate.getMonth() + 1;
  const currentDay: number = currentDate.getDate();
  if (currentMonth < 3 || (currentMonth === 3 && currentDay <= 15)) {
    if (selectedYear === currentYear - 1 || selectedYear === currentYear ||
      (selectedYear === currentYear + 1 && ((selectedMonth < 3) || (selectedMonth === 3 && selectedDay <= 15)))) {
      return true;
    } else {
      return false;
    }
  } else {
    if (selectedYear === currentYear ||
      (selectedYear === currentYear + 1 && ((selectedMonth < 3) || (selectedMonth === 3 && selectedDay <= 15)))) {
      return true;
    } else {
      return false;
    }
  }
}

export function validatePeriod(date: string, fromDateForm: FormControl, toDateForm: FormControl, messageFunction: MessageFunction) {
  const splittedDate: string[] = date.split(' ');
  const fDateInput: Date = new Date(Date.parse(`${DateUtils.monthToEnglish(splittedDate[0].toString())},${splittedDate[1]}`));

  const splittedFromDate: string[] = (fromDateForm.value as string).split(' ');
  const fDateFrom = new Date(Date.parse(`${DateUtils.monthToEnglish(splittedFromDate[0].toString())},${splittedFromDate[1]}`));

  if (fDateInput < fDateFrom) {
    messageFunction('La fecha fin no puede ser menor a la fecha de inicio', 'Atención');
    toDateForm.setValue(`${months[fDateFrom.getMonth()]} ${fDateFrom.getFullYear()}`);
  }

}

export function validatePeriodDays(date: string, fromDateForm: FormControl, toDateForm: FormControl, messageFunction: MessageFunction) {

  const splittedDate: string[] = date.split('/');
  const fDateInput: Date = new Date(splittedDate.reverse().join(','));

  const splittedFromDate: string[] = (fromDateForm.value as string).split('/');
  const fDateFrom = new Date(splittedFromDate.reverse().join(','));

  if (fDateInput < fDateFrom) {
    messageFunction('La fecha fin no puede ser menor a la fecha de inicio', 'Atención');
    toDateForm.setValue(splittedFromDate.reverse().join('/'));
  }

}

export function formatDateToString(date: Date): string {
  return formatDayOrMonth(date.getDate()) + '/' + formatDayOrMonth((date.getMonth() + 1)) + '/' + date.getFullYear();
}

function formatDayOrMonth(dateOrMonth: number): string {
  return dateOrMonth < 10 ? `0${dateOrMonth}` : dateOrMonth.toString();
}
