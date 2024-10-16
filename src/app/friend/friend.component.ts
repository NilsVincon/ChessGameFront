import {Component, OnInit} from "@angular/core";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Friendship} from "../models/friendship.model";
import {FriendService} from "../services/friend.service";
import {CommonModule} from "@angular/common";


@Component({
  selector: 'app-friend',
  standalone: true,
  imports: [CommonModule,RouterLink, FormsModule, NgForOf, NgIf],
  templateUrl: './friend.component.html',
  styleUrl: './friend.component.scss'
})
export class FriendComponent implements OnInit {

  friendships: Friendship[] = [];
  constructor(private friendService: FriendService,private router: Router) { }
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

  addFriend(username_friend: string, inputElement: HTMLInputElement) {
    this.friendService.addFriendship(username_friend).subscribe({
      next: (response) => {
        console.log('Amitié ajoutée', response);
        this.loadFriends();
        inputElement.value = '';
        this.router.navigate(['/friend']);
      },
      error: (error) => {
        console.error("Erreur lors de l'ajout de l'amitié", error);
      }
    });
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
