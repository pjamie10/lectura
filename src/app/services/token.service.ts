import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private token: string | null = null;

  constructor() {
    // Obtener el token almacenado
    this.token = localStorage.getItem('token');
  }

  getDecodedToken(): any {
    if (this.token) {
      // Decodificar el token
      return jwtDecode(this.token);
    } else {
      return null;
    }
  }
}
