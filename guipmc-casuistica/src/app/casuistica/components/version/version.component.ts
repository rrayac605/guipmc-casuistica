import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss']
})
export class VersionComponent implements OnInit {

  public titulo = 'Version en ejecucion';
  public version = '1.1.2'
  public txt_ticket = "INC102256";
  public desc_ticket = "Validacion movimientos";

  constructor() { }

  ngOnInit(): void {
  }

}
