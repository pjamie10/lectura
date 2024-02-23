import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EUsuario } from '../modelos/EUsuario';
import { StatusResponse } from './StatusResponse.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  API_URL: string = environment.api + "/api/usuario";

  constructor(private http: HttpClient) { }

  insertarUsuario(objPedido: EUsuario): Observable<StatusResponse<EUsuario>> {
    return this.http.post<StatusResponse<EUsuario>>(`${this.API_URL}/insertarUsuario`, objPedido);
  }

  validarUsuario(usuario: string, clave: string) {
    let params = new HttpParams();

    params = params.append('usuario', usuario.toString());
    params = params.append('clave', clave.toString());
    return this.http.get<any>(`${this.API_URL}/validarUsuario`, { params });
  }
}
