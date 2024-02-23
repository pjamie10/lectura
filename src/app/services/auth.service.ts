import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  tieneToken(): boolean {
    const token = localStorage.getItem('token');
    return token !== null && token !== undefined && token !== "";
  }
}
