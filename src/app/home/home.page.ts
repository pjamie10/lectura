import { Component, inject } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';
import { DataService, Message } from '../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private data = inject(DataService);
  constructor(private router: Router) {}

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }

  viviendas(){
    this.router.navigate(['/vivienda'])
  }

  pagos(){
    this.router.navigate(['/pagos'])
  }

  medir(){
    this.router.navigate(['/medir'])
  }

  zonas(){
    this.router.navigate(['/zona'])
  }

  cerrarSesion(){
    localStorage.removeItem('token');
    this.router.navigate(['/login'])
  }

  getMessages(): Message[] {
    return this.data.getMessages();
  }
}
