import { Component, OnInit ,Input } from '@angular/core';
import { ValidationForm } from 'src/app/casuistica/models/validation/validationForm';
import { ResponseValidation } from 'src/app/casuistica/models/validation/responseValidation';
import { PatronesService } from 'src/app/casuistica/services/bdtu/patrones.service';	
import { ResponseWhareHouseValidation } from 'src/app/casuistica/models/validation/responseWharehouseValidation';
import { RecordsDetailInfo } from 'src/app/casuistica/models/records-detail/recordsDetailInfo';
import { PatronDTO } from 'src/app/casuistica/models/patronDTO';
@Component({
  selector: 'app-datos-patron',
  templateUrl: './datos-patron.component.html',
  styleUrls: ['./datos-patron.component.scss']
})
export class DatosPatronComponent implements OnInit {
  @Input() public registroPatroInput  : string;
  public registroPatronal:string;
  public responseValidation: ResponseValidation[] = [];
  public responseSearch: ResponseWhareHouseValidation=null;
  public info: RecordsDetailInfo = new RecordsDetailInfo();
  public patron: PatronDTO=new PatronDTO;

  constructor( private patronesService: PatronesService) { }

  ngOnInit(): void {
  
    this.patron.desRazonSocial =" ";
  }

  public mandarPatron(registro:string) {
   console.log("EL HIJO PATRON  "+registro);
    this.buscarPatronManual(registro) ;
  }


  public buscarPatronManual(registroPatronal:string) {
    const toForm: ValidationForm = new ValidationForm();
    this.responseSearch=new ResponseWhareHouseValidation();
    toForm.rp = registroPatronal;

    console.log(toForm);
    if (toForm.rp !== null && toForm.rp !== '') {
      this.responseValidation = [];
      //this.spinner.show();
      this.patronesService.buscar(toForm).subscribe(
        (response: any) => {
          console.log(".... EXITO AAA.... "+response.status);
          switch (response.status) {
            case 200:
              this.responseSearch = response.body;
              console.log(".... BODYYY... "+JSON.stringify(response.body));

              if (this.responseSearch !== null && this.responseSearch !== undefined && this.responseSearch.patronDTO !== null) {
                this.info.patronDTO = this.responseSearch.patronDTO;
                this.patron.desRazonSocial= this.responseSearch.patronDTO.desRazonSocial;
                console.log(".... EXITO HIJO.... "+JSON.stringify(this.responseSearch.patronDTO));


               } else {
               

              }
              //this.spinner.hide();
              break;

            case 206:
              this.responseSearch = response.body;

              if (this.responseSearch !== null && this.responseSearch !== undefined && this.responseSearch.patronDTO !== null) {
                this.info.patronDTO = this.responseSearch.patronDTO;

             //   console.log(".... EXITO HIJO.... "+JSON.stringify(this.responseSearch.patronDTO));

                // this.formGroup.get('registroPatronal').setValue(this.responseSearch.patronDTO.refRegistroPatronal);
                // this.formGroup.get('razonSocialPatron').setValue(this.responseSearch.patronDTO.desRazonSocial);
                // this.formGroup.get('fracion').setValue(this.responseSearch.patronDTO.cveFraccion);
                // this.formGroup.get('prima').setValue(this.responseSearch.patronDTO.numPrima);
                // this.formGroup.get('clase').setValue(this.responseSearch.patronDTO.desClase);
                // this.formGroup.get('actividadEconomica').setValue(this.responseSearch.patronDTO.desFraccion);
                // this.formGroup.get('delegacionRegistro').setValue(this.responseSearch.patronDTO.desDelRegPatronal);
                // this.formGroup.get('subRegistro').setValue(this.responseSearch.patronDTO.desSubDelRegPatronal);
                // this.formGroup.get('rfcPatronal').setValue(this.responseSearch.patronDTO.desRfc);
              } else {
               

              }
              //this.spinner.hide();
              break;
            case 204:
            case 500:
            case 504:
              this.responseValidation = [];
              break;
          }
        }, err => {
        //  this.spinner.hide();
          if (err.status !== null) {
            console.log("EL ERROR "+err.status);
            switch (err.status) {
              case 401:
               // this.showMessage('Usuario no autorizado', 'Atención');
               console.log("EL CASE 401");
                this.responseValidation = [];
                break;
              case 500:
              case 504:
               // this.showMessage('Patron no encontrado.', 'Atención');
                this.responseValidation = [];
                break;
            }
          } else {
           // this.showMessage('Patron no encontrado. ' + err.message, 'Atención');
          }
        });
    }
  }

}
