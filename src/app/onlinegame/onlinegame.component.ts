import { Component, OnInit } from '@angular/core';
import { FriendService } from '../services/friend.service';
import { Friendship } from '../models/friendship.model';
import {CommonModule} from "@angular/common";


@Component({
  selector: 'app-friend-list',
  templateUrl: './onlinegame.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./onlinegame.component.scss']
})
export class OnlinegameComponent implements OnInit {

  friends: Friendship[] = [];

  constructor(private friendshipService: FriendService) {}

  ngOnInit(): void {
    this.loadFriends();
  }

  loadFriends() {
    this.friendshipService.getAllFriendships().subscribe(data => {
      this.friends = data;
    }, error => {
      console.error("Erreur lors du chargement des amitiés", error);
    });
  }

  invite(friendUsername: String) {
    this.friendshipService.inviteFriend(friendUsername).subscribe(
      (response) => {
        console.log('Invitation envoyée', response);
      },
      (error) => {
        console.error("Erreur lors de l'envoi de l'invitation", error);
      }
    );
  }
}
