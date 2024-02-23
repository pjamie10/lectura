import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedirRoutingModule } from './medir-routing.module';
import { IonicModule } from '@ionic/angular';
import { MedirComponent } from './medir.component';

@NgModule({
  declarations: [MedirComponent],
  imports: [
    CommonModule,
    MedirRoutingModule,
    IonicModule
  ]
})
export class MedirModule { }
