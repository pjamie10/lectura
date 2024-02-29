import { TokenService } from './../services/token.service';
import { ToastController } from '@ionic/angular';
import { Component } from '@angular/core';
import { ZonaService } from '../services/zona.service';
import { NavigationEnd, Router } from '@angular/router';
import { ViviendaService } from '../services/vivienda.service';
import { EVivienda, EViviendaListado } from '../modelos/EVivienda';

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
  objVivienda!: EVivienda;

  constructor(
    private zonaService: ZonaService,
    private toastController: ToastController,
    private tokenService: TokenService,
    private router: Router,
    private viviendaService: ViviendaService,
  ) {
    this.listarZonas();
  }

  ngOnInit(){
    this.userInfo = this.tokenService.getDecodedToken();
  }

  async ngAfterViewInit(){
    await this.listarZonas()
    await this.listarVivienda();
  }

  abrirDatosvivienda(id: number){
    this.router.navigate(['/vivienda/datos-vivienda', id]);
  }

  async listarZonas() {
    try {
      const response: { success: boolean; data: EZona[] } = await this.zonaService.listarZonas(this.userInfo.id).toPromise();

      if (response.success) {
        this.lstZonas = response.data;
        this.zonaSeleccionada = this.lstZonas[0];
      }
    } catch (error) {

    }
  }

  async listarVivienda() {
    try {
      const response: { success: boolean; data: EViviendaListado[] } = await this.viviendaService.listarVivienda(this.userInfo.id, this.zonaSeleccionada.id).toPromise();

      if (response.success) {
        this.lstViviendas = response.data;
        this.lstViviendas = this.lstViviendas.filter(vivienda => vivienda.estado === true);
      } else {
        this.lstViviendas = [];
      }
    } catch (error) {
      
    }
  }

  buscarYEliminar(idVivienda: number){
    this.viviendaService.obtenerViviendaPorId(idVivienda)
    .subscribe((response: { success: boolean; data: EVivienda}) =>{
      if(response.success){
        this.objVivienda = response.data;
        this.eliminarVivienda()
      }
    },
      (error: any) => {
        this.mostrarToast('Ha ocurrido un error con los servicios');
      });
  }

  eliminarVivienda(){
    let parametros: EVivienda = {
      id: this.objVivienda .id,
      nombrePropietario: this.objVivienda.nombrePropietario,
      direccion: this.objVivienda.direccion,
      idManzana: this.objVivienda.idManzana,
      lote: this.objVivienda .lote,
      idGrupoVivienda: this.objVivienda.idGrupoVivienda,
      estado: false
    }

    this.viviendaService.modificarVivienda(parametros).subscribe((response: { success: boolean; data: number }) =>{
      if(response.success){
        this.mostrarToast('Vivienda eliminada correctamente');
        this.listarVivienda()
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
