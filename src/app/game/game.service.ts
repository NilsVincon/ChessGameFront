import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChessService {
  private apiUrl = 'http://localhost:8080/user/get';

  constructor(private http: HttpClient) { }

  getPlayers(): Observable<any> {
    return this.http.get<any>(this.apiUrl); // L'API renvoie les données des joueurs
  }
}
