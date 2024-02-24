import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ELecturaVivienda } from '../modelos/ELecturaVivienda';
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
}
