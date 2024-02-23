import { TokenService } from './../services/token.service';
import { ToastController } from '@ionic/angular';
import { Component } from '@angular/core';
import { ZonaService } from '../services/zona.service';
import { NavigationEnd, Router } from '@angular/router';
import { ViviendaService } from '../services/vivienda.service';
import { EViviendaListado } from '../modelos/EVivienda';

interface EZona{
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-vivienda',
  templateUrl: './vivienda.component.html',
  styleUrls: ['./vivienda.component.scss'],
})
export class ViviendaComponent{

  lstZonas!: EZona[];
  zonaSeleccionada!: EZona;
  userInfo: any;
  lstViviendas: EViviendaListado[] = [];

  constructor(
    private zonaService: ZonaService,
    private toastController: ToastController,
    private tokenService: TokenService,
    private router: Router,
    private viviendaService: ViviendaService,
  ) {
    this.userInfo = this.tokenService.getDecodedToken();
    this.listarZonas();
  }

  ngOnInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/vivienda') {
        setTimeout(()=>{
          this.listarVivienda();
        },500);
      }
    });
  }

  abrirDatosvivienda(id: number){
    this.router.navigate(['/vivienda/datos-vivienda', id]);
  }

  listarZonas(){
    this.zonaService.listarZonas(this.userInfo.id)
    .subscribe((response: { success: boolean; data: EZona[]}) =>{
      if(response.success){
        this.lstZonas = response.data;
        this.zonaSeleccionada = this.lstZonas[0]
      }
    },
      (error: any) => {
        this.mostrarToast('Ha ocurrido un error con los servicios');
      });
  }

  listarVivienda(){
    this.viviendaService.listarVivienda(this.userInfo.id, this.zonaSeleccionada.id)
    .subscribe((response: { success: boolean; data: EViviendaListado[]}) =>{
      if(response.success){
        this.lstViviendas = response.data;
      }else{
        this.lstViviendas = []
      }
    },
      (error: any) => {
        this.mostrarToast('Ha ocurrido un error con los servicios');
      });
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom'
    });

    toast.present();
  }

}
