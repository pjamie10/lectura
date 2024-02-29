import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EManzana } from '../modelos/EManzana';
import { StatusResponse } from './StatusResponse.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManzanaService {

  API_URL: string = environment.api + "/api/manzana";

  constructor(private http: HttpClient) { }

  insertarManzana(objManzana: EManzana): Observable<StatusResponse<EManzana>> {
    return this.http.post<StatusResponse<EManzana>>(`${this.API_URL}/insertarManzana`, objManzana);
  }

  listarManzana(idGrupoVivienda: number) {
    let params = new HttpParams();

    params = params.append('idGrupoVivienda', idGrupoVivienda.toString());
    return this.http.get<any>(`${this.API_URL}/listarManzana`, { params });
  }

  modificarManzana(objManzana: EManzana): Observable<StatusResponse<number>> {
    return this.http.put<StatusResponse<number>>(`${this.API_URL}/modificarManzana`, objManzana);
  }

}
