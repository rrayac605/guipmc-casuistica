import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { default as _rollupMoment, Moment } from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetalleConsultaSRecordsDTO } from 'src/app/casuistica/models/control-figures/detalleConsultaSRecordsDTO';
import {DetalleConsultaDTO} from 'src/app/casuistica/models/control-figures/detalleConsultaDTO';
import {diasFaltantes}from './../../../components-ux/funciones/contadorDiasMes';
import {diasRecorridos}from './../../../components-ux/funciones/contadorDiasMes';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// Declaramos las variables para jQuery
declare var jQuery:any;

declare var $: any;


@Component({
  selector: 'app-prueba-ux',
  templateUrl: './prueba-ux.component.html',
  styleUrls: ['./prueba-ux.component.scss']
})
export class PruebaUXComponent implements OnInit {

 //public formGroup: FormGroup;
 public formGroup: FormGroup;
 public from: FormControl;
 public to: FormControl;
 public registrationCase: FormControl;

 public delegacion: FormControl;
 public subdelagacion: FormControl;
 public tipoRiesgo: FormControl;

 public titDialogo: string;
 public messDialogo: string;
 public detalleConsultaSRecordsDTO: DetalleConsultaSRecordsDTO[] = [];
 detalleConsultaArrayDTO:DetalleConsultaDTO[]= [];
 public fechaMostrar:string;
 public periodoMostrar:string;

 //*********  LA PAGINA QUE SE MOSTRARA  */
 public paginaUX:string;
//******************    BORRAR   ***************************/
 public mostrar:boolean = false;
 constructor(private formBuilder: FormBuilder,
 private modalService: NgbModal ,private router: Router  ) {


}

  ngOnInit(): void {
     this.buildForm();
    
    var diasFalt= "+"+(diasFaltantes())+"D";
    var diasReco= "-"+(diasRecorridos()-1)+"D";
  
      $("a").tooltip();
      $('[data-toggle="tooltip"]').tooltip();
      $("#fechaIncioRegistro").datepicker({
      
    closeText: 'Cerrar',
    prevText: '<Ant',
    nextText: 'Sig>',
    currentText: 'Hoy',
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
              changeMonth: true,
              changeYear: true,
              showButtonPanel: true,
              dateFormat: 'MM yy' ,
          
    onClose: function(dateText, inst) { 
              $(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));
    },

    onChangeMonthYear : function(input, inst) { 
           var rect = input.getBoundingClientRect();
           
            $("#fechaFin .ui-datepicker-calendar").css("display","none");
            setTimeout(function () {
                   inst.dpDiv.css({ top: rect.top + 100, left: rect.left + 280 });
                  $('.ui-datepicker-calendar').hide();
           
                  $('.ui-datepicker-header').css("width", "300px");
                  $('.ui-datepicker-month').css("color", "#333");
           }, 0);
    },



    beforeShow: function (input, inst) {
           var rect = input.getBoundingClientRect();
            setTimeout(function () {
                    inst.dpDiv.css({ top: rect.top + 100, left: rect.left + 280 });
                    $('.ui-datepicker-calendar').hide();
                    $('.ui-datepicker-header').css("width", "300px");
                    $('.ui-datepicker-month').css("color", "#333");
                    
            }, 0);
    },
      });
     $("#fechaIncioRegistro").on('change', function(){
      alert(" ALERT JUQERY "+$(this).val());
});

$("#fechaFin").datepicker({
  
    closeText: 'Cerrar',
    prevText: '<Ant',
    nextText: 'Sig>',
    currentText: 'Hoy',
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
              changeMonth: true,
              changeYear: true,
              showButtonPanel: true,
              dateFormat: 'MM yy' ,
          
    onClose: function(dateText, inst) { 
              $(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));
    },

    onChangeMonthYear : function(input, inst) { 
           var rect = input.getBoundingClientRect();
           
            $("#fechaFin .ui-datepicker-calendar").css("display","none");
            setTimeout(function () {
                   inst.dpDiv.css({ top: rect.top + 100, left: rect.left + 280 });
                  $('.ui-datepicker-calendar').hide();
           
                  $('.ui-datepicker-header').css("width", "300px");
                  $('.ui-datepicker-month').css("color", "#333");
           }, 0);
    },



    beforeShow: function (input, inst) {
           var rect = input.getBoundingClientRect();
            setTimeout(function () {
                    inst.dpDiv.css({ top: rect.top + 100, left: rect.left + 280 });
                    $('.ui-datepicker-calendar').hide();
                    $('.ui-datepicker-header').css("width", "300px");
                    $('.ui-datepicker-month').css("color", "#333");
                    
            }, 0);
    },
        
});
          
            
$("#fechaFin").on('change', function(){
  alert(" ALERT JUQERY "+$(this).val());
});




    this.generarMock();
    this.fechaMostrar="03/02/2019";
    this.periodoMostrar="01/2019 al 02/2019";
    this.paginaUX="Consulta CIC UX";
  }

  //****************   SACAMOS EL NUMERO DE DIAS DEL MES     ********************

  
 

  private buildForm() {
    const dateLength = 10;
    const today = new Date().toISOString().substring(0, dateLength);
    this.formGroup = this.formBuilder.group({

    delegacion: [-1],
    subdelagacion: [-1],
   
    
  });
}


public showMessage(message: string, title: string) {
  console.log('showmessa');
  this.titDialogo = title;
  this.messDialogo = message;
    $('#dialogMessage').modal('show');
}

public hideMessage() {
    $('#dialogMessage').modal('hide');
}

 public validateFormSearch() {
         let result = 1;
         console.log(this.formGroup.get('date').value);
         console.log(this.formGroup.get('date2').value);

         if (this.formGroup.get('date').value === null && this.formGroup.get('date2').value === null
         || this.formGroup.get('date').value === null  || this.formGroup.get('date2').value === null ) {
                result = 0;
         } 

    return result;
  }

  guardarCambios(){
       this.mostrar=true;
       console.log(this.formGroup.value);
       if(this.formGroup.valid){
            console.log("VALIDACION CON EXITO ");
            this.formGroup.reset;
       }else{
             console.log("VALIDACION CON FALLO");
       }
}

clean(){
  this.mostrar=false;
}

flujoAlterno(){
  this.showMessage('No se encontraron resultados con los criterios ingresados.', 'Atención');
}

generarMock(){
    const detalleConsultaDTO= new DetalleConsultaDTO();
    detalleConsultaDTO.tipoArchivo="RIT";
    detalleConsultaDTO.numTotalRegistros=350;
    detalleConsultaDTO.numRegistrosCorrectos=20;
    detalleConsultaDTO.numRegistrosError=10;
    detalleConsultaDTO.numRegistrosDup=10;
    detalleConsultaDTO.numRegistrosBaja=10;
    detalleConsultaDTO.numRegistrosSus=10;
    detalleConsultaDTO.numRegistrosCorrectos=15;
    detalleConsultaDTO.numRegistrosCorrectosOtras=20;
    detalleConsultaDTO.numRegistrosDupOtras=20;
    detalleConsultaDTO.numRegistrosSusOtras=20;
    detalleConsultaDTO.numRegistrosBajaOtras=20;


 this.detalleConsultaArrayDTO.push(detalleConsultaDTO);
 const detalleConsultaDTO2= new DetalleConsultaDTO();
 detalleConsultaDTO2.tipoArchivo="ST3";
 detalleConsultaDTO2.numTotalRegistros=350;
 detalleConsultaDTO2.numRegistrosCorrectos=20;
 detalleConsultaDTO2.numRegistrosError=10;
 detalleConsultaDTO2.numRegistrosDup=10;
 detalleConsultaDTO2.numRegistrosBaja=10;
 detalleConsultaDTO2.numRegistrosSus=10;
 detalleConsultaDTO2.numRegistrosCorrectos=15;
 detalleConsultaDTO2.numRegistrosCorrectosOtras=20;
 detalleConsultaDTO2.numRegistrosDupOtras=20;
 detalleConsultaDTO2.numRegistrosSusOtras=20;
 detalleConsultaDTO2.numRegistrosBajaOtras=20;


this.detalleConsultaArrayDTO.push(detalleConsultaDTO2);




    
}


}
