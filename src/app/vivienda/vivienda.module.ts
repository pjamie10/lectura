import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViviendaRoutingModule } from './vivienda-routing.module';
import { IonicModule } from '@ionic/angular';
import { ViviendaComponent } from './vivienda.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ViviendaComponent],
  imports: [
    CommonModule,
    IonicModule,
    ViviendaRoutingModule,
    FormsModule
  ]
})
export class ViviendaModule { }
