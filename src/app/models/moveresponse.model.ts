import { Move } from './move.model';

export class Moveresponse {
  constructor(
    public move: Move,
    public checkmate: String,
  ) {}
}
