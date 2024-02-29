import { EGrupoVivienda } from './../modelos/EGrupoVivienda';
import { Component} from '@angular/core';
import { TokenService } from '../services/token.service';
import { ZonaService } from '../services/zona.service';
import { AlertController, IonModal, ToastController } from '@ionic/angular';
import { MessageStatusResponse } from '../services/StatusResponse.model';
import { EManzana } from '../modelos/EManzana';
import { ManzanaService } from '../services/manzana.service';

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
  lstManzanas!: EManzana[];
  zonaSeleccionada!: EZona;
  isModalOpen = false;
  gestionManzanas = false;
  edidiconManzanas = false;
  decripcionManzana = "";
  decripcionManzanaEdicion = "";
  manzanaSeleccionada!: EManzana;
  idZona!: number;

  constructor(
    private tokenService: TokenService,
    private zonaService: ZonaService,
    private manzanaService: ManzanaService,
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

  abrirManzanas(isOpen: boolean, id: number) {
    this.gestionManzanas = isOpen;
    this.idZona = id
    this.listarManzanas();
  }

  cerrarManzanas(isOpen: boolean) {
    this.gestionManzanas = isOpen;
  }

  cerrarEdicionManzanas(isOpen: boolean) {
    this.edidiconManzanas = isOpen;
  }

  seleccionarZona(zona: EZona){
    this.zonaSeleccionada = zona;
    this.descripcionEdicion = this.zonaSeleccionada.nombre;
  }

  seleccionarManzana(manzana: EManzana){
    this.manzanaSeleccionada = manzana;
    this.decripcionManzanaEdicion = this.manzanaSeleccionada.descripcion;
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

  agregarManzana(){
    if(this.decripcionManzana != ""){
      let parametros: EManzana = {
        id: 0,
        idGrupoVivienda: this.idZona,
        descripcion: this.decripcionManzana
      }
      this.manzanaService.insertarManzana(parametros).subscribe((response: { success: boolean; messages?: MessageStatusResponse[]}) =>{
        if(response.success){
          this.mostrarToast('Manzana registrada correctamente');
          this.decripcionManzana = "";
          this.listarManzanas();
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

  modificarManzana(){
    if(this.decripcionManzanaEdicion != ""){
      let parametros: EManzana = {
        id: this.manzanaSeleccionada.id,
        idGrupoVivienda: this.idZona,
        descripcion: this.decripcionManzanaEdicion
      }
      this.manzanaService.modificarManzana(parametros).subscribe((response: { success: boolean; messages?: MessageStatusResponse[]}) =>{
        if(response.success){
          this.mostrarToast('Manzana editada correctamente');
          this.decripcionManzanaEdicion = "";
          this.cerrarEdicionManzanas(false)
          this.listarManzanas();
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

  listarManzanas(){
    this.manzanaService.listarManzana(this.idZona)
    .subscribe((response: { success: boolean; data: EManzana[]}) =>{
      if(response.success){
        this.lstManzanas = response.data;
      }else{
        this.lstManzanas = []
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
