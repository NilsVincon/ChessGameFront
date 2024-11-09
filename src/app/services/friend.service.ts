import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpHeaders} from "@angular/common/http";
import {Observable} from 'rxjs';
import {Friendship, User} from '../models/friendship.model';
import {Invitation} from "../models/invitation.model";

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  private baseUrl = 'http://localhost:8080/api/friend';

  constructor(private http: HttpClient) {
  }

  getAllFriendships(): Observable<Friendship[]> {
    return this.http.get<Friendship[]>(`${this.baseUrl}/getFriends`);
  }

  getMyInvitations(): Observable<Invitation[]> {
    console.log("réponse de l'api" + this.http.get<Invitation[]>('http://localhost:8080/play/getMyInvitations'))
    return this.http.get<Invitation[]>('http://localhost:8080/play/getMyInvitations');
  }

  acceptInviation(invitation: Invitation): Observable<any> {
    return this.http.post('http://localhost:8080/play/accept', invitation.id);
  }

  refuseInviation(invitation: Invitation): Observable<any> {
    return this.http.post('http://localhost:8080/play/refuse', invitation.id);
  }

  inviteFriend(friendUsername: String): Observable<any> {
    return this.http.post('http://localhost:8080/play/invite', friendUsername);
  }

  addFriendship(username_friend: string): Observable<any> {
    const url = `${this.baseUrl}/add/${username_friend}`;
    return this.http.post(url, {});
  }

  checkFriendship(friendship: Friendship): Observable<any> {
    return this.http.post(`${this.baseUrl}/checkFriendship`, friendship);
  }

  deleteFriendship(friendship: Friendship): Observable<any> {
    return this.http.post(`${this.baseUrl}/delete`, friendship);
  }

}
