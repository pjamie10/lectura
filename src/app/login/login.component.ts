import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { EUsuario } from '../modelos/EUsuario';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { MessageStatusResponse } from '../services/StatusResponse.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  screen: any = 'signin';
  formData: FormGroup;
  formRegister: FormGroup;
  isLoading: boolean = false;
  loading!: HTMLIonLoadingElement;

  constructor(
    private fb:FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController
    ) {
    this.formData = this.fb.group({
      usuario: ['',[Validators.required]],
      password: ['',[Validators.required, Validators.minLength(5)]],
    });
    this.formRegister = this.fb.group({
      nombres: ['',[Validators.required]],
      apellidos: ['',[Validators.required]],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      usuario: ['',[Validators.required]],
      contraseña: ['',[Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(){
    localStorage.setItem('token', '');
  }

  change(event: any){
    this.screen = event;
  }

  async mostrarLoading() {
    this.loading = await this.loadingController.create({
      message: 'Ingresando...',
      duration: 500,
    });

    await this.loading.present();
  }

  login(){
    if(this.formData.valid){
      this.isLoading = true
      this.validarUsuario(this.formData.get('usuario')?.value, this.formData.get('password')?.value);
    }else{
      this.mostrarAlert('Revise los datos ingresados');
    }
  }

  validarUsuario(usuario: string, clave: string) {
    this.usuarioService.validarUsuario(usuario,clave)
    .subscribe((response: { success: boolean; data: string; messages?: MessageStatusResponse[]}) =>{
      if(response.success){
        this.mostrarLoading();
        let token = response.data;
        localStorage.setItem('token', token);
        this.router.navigate(['/home']);
      }else{
        if(response.messages){
          this.mostrarAlert(response.messages[0].message);
        }
      }
    },
      (error: any) => {
        this.mostrarToast('Ha ocurrido un error con los servicios');
      });
  }

  register(){
    if(this.formRegister.valid){
      this.isLoading = true

      let parametros: EUsuario = {
        id: 0,
        nombres: this.formRegister.get('nombres')?.value,
        apellidos: this.formRegister.get('apellidos')?.value,
        dni: this.formRegister.get('dni')?.value,
        usuario: this.formRegister.get('usuario')?.value,
        clave: this.formRegister.get('contraseña')?.value,
        estado: 'A'
      }
      this.usuarioService.insertarUsuario(parametros).subscribe((response: { success: boolean; data: EUsuario; }) =>{
        if(response.success){
          this.router.navigate(['/home'])
          this.mostrarToast('Se ha registrado correctamente');
        }else{
        }
      },
        (error: any) => {
          this.mostrarToast('Ha ocurrido un error con los servicios');
        });
    }else{
      this.mostrarAlert('Revise los datos ingresados');
    }
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom'
    });

    toast.present();
  }

  async mostrarAlert(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }
}
