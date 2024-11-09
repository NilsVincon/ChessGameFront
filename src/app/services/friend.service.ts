import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpHeaders} from "@angular/common/http";
import { Observable } from 'rxjs';
import {Friendship, User} from '../models/friendship.model';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  private baseUrl = 'http://localhost:8080/api/friend';
  constructor(private http: HttpClient) { }

    getAllFriendships(): Observable<Friendship[]> {
    return this.http.get<Friendship[]>(`${this.baseUrl}/getFriends`);
  }

   inviteFriend(friendUsername: String): Observable<any> {
   return this.http.post('http://localhost:8080/play/invite', friendUsername, {
     headers: new HttpHeaders({ 'Content-Type': 'application/json' })
   });
 }

  addFriendship(username_friend: string): Observable<any> {
    const url = `${this.baseUrl}/add/${username_friend}`;
    return this.http.post(url, {}, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
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
