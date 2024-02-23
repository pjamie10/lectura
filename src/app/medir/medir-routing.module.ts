import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedirComponent } from './medir.component';
import { AuthGuard } from '../services/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MedirComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedirRoutingModule { }
