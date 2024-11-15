import {Component, OnInit} from "@angular/core";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Friendship} from "../models/friendship.model";
import {FriendService} from "../services/friend.service";
import {CommonModule} from "@angular/common";


@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule,RouterLink, FormsModule, NgForOf, NgIf],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent implements OnInit {
  friendships: Friendship[] = [];
  rankedFriends: { name: Friendship, points: number }[] = [];

  constructor(private friendService: FriendService) {
  }

  ngOnInit(): void {
    this.friendService.getAllFriendships().subscribe(friends => {
      this.friendships = friends;
      console.log(this.friendships);
      this.rankFriends();
    });
  }

  rankFriends(): void {
    this.rankedFriends = this.friendships.map(friend => ({
      name: friend,
      points: Math.floor(Math.random() * 100) + 1
    }));

    this.rankedFriends.sort((a, b) => b.points - a.points);
  }
}
