import { UserInfo } from '../models/security/userInfo';

// Usuarios de salud en el trabajo
export const PERFILES_ST = [
  'MEDICO OPERATIVO DE SALUD EN EL TRABAJO'
];
// Usuarios RH IMSS
export const PERFILES_EP = [
  'TITULAR DE LA OFICINA DE EJERCICIO PRESUPUESTAL Y OBLIGACIONES (OEPO)', // OEPO
  'TITULAR DE LA DIVISION DE RELACIONES LABORALES', // DRL
  'JEFE DE AREA DE OBLIGACIONES LABORALES' // JAOL
];
// Los usuarios que tienen perfil diferente a los anteriores declarados se concideran CE

export enum OrigenAltaEnum {
  ST = 'ST',
  EP = 'EP',
  CE = 'CE'
}

export function validateOrigenAlta(): string {
  const userInfo: UserInfo = JSON.parse(localStorage.getItem('user'))?.userInfo;
  const perfiles: string[] = userInfo?.imssperfiles?.split(',');
  if (perfiles.find(perfil => PERFILES_ST.includes(perfil))) {
    return OrigenAltaEnum.ST;
  } else if (perfiles.find(perfil => PERFILES_EP.includes(perfil))) {
    return OrigenAltaEnum.EP;
  }
  return OrigenAltaEnum.CE;
}

export function validateRhImss(): boolean {
  return validateOrigenAlta() === OrigenAltaEnum.EP;
}

