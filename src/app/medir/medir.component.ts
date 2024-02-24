import { Component } from '@angular/core';
import { EViviendaListado } from '../modelos/EVivienda';
import { ZonaService } from '../services/zona.service';
import { ViviendaService } from '../services/vivienda.service';
import { TokenService } from '../services/token.service';
import { ToastController } from '@ionic/angular';
import { LecturaService } from '../services/lectura.service';
import { ELecturaVivienda, ELecturaViviendaListado } from '../modelos/ELecturaVivienda';
import { Router } from '@angular/router';

interface EZona{
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-medir',
  templateUrl: './medir.component.html',
  styleUrls: ['./medir.component.scss'],
})
export class MedirComponent{
  zonaSeleccionada!: EZona;
  userInfo: any;
  lstZonas!: EZona[];
  zonas!: EZona[];
  lstViviendas!: EViviendaListado[];
  viviendaActual!: ELecturaViviendaListado[];
  posicionesJSON: any;
  posiciones: any;
  posicion!: number;
  lectura!: number | null;
  comision = 0;

  constructor(
    private zonaService: ZonaService,
    private viviendaService: ViviendaService,
    private lecturaService: LecturaService,
    private tokenService: TokenService,
    private toastController: ToastController,
    private router: Router
  ) {
    this.userInfo = this.tokenService.getDecodedToken();
    this.posicionesJSON = localStorage.getItem('posiciones');
    this.listarZonas();
    setTimeout(()=>{
      this.listarVivienda();
    },500);
   }

  listarZonas(){
    this.zonaService.listarZonas(this.userInfo.id)
    .subscribe((response: { success: boolean; data: EZona[]}) =>{
      if(response.success){
        this.lstZonas = response.data;
        this.zonaSeleccionada = this.lstZonas[0];
        if(!this.posicionesJSON){
          let lstPosiciones = []
          for (const zona of this.lstZonas) {
            const id = zona.id;
            const posicion = 0;

            lstPosiciones.push({ id, posicion });
          }
          localStorage.setItem('posiciones', JSON.stringify(lstPosiciones));
        }else{
          this.posiciones = JSON.parse(this.posicionesJSON);
        }
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
        this.posicionesJSON = localStorage.getItem('posiciones');
        this.posiciones = JSON.parse(this.posicionesJSON);
        const objetoEncontrado = this.posiciones.find((item: any) => item.id === this.zonaSeleccionada.id);
        this.posicion = objetoEncontrado.posicion + 1;
        let idBuscar
        if(this.lstViviendas[objetoEncontrado.posicion]){
          idBuscar = this.lstViviendas[objetoEncontrado.posicion].id;
          this.listarLecturaVivienda(idBuscar)
        }else{
          const objeto = this.posiciones.find((item: any) => item.id === this.zonaSeleccionada.id);
          objeto.posicion = 0;
          localStorage.setItem('posiciones', JSON.stringify(this.posiciones));
          this.router.navigate(['/home']);
          this.mostrarToast('Todos los datos se han guardado correctamente');
        }
      }else{
        this.lstViviendas = []
      }
    },
      (error: any) => {
        this.mostrarToast('Ha ocurrido un error con los servicios');
      });
  }

  guardar(){
    if(this.lectura){
      let parametros: ELecturaVivienda = {
        id: this.viviendaActual[0].id,
        lecturaAnterior: this.lectura,
        lecturaActual: 0,
        fechaLectura: this.viviendaActual[0].fechaLectura,
        idVivienda: this.viviendaActual[0].idVivienda
      }

      this.lecturaService.modificarLectura(parametros).subscribe((response: { success: boolean; data: number }) =>{
        if(response.success){
          this.mostrarToast('Lectura ingresada correctamente');
          const objeto = this.posiciones.find((item: any) => item.id === this.zonaSeleccionada.id);
          objeto.posicion ++;
          localStorage.setItem('posiciones', JSON.stringify(this.posiciones));
          this.lectura = null;
          this.comision = 0;
          this.listarVivienda();
        }
      },
        (error: any) => {
          this.mostrarToast('Ha ocurrido un error con los servicios');
        });
    }else{
      this.mostrarToast('Debe ingresar la lectura');
    }
  }

  calcularComision(){
    if(this.lectura){
      this.comision = (this.lectura - this.viviendaActual[0].lecturaAnterior) * 0.90
    }
  }

  listarLecturaVivienda(idVivienda: number){
    this.lecturaService.listarLecturaVivienda(idVivienda)
    .subscribe((response: { success: boolean; data: ELecturaViviendaListado[]}) =>{
      if(response.success){
        this.viviendaActual = response.data
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
