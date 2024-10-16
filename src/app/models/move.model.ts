import { Position } from './position.model';

export class Move {
  constructor(
    public initialPosition: Position,
    public finalPosition: Position
  ) {}
}
