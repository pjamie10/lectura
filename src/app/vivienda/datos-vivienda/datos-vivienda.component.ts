import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { EManzana } from 'src/app/modelos/EManzana';
import { EVivienda, EViviendaListado } from 'src/app/modelos/EVivienda';
import { ManzanaService } from 'src/app/services/manzana.service';
import { TokenService } from 'src/app/services/token.service';
import { ViviendaService } from 'src/app/services/vivienda.service';
import { ZonaService } from 'src/app/services/zona.service';

interface EZona{
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-datos-vivienda',
  templateUrl: './datos-vivienda.component.html',
  styleUrls: ['./datos-vivienda.component.scss'],
})
export class DatosViviendaComponent{

  idVivienda!: number;
  formData: FormGroup;
  userInfo: any;
  lstZonas: EZona[] = [];
  lstManzanas!: EManzana[];
  deshabilitar = false;
  zonaSeleccionada!: EZona

  constructor(
    private route: ActivatedRoute,
    private fb:FormBuilder,
    private zonaService: ZonaService,
    private tokenService: TokenService,
    private toastController: ToastController,
    private viviendaService: ViviendaService,
    private manzanaService: ManzanaService,
    private router: Router
  ) {
    this.userInfo = this.tokenService.getDecodedToken();
    this.listarZonas();
    this.formData = this.fb.group({
      propietario: ['',[Validators.required]],
      direccion: ['',[Validators.required]],
      manzana: [null,[Validators.required]],
      lote: [null],
      idGrupoVivienda: [null,[Validators.required]]
    });
   }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.idVivienda = Number(params.get('id'));
      if(this.idVivienda && this.idVivienda > 0){
        this.obtenerDatos();
        this.deshabilitar = true;
        this.formData.get('lectura')?.clearValidators();
      }
      this.deshabilitar = false;
      this.formData.get('lectura')?.addValidators([Validators.required])
    });
  }

  obtenerDatos(){
    this.viviendaService.obtenerViviendaPorId(this.idVivienda)
    .subscribe((response: { success: boolean; data: any}) =>{
      if(response.success){
        let vivienda = response.data;
        this.formData.get('propietario')?.setValue(vivienda.nombrePropietario)
        this.formData.get('direccion')?.setValue(vivienda.direccion)
        this.formData.get('manzana')?.setValue(vivienda.idManzana)
        this.formData.get('lote')?.setValue(vivienda.lote)
        this.formData.get('idGrupoVivienda')?.setValue(vivienda.idGrupoVivienda)
      }
    },
      (error: any) => {
        this.mostrarToast('Ha ocurrido un error con los servicios');
      });
  }

  guardarDatos(){
    if(this.idVivienda){
      this.modificarVivienda()
    }else{
      this.insertarVivienda()
    }
  }

  insertarVivienda(){
    if(this.formData.valid){
      let parametros: EVivienda = {
        id: 0,
        idManzana: this.formData.get('manzana')?.value,
        nombrePropietario: this.formData.get('propietario')?.value,
        direccion: this.formData.get('direccion')?.value,
        lote: this.formData.get('lote')?.value,
        idGrupoVivienda: this.formData.get('idGrupoVivienda')?.value,
        estado: true
      }
      this.viviendaService.insertarVivienda(parametros).subscribe((response: { success: boolean; data: EVivienda }) =>{
        if(response.success){
          this.mostrarToast('Vivienda insertada correctamente');
          this.router.navigate(['/vivienda']);
        }
      },
        (error: any) => {
          this.mostrarToast('Ha ocurrido un error con los servicios');
        });
    }else{
      this.mostrarToast('Debe revisar sus datos');
    }
  }

  listarManzanas(event: any){
    const valorSeleccionado = event.detail.value;
    this.manzanaService.listarManzana(Number(valorSeleccionado))
    .subscribe((response: { success: boolean; data: EManzana[]}) =>{
      if(response.success){
        this.lstManzanas = response.data;
        this.formData.get('manzana')?.setValue(this.lstManzanas[0].id);
      }else{
        this.formData.get('manzana')?.setValue(null)
      }
    },
      (error: any) => {
        this.mostrarToast('Ha ocurrido un error con los servicios');
      });
  }

  listarManzanasInicio(id: number){
    this.manzanaService.listarManzana(id)
    .subscribe((response: { success: boolean; data: EManzana[]}) =>{
      if(response.success){
        this.lstManzanas = response.data;
        this.formData.get('manzana')?.setValue(this.lstManzanas[0].id);
      }else{
        this.formData.get('manzana')?.setValue(null)
      }
    },
      (error: any) => {
        this.mostrarToast('Ha ocurrido un error con los servicios');
      });
  }

  modificarVivienda(){
    if(this.formData.valid){
      let parametros: EVivienda = {
        id: this.idVivienda,
        nombrePropietario: this.formData.get('propietario')?.value,
        direccion: this.formData.get('direccion')?.value,
        idManzana: this.formData.get('manzana')?.value,
        lote: this.formData.get('lote')?.value,
        idGrupoVivienda: this.formData.get('idGrupoVivienda')?.value,
        estado: true
      }

      this.viviendaService.modificarVivienda(parametros).subscribe((response: { success: boolean; data: number }) =>{
        if(response.success){
          this.mostrarToast('Vivienda modificada correctamente');
          this.router.navigate(['/vivienda']);
        }
      },
        (error: any) => {
          this.mostrarToast('Ha ocurrido un error con los servicios');
        });
    }else{
      this.mostrarToast('Debe revisar sus datos');
    }
  }

  listarZonas(){
    this.zonaService.listarZonas(this.userInfo.id)
    .subscribe((response: { success: boolean; data: EZona[]}) =>{
      if(response.success){
        this.lstZonas = response.data;
        this.zonaSeleccionada = this.lstZonas[0]
        this.formData.get('idGrupoVivienda')?.setValue(this.lstZonas[0].id);
        this.listarManzanasInicio(this.lstZonas[0].id)
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
