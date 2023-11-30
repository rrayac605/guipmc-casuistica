import { FormGroup, AbstractControl } from '@angular/forms';


export function ValidateSelect(control: AbstractControl) {
  if (control.value < 0) {
    return { validSelect: true };
  }
  return null;
}



export function ValidaCaracteres(control: AbstractControl) {
  if (control.value.includes("°")  || control.value.includes("!")  || control.value.includes("”")  || control.value.includes("#")  ||
  control.value.includes("$")  || control.value.includes("%")  || control.value.includes("&")  || control.value.includes("/")  ||
  control.value.includes("(")  || control.value.includes(")")  || control.value.includes("=")  || control.value.includes("?")  ||
  control.value.includes("¡")  || control.value.includes("*")  || control.value.includes("¨")  || control.value.includes("[")  ||
  control.value.includes("]")  || control.value.includes("{")  || control.value.includes("}")  || control.value.includes("-")   ) {
    return { validSelect: true };
  }
  return null;
}
