import { Component } from '@angular/core';
import { EViviendaListado } from '../modelos/EVivienda';
import { ZonaService } from '../services/zona.service';
import { ViviendaService } from '../services/vivienda.service';
import { TokenService } from '../services/token.service';
import { ToastController } from '@ionic/angular';
import { LecturaService } from '../services/lectura.service';
import { EHistorialLectura, ELecturaVivienda, ELecturaViviendaListado } from '../modelos/ELecturaVivienda';
import { Router } from '@angular/router';
import { StatusResponse } from '../services/StatusResponse.model';
import { ManzanaService } from '../services/manzana.service';
import { EManzana } from '../modelos/EManzana';

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
  lstViviendas: EViviendaListado[] = [];
  viviendaActual!: ELecturaViviendaListado[];
  posicionesJSON: any;
  posiciones: any;
  posicion!: number;
  lectura!: number | null;
  comision = 0;
  fechaActual = new Date();
  fecha!: string;
  lstManzanas!: EManzana[];
  idManzana!: number;
  lstFiltradas:EViviendaListado[] = [];

  constructor(
    private zonaService: ZonaService,
    private viviendaService: ViviendaService,
    private lecturaService: LecturaService,
    private tokenService: TokenService,
    private toastController: ToastController,
    private router: Router,
    private manzanaService: ManzanaService
  ) {
    this.userInfo = this.tokenService.getDecodedToken();
    this.posicionesJSON = localStorage.getItem('posiciones');
    this.fecha = this.fechaActual.toISOString().split('T')[0]
  }

  async ngAfterViewInit() {
    if (this.userInfo.id) {
      await this.listarZonas()
      await this.listarVivienda();
    }
  }

  listarManzanas(id: number){
    this.manzanaService.listarManzana(id)
    .subscribe((response: { success: boolean; data: EManzana[]}) =>{
      if(response.success){
        this.lstManzanas = response.data;
        this.idManzana = this.lstManzanas[0].id;

        if(!this.posicionesJSON){
          let lstPosiciones = []
          for (const manzana of this.lstManzanas) {
            const id = manzana.id;
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

  filtrarViviendas(){
    this.lstFiltradas = this.lstViviendas.filter(x => x.idManzana === this.idManzana);
    if(this.lstFiltradas.length > 0){
      this.posicionesJSON = localStorage.getItem('posiciones');
      this.posiciones = JSON.parse(this.posicionesJSON);
      const objetoEncontrado = this.posiciones.find((item: any) => item.id === this.zonaSeleccionada.id);
      this.posicion = objetoEncontrado.posicion + 1;
      let idBuscar
      if(this.lstFiltradas[objetoEncontrado.posicion]){
        idBuscar = this.lstFiltradas[objetoEncontrado.posicion].id;
        this.listarLecturaVivienda(idBuscar)
      }else{
        const objeto = this.posiciones.find((item: any) => item.id === this.zonaSeleccionada.id);
        objeto.posicion = 0;
        localStorage.setItem('posiciones', JSON.stringify(this.posiciones));
        this.router.navigate(['/home']);
        this.mostrarToast('Todos los datos se han guardado correctamente');
      }
    }else{
      this.mostrarToast('No hay viviendas en esta manzana');
    }
  }

  async listarZonas() {
    try {
      const response: { success: boolean; data: EZona[] } = await this.zonaService.listarZonas(this.userInfo.id).toPromise();

      if (response.success) {
        this.lstZonas = response.data;
        this.zonaSeleccionada = this.lstZonas[0];
        await this.listarManzanas(this.lstZonas[0].id);
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
        this.filtrarViviendas();
      } else {
        this.lstViviendas = [];
      }
    } catch (error) {
    }
  }

  async guardar(){
    if(this.lectura){
      if(this.viviendaActual[0].lectura !== undefined && this.viviendaActual[0].lectura !== null && (this.lectura > this.viviendaActual[0].lectura)){
        this.calcularComision();
        await this.modificarLectura()
        await this.insertarHistorialLectura()
      }else{
        this.mostrarToast('La lectura actual debe ser mayor a la anterior');
      }
    }else{
      this.mostrarToast('Debe ingresar la lectura');
    }
  }

  async modificarLectura() {
    let parametros: ELecturaVivienda = {
      id: this.viviendaActual[0].id,
      lectura: this.lectura,
      fechaLectura: this.fecha,
      idVivienda: this.viviendaActual[0].idVivienda
    };

    try {
      const response: StatusResponse<number> | undefined = await this.lecturaService.modificarLectura(parametros).toPromise();

      if (response) {
        if (response.success) {
          const objeto = this.posiciones.find((item: any) => item.id === this.zonaSeleccionada.id);
          objeto.posicion++;
          localStorage.setItem('posiciones', JSON.stringify(this.posiciones));
          this.listarVivienda();
        } else {
          console.error('Error en la respuesta: success es false');
        }
      } else {
        console.error('Respuesta undefined');
      }
    } catch (error) {
      this.mostrarToast('Ha ocurrido un error con los servicios');
    }
  }

  async insertarHistorialLectura() {
    let parametros: EHistorialLectura = {
      id: 0,
      idUsuario: Number(this.userInfo.id),
      idLectura: this.viviendaActual[0].id,
      lectura: this.lectura,
      montoComision: this.comision,
      fecha: this.fecha
    };
    try {
      const response: StatusResponse<number> | undefined = await this.lecturaService.insertarHistorialLectura(parametros).toPromise();

      if (response) {
        const successResponse: { success: boolean } = { success: response.success };

        if (successResponse.success) {
          this.mostrarToast('Su comisión es '+ this.comision);
          this.lectura = null;
          this.comision = 0;
        } else {
          console.error('Error en la respuesta: success es false');
        }
      } else {
        console.error('Respuesta undefined');
      }
    } catch (error) {
      this.mostrarToast('Ha ocurrido un error con los servicios');
    }
  }

  calcularComision(){
    if(this.lectura != null && this.viviendaActual[0].lectura != null){
      this.comision = (this.lectura - this.viviendaActual[0].lectura) * 0.90
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
