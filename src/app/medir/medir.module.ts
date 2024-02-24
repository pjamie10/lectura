import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedirRoutingModule } from './medir-routing.module';
import { IonicModule } from '@ionic/angular';
import { MedirComponent } from './medir.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [MedirComponent],
  imports: [
    CommonModule,
    MedirRoutingModule,
    IonicModule,
    FormsModule
  ]
})
export class MedirModule { }
