import { Component, OnInit } from '@angular/core';
import { FriendService } from '../services/friend.service';
import { Friendship } from '../models/friendship.model';
import {CommonModule} from "@angular/common";
import {Invitation} from "../models/invitation.model";
import {Router} from "@angular/router";


@Component({
  selector: 'app-friend-list',
  templateUrl: './onlinegame.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./onlinegame.component.scss']
})
export class OnlinegameComponent implements OnInit {

  friends: Friendship[] = [];
  invitations : Invitation[] = [];
  colorSender: string | null = null;
  colorReceiver: string | null = null;
  senderUsername: string | null = null;
  receiverUsername: string | null = null;

  constructor(private friendshipService: FriendService,private router : Router) {}

  ngOnInit(): void {
    this.loadFriends();
    this.showMyInvitations();
  }

  loadFriends() {
    this.friendshipService.getAllFriendships().subscribe(data => {
      this.friends = data;
    }, error => {
      console.error("Erreur lors du chargement des amitiés", error);
    });
  }

  showMyInvitations() {
    this.friendshipService.getMyInvitations().subscribe(data => {
      this.invitations = data;
    }, error => {
      console.error("Erreur lors du chargement des invitations", error);
    });
  }

  acceptInvitation(invitation: Invitation) {
    this.friendshipService.acceptInviation(invitation).subscribe(
      (response) => {
        const gameId = response.gameId;
        const colorSender = response.colorSender;
        const colorReceiver = response.colorReceiver;
        const senderUsername = response.senderUsername;
        const receiverUsername = response.receiverUsername;
        this.router.navigate(['/onlinegameplay', gameId, colorSender, colorReceiver, senderUsername, receiverUsername]);
        console.log('Invitation acceptée', response);
      },
      (error) => {
        console.error("Erreur lors de l'acceptation de l'invitation", error);
      }
    );
  }

  refuseInvitation(invitation: Invitation) {
    this.friendshipService.refuseInviation(invitation).subscribe(
      (response) => {
        console.log('Invitation refusé', response);
      },
      (error) => {
        console.error("Erreur lors du refus de l'invitation", error);
      }
    );
  }

  invite(friendUsername: String) {
    this.friendshipService.inviteFriend(friendUsername).subscribe(
      (response) => {
        console.log('Invitation envoyée', response);
        const id_game = response.gameId;
        const colorSender = response.colorSender;
        const colorReceiver = response.colorReceiver;
        const senderUsername = response.senderUsername;
        const receiverUsername = response.receiverUsername;
        this.router.navigate(['/onlinegameplay', id_game, colorSender, colorReceiver, senderUsername, receiverUsername]);
      },
      (error) => {
        console.error("Erreur lors de l'envoi de l'invitation", error);
      }
    );
  }
}
