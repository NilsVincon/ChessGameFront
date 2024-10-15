import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {GameComponent} from "./game/game.component";
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";
import {HistoryComponent} from "./history/history.component";
import {RankingComponent} from "./ranking/ranking.component";
import {FriendComponent} from "./friend/friend.component";
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'new-game', component:GameComponent},
  {path:'login', component:LoginComponent},
  {path:'signup', component:SignupComponent},
  {path:'history', component:HistoryComponent},
  {path:'ranking', component:RankingComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  {path: '', redirectTo: '/login', pathMatch: 'full' },
  {path:'friend', component:FriendComponent}
];
