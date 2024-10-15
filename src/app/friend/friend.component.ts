import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Friendship} from "../models/friendship.model";
import {FriendService} from "../services/friend.service";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-friend',
  standalone: true,
  imports: [RouterLink, FormsModule, NgForOf],
  templateUrl: './friend.component.html',
  styleUrl: './friend.component.scss'
})
export class FriendComponent implements OnInit {

  friendships: Friendship[] = [];

  constructor(private friendService: FriendService) { }

  ngOnInit(): void {
    this.loadFriends();
  }

  loadFriends() {
    this.friendService.getAllFriendships().subscribe(data => {
      this.friendships = data;
    }, error => {
      console.error("Erreur lors du chargement des amitiés", error);
    });
  }

  addFriend(friend1Id: number, friend2Id: number) {
    const newFriendship: Friendship = { friend1: friend1Id, friend2: friend2Id };
    this.friendService.addFriendship(newFriendship).subscribe(
      (response) => {
        console.log('Amitié ajoutée', response);
        this.loadFriends();
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de l\'amitié', error);
      }
    );
  }

  removeFriend(friendship: Friendship) {
    this.friendService.deleteFriendship(friendship).subscribe(response => {
      console.log("Amitié supprimée", response);
      this.loadFriends();
    }, error => {
      console.error("Erreur lors de la suppression de l'amitié", error);
    });
  }
}
