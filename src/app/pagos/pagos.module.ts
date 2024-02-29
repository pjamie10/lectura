import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PagosRoutingModule } from './pagos-routing.module';
import { FormsModule } from '@angular/forms';
import { PagosComponent } from './pagos.component';


@NgModule({
  declarations: [PagosComponent],
  imports: [
    CommonModule,
    PagosRoutingModule,
    FormsModule,
    IonicModule
  ]
})
export class PagosModule { }
