import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EHistorialLectura, ELecturaVivienda } from '../modelos/ELecturaVivienda';
import { StatusResponse } from './StatusResponse.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LecturaService {

  API_URL: string = environment.api + "/api/Lecturavivienda";

  constructor(private http: HttpClient) { }

  listarLecturaVivienda(idVivienda: number) {
    let params = new HttpParams();

    params = params.append('idVivienda', idVivienda.toString());
    return this.http.get<any>(`${this.API_URL}/listarLecturaVivienda`, { params });
  }

  modificarLectura(objLectura: ELecturaVivienda): Observable<StatusResponse<number>> {
    return this.http.put<StatusResponse<number>>(`${this.API_URL}/modificarLecturaVivienda`, objLectura);
  }

  insertarHistorialLectura(objHistorial: EHistorialLectura): Observable<StatusResponse<number>> {
    return this.http.post<StatusResponse<number>>(`${this.API_URL}/insertarHistorialLectura`, objHistorial);
  }

  listarHistorialLectura(parametro: string, idUsuario: number) {
    let params = new HttpParams();

    params = params.append('parametro', parametro.toString());
    params = params.append('idUsuario', idUsuario.toString());
    return this.http.get<any>(`${this.API_URL}/listarHistorialLectura`, { params });
  }
}
