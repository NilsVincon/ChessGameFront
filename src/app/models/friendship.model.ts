export interface User {
  id: number;
  username: string;
}

export interface Friendship {
  friend1: User;
  friend2: User;
}
