import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EGrupoVivienda } from '../modelos/EGrupoVivienda';
import { StatusResponse } from './StatusResponse.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZonaService {

  API_URL: string = environment.api + "/api/grupoVivienda";

  constructor(private http: HttpClient) { }

  insertarZona(objGrupo: EGrupoVivienda): Observable<StatusResponse<EGrupoVivienda>> {
    return this.http.post<StatusResponse<EGrupoVivienda>>(`${this.API_URL}/insertarGrupoVivienda`, objGrupo);
  }

  listarZonas(idUsuarioAsignado: number) {
    let params = new HttpParams();

    params = params.append('Parametro', idUsuarioAsignado.toString());
    return this.http.get<any>(`${this.API_URL}/listarGrupoVivienda`, { params });
  }

  modificarZona(objGrupo: EGrupoVivienda): Observable<StatusResponse<number>> {
    return this.http.put<StatusResponse<number>>(`${this.API_URL}/modificarGrupoVivienda`, objGrupo);
  }

}
