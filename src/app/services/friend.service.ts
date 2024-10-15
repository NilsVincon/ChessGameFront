import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpHeaders} from "@angular/common/http";
import { Observable } from 'rxjs';
import { Friendship } from '../models/friendship.model';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  private baseUrl = 'http://localhost:8080/friendship';
  constructor(private http: HttpClient) { }

  getAllFriendships(): Observable<Friendship[]> {
    return this.http.get<Friendship[]>(`${this.baseUrl}/getAll`);
  }

  addFriendship(friendship: Friendship): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, friendship, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  checkFriendship(friendship: Friendship): Observable<any> {
    return this.http.post(`${this.baseUrl}/checkFriendship`, friendship, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  deleteFriendship(friendship: Friendship): Observable<any> {
    return this.http.post(`${this.baseUrl}/delete`, friendship, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

}
