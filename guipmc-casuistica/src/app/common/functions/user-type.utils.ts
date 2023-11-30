import { UserInfo } from '../models/security/userInfo';

const OPERATIVE_USERS = ['JEFE DE OFICINA DE CLASIFICACION DE EMPRESAS', 'ESPECIALISTA CLASIFICACION',
  'JEFE DE DEPARTAMENTO DE SUPERVISION DE AFILIACION VIGENCIA', 'JEFE DE DEPARTAMENTO AFILIACION VIGENCIA',
  'JEFE DE AREA DE OBLIGACIONES LABORALES', 'TITULAR DE LA DIVISION DE RELACIONES LABORALES', 'VENTANILLA CE'];

const APPROVER_USERS = ['JEFE DE DEPARTAMENTO AFILIACION VIGENCIA', 'TITULAR DE LA DIVISION DE RELACIONES LABORALES',
  'JEFE DE DEPARTAMENTO DE SUPERVISION DE AFILIACION VIGENCIA', 'JEFE DE OFICINA DE CLASIFICACION DE EMPRESAS',
  'ESPECIALISTA CLASIFICACION', 'JEFE DE AREA DE OBLIGACIONES LABORALES', 'VENTANILLA CE'];

export function isOperative() {
  const userInfo: UserInfo = JSON.parse(localStorage.getItem('user'))?.userInfo;
  const profiles: string[] = userInfo?.imssperfiles?.split(',');
  return !!profiles.find(profile => OPERATIVE_USERS.includes(profile))?.length;
}

export function isApprover() {
  const userInfo: UserInfo = JSON.parse(localStorage.getItem('user'))?.userInfo;
  const profiles: string[] = userInfo?.imssperfiles?.split(',');
  return !!profiles.find(profile => APPROVER_USERS.includes(profile))?.length;
}
