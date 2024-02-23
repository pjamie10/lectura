import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ZonaComponent } from './zona/zona.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    component: LoginComponent,
    loadChildren: () => import('./login/login.module').then( m => m.LoginModule)
  },
  {
    path: 'zona',
    component: ZonaComponent, canActivate: [AuthGuard],
    loadChildren: () => import('./zona/zona.module').then( m => m.ZonaModule)
  },
  {
    path: 'medir',
    loadChildren: () => import('./medir/medir.module').then( m => m.MedirModule)
  },
  {
    path: 'vivienda',
    loadChildren: () => import('./vivienda/vivienda.module').then( m => m.ViviendaModule)
  },
  {
    path: 'message/:id',
    loadChildren: () => import('./view-message/view-message.module').then( m => m.ViewMessagePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
