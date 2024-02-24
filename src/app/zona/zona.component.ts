import { EGrupoVivienda } from './../modelos/EGrupoVivienda';
import { Component} from '@angular/core';
import { TokenService } from '../services/token.service';
import { ZonaService } from '../services/zona.service';
import { AlertController, IonModal, ToastController } from '@ionic/angular';
import { MessageStatusResponse } from '../services/StatusResponse.model';
import { OverlayEventDetail } from '@ionic/core/components';

interface EZona{
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-zona',
  templateUrl: './zona.component.html',
  styleUrls: ['./zona.component.scss'],
})

export class ZonaComponent{
  userInfo: any;
  descripcion = "";
  descripcionEdicion = "";
  lstZonas!: EZona[];
  zonaSeleccionada!: EZona;
  isModalOpen = false;


  constructor(
    private tokenService: TokenService,
    private zonaService: ZonaService,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit(){
    this.userInfo = this.tokenService.getDecodedToken();
    this.listarZonas();
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  seleccionarZona(zona: EZona){
    this.zonaSeleccionada = zona;
    this.descripcionEdicion = this.zonaSeleccionada.nombre;
  }

  modificarZona(){
    if(this.descripcionEdicion != ""){
      let parametros: EGrupoVivienda = {
        id: this.zonaSeleccionada.id,
        idUsuarioAsignado: this.userInfo.id,
        nombre: this.descripcionEdicion
      }

      this.zonaService.modificarZona(parametros).subscribe((response: { success: boolean; messages?: MessageStatusResponse[]}) =>{
        if(response.success){
          this.mostrarToast('Zona modificada correctamente');
          this.descripcionEdicion = "";
          this.setOpen(false);
          this.listarZonas();
        }else{
          if(response.messages){
            this.mostrarAlert(response.messages[0].message);
          }
        }
      },
        (error: any) => {
          this.mostrarToast('Ha ocurrido un error con los servicios');
        });
    }else{
      this.mostrarToast('Debe escribir una descripción');
    }
  }

  agregarZona(){
    if(this.descripcion != ""){
      let parametros: EGrupoVivienda = {
        id: 0,
        idUsuarioAsignado: this.userInfo.id,
        nombre: this.descripcion
      }

      this.zonaService.insertarZona(parametros).subscribe((response: { success: boolean; data: EGrupoVivienda; messages?: MessageStatusResponse[]}) =>{
        if(response.success){
          this.mostrarToast('Zona registrada correctamente');
          this.descripcion = "";
          this.listarZonas();
        }else{
          if(response.messages){
            this.mostrarAlert(response.messages[0].message);
          }
        }
      },
        (error: any) => {
          this.mostrarToast('Ha ocurrido un error con los servicios');
        });
    }else{
      this.mostrarToast('Debe escribir una descripción');
    }
  }

  listarZonas(){
    this.zonaService.listarZonas(this.userInfo.id)
    .subscribe((response: { success: boolean; data: EZona[]}) =>{
      if(response.success){
        this.lstZonas = response.data;
      }
    },
      (error: any) => {
        this.mostrarToast('Ha ocurrido un error con los servicios');
      });
  }

  async mostrarAlert(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
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
