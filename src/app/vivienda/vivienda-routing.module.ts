import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViviendaComponent } from './vivienda.component';
import { DatosViviendaComponent } from './datos-vivienda/datos-vivienda.component';
import { AuthGuard } from '../services/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ViviendaComponent, canActivate: [AuthGuard]
  },
  {
    path: 'datos-vivienda/:id',
    component: DatosViviendaComponent, canActivate: [AuthGuard],
    loadChildren: () => import('../vivienda/datos-vivienda/datos-vivienda.module').then( m => m.DatosViviendaModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViviendaRoutingModule { }
