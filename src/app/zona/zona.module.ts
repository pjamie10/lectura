import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ZonaComponent } from './zona.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ZonaComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class ZonaModule { }
