import { Component, OnInit, Input } from '@angular/core';
import { Pagina } from './model/Pagina';
import { ElementRef, Renderer2, ViewChild } from '@angular/core';
import { AfterViewInit} from '@angular/core';
import { Inject, Injectable } from '@angular/core';
import {isNullOrUndefined} from 'util';
import {ActivatedRoute, NavigationEnd, Router, RouterEvent} from '@angular/router';
import {Subject, Observable} from 'rxjs';
import {filter,map, switchMap,mapTo,tap} from 'rxjs/operators';
import { Login } from 'src/app/common/models/security/login';
@Component({
  selector: 'app-breadcrumb-ux',
  templateUrl: './breadcrumb-ux.component.html',
  styleUrls: ['./breadcrumb-ux.component.scss']
})
export class BreadcrumbUxComponent implements OnInit , AfterViewInit {
    paginaItem :Pagina[];
    paginaUX:string;
    private titleSubject:Subject<string>  = new Subject();
    public  title$:Observable<string>=this.titleSubject.asObservable();
    mostrarBread:boolean=true;
    public user: Login = new Login();
    public menu:string="";
    public subMenu:string="";
    public inicioRouter:string="";

  @ViewChild('breadcrumb')  breadc: ElementRef;

  @Input() public titulo  : string;

  constructor(private renderer: Renderer2,private router: Router, private activatedRoute: ActivatedRoute) { }


  ngOnInit(): void {

     this.user = JSON.parse(localStorage.getItem('user'));
     this.inicioRouter = localStorage.getItem('inicioRouter');
     var arrayDeCadenas = this.titulo.split("/");
     console.log("______________________________________________________ ");
     console.log("___________________________INICIO DE ROUTER "+this.inicioRouter);
     console.log("LA CAENA ES "+arrayDeCadenas[0]);
     if(arrayDeCadenas[1] == undefined ){
         this.menu=arrayDeCadenas[0] ;
         this.subMenu="SIN" ;
     }else{
    
      this.menu=arrayDeCadenas[0] ;
      this.subMenu=arrayDeCadenas[1] ;

     }
     console.log("LA CAENA ES 2 "+arrayDeCadenas[1]);
  }

  
  public goToInicio() {
    this.router.navigate([this.inicioRouter, {}]);
}

  ngAfterViewInit(){

  //  this.cargaPaginas("Inicio ");

  }
  public salirPage(){
    this.router.navigate(['/login', {}]);
  }




}
