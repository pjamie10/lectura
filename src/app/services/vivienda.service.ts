import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EVivienda } from '../modelos/EVivienda';
import { Observable } from 'rxjs';
import { StatusResponse } from './StatusResponse.model';

@Injectable({
  providedIn: 'root'
})
export class ViviendaService {
  API_URL: string = environment.api + "/api/vivienda";

  constructor(private http: HttpClient) { }

  insertarVivienda(objVivienda: EVivienda): Observable<StatusResponse<EVivienda>> {
    return this.http.post<StatusResponse<EVivienda>>(`${this.API_URL}/insertarVivienda`, objVivienda);
  }

  modificarVivienda(objVivienda: EVivienda): Observable<StatusResponse<number>> {
    return this.http.put<StatusResponse<number>>(`${this.API_URL}/modificarVivienda`, objVivienda);
  }

  listarVivienda(idUsuarioAsignado: number, idGrupoVivienda: number) {
    let params = new HttpParams();

    params = params.append('idUsuario', idUsuarioAsignado.toString());
    params = params.append('idGrupoVivienda', idGrupoVivienda.toString());
    return this.http.get<any>(`${this.API_URL}/listarVivienda`, { params });
  }

  obtenerViviendaPorId(id: number) {
    let params = new HttpParams();

    params = params.append('id', id.toString());
    return this.http.get<any>(`${this.API_URL}/obtenerPorId`, { params });
  }
}
