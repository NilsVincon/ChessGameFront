import {User} from "./friendship.model";

export interface Invitation {
  id : number;
  receiver: User;
  sender: User;
}
