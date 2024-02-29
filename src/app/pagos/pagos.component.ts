import { Component } from '@angular/core';
import { LecturaService } from '../services/lectura.service';
import { EHistorialLecturaListado } from '../modelos/ELecturaVivienda';
import { ToastController } from '@ionic/angular';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss'],
})
export class PagosComponent {

  lstHistorial: EHistorialLecturaListado[] = [];
  userInfo: any;

  constructor(
    private  lecturaService: LecturaService,
    private toastController: ToastController,
    private tokenService: TokenService
  ) {
   }

  ngOnInit(){
    this.userInfo = this.tokenService.getDecodedToken();
  }

  ngAfterViewInit() {
    if (this.userInfo.id) {
      this.listarHistorial("");
    }
  }

  buscar(event: any){
    const valorInput = event.target.value;
    this.listarHistorial(valorInput)
  }

  listarHistorial(parametro: string){
    this.lecturaService.listarHistorialLectura(parametro,this.userInfo.id)
    .subscribe((response: { success: boolean; data: EHistorialLecturaListado[]}) =>{
      if(response.success){
        this.lstHistorial = response.data;
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
