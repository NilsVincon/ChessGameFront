import { Position } from './position.model';

export class OnlineMove {
  constructor(
    public initialPosition: Position,
    public finalPosition: Position,
    public gameId:String
  ) {}
}
