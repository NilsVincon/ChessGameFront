import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {GameComponent} from "./game/game.component";
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";
import {HistoryComponent} from "./history/history.component";
import {RankingComponent} from "./ranking/ranking.component";
import {FriendComponent} from "./friend/friend.component";
import {OnlinegameComponent} from "./onlinegame/onlinegame.component";
import {OnlinegameplayComponent} from "./onlinegameplay/onlinegameplay.component";
export const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'new-game', component:GameComponent},
  {path:'login', component:LoginComponent},
  {path:'signup', component:SignupComponent},
  {path:'history', component:HistoryComponent},
  {path:'ranking', component:RankingComponent},
  {path:'onlinegame', component:OnlinegameComponent},
  {path: 'onlinegameplay/:gameId/:colorSender/:colorReceiver/:senderUsername/:receiverUsername', component: OnlinegameplayComponent },
  {path: '', redirectTo: '/login', pathMatch: 'full' },
  {path:'friend', component:FriendComponent}
];
