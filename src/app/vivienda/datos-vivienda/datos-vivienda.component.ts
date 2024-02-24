import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { EVivienda } from 'src/app/modelos/EVivienda';
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

  constructor(
    private route: ActivatedRoute,
    private fb:FormBuilder,
    private zonaService: ZonaService,
    private tokenService: TokenService,
    private toastController: ToastController,
    private viviendaService: ViviendaService,
    private router: Router
  ) {
    this.userInfo = this.tokenService.getDecodedToken();
    this.listarZonas();
    this.formData = this.fb.group({
      propietario: ['',[Validators.required]],
      direccion: ['',[Validators.required]],
      manzana: [null],
      lote: [null],
      idGrupoVivienda: [null,[Validators.required]]
    });
   }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.idVivienda = Number(params.get('id'));
      if(this.idVivienda && this.idVivienda > 0){
        this.obtenerDatos()
      }
    });
  }

  obtenerDatos(){
    this.viviendaService.obtenerViviendaPorId(this.idVivienda)
    .subscribe((response: { success: boolean; data: EVivienda}) =>{
      if(response.success){
        let vivienda = response.data;
        this.formData.get('propietario')?.setValue(vivienda.nombrePropietario)
        this.formData.get('direccion')?.setValue(vivienda.direccion)
        this.formData.get('manzana')?.setValue(vivienda.manzana)
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
        nombrePropietario: this.formData.get('propietario')?.value,
        direccion: this.formData.get('direccion')?.value,
        manzana: this.formData.get('manzana')?.value,
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

  modificarVivienda(){
    if(this.formData.valid){
      let parametros: EVivienda = {
        id: this.idVivienda,
        nombrePropietario: this.formData.get('propietario')?.value,
        direccion: this.formData.get('direccion')?.value,
        manzana: this.formData.get('manzana')?.value,
        lote: this.formData.get('lote')?.value,
        idGrupoVivienda: this.formData.get('idGrupoVivienda')?.value,
        estado: true
      }

      this.viviendaService.modificararVivienda(parametros).subscribe((response: { success: boolean; data: number }) =>{
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
        this.formData.get('idGrupoVivienda')?.setValue(this.lstZonas[0].id)
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
