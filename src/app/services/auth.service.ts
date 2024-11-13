import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  getUsernameFromToken(): string | null {
    const token = localStorage.getItem('jwtToken'); // Ou utiliser un autre mécanisme pour stocker le token
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.sub || null; // Assurez-vous que le nom de l'utilisateur est stocké dans le token sous "username"
    }
    return null;
  }
}
