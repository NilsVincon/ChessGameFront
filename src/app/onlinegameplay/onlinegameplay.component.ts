import {Component, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router'; // Importez ActivatedRoute
import {HttpClient} from '@angular/common/http';
import {Position} from '../models/position.model'; // Importez la classe Position
import {Move} from '../models/move.model';
import {OnlineMove} from "../models/onlinemove";
import {WebsocketService} from "../services/websocket.service"; // Importez la classe Move

@Component({
  selector: 'app-onlinegameplay',
  templateUrl: './onlinegameplay.component.html',
  standalone: true,
  styleUrls: ['./onlinegameplay.component.scss']
})
export class OnlinegameplayComponent implements AfterViewInit {

  private initialPosition: Position | null = null;
  isPlayerOneTurn: boolean = true;
  private whiteTime: number = 600;
  private blackTime: number = 600;
  private activePlayer: 'white' | 'black' = 'white';
  private timerInterval: any;
  gameId: string | null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute,private websocketService: WebsocketService) {
  }

  ngAfterViewInit(): void {
    this.startTimer();
    this.gameId = this.route.snapshot.paramMap.get('gameId');
    console.log('Game ID:', this.gameId);

    const squares = document.querySelectorAll<HTMLDivElement>('.square');

    squares.forEach(square => {
      square.addEventListener('click', () => {
        const position = square.dataset['position'];
        if (position) {
          console.log(`Vous avez sélectionné la case: ${position}`);

          // Convertir la position en objet Position
          const posObject = this.convertToPosition(position);
          console.log(`Objet Position:`, posObject); // Afficher l'objet Position

          if (!this.initialPosition) {
            this.initialPosition = posObject;
            this.highlightSquare(square);
          } else {
            if (this.gameId) {
              const move = new OnlineMove(this.initialPosition, posObject, this.gameId);
              console.log('Objet Move:', move);
              this.sendMoveToBackend(move);
              this.initialPosition = null;
              this.toggleTurn();
            } else {
              alert('Game ID est manquant!');
            }
          }
        }
      });
    });
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.activePlayer === 'white') {
        this.whiteTime--;
        this.updateTimerDisplay('white', this.whiteTime);
      } else {
        this.blackTime--;
        this.updateTimerDisplay('black', this.blackTime);
      }

      // Arrêtez le minuteur lorsque le temps atteint zéro
      if (this.whiteTime <= 0 || this.blackTime <= 0) {
        clearInterval(this.timerInterval);
        alert(`Le temps est écoulé pour ${this.activePlayer === 'white' ? 'Blanc' : 'Noir'}!`);
      }
    }, 1000);
  }

  updateTimerDisplay(player: 'white' | 'black', time: number): void {
    const timerElement = document.querySelector(`.player-info.${player} .timer`);
    if (timerElement) {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
  }

  toggleTurn(): void {
    this.activePlayer = this.activePlayer === 'white' ? 'black' : 'white'; // Change le joueur actif
    clearInterval(this.timerInterval); // Arrêtez le minuteur actuel
    this.startTimer(); // Démarre le minuteur pour le nouveau joueur
  }

  sendMoveToBackend(move: Move): void {
    const moveData = {
      initialPosition: {
        row: move.initialPosition.row,
        column: move.initialPosition.column
      },
      finalPosition: {
        row: move.finalPosition.row,
        column: move.finalPosition.column
      },
      gameId: this.gameId // Inclure gameId dans le corps du message
    };
    this.websocketService.sendMove(moveData);
    this.updateBoardAfterMove(move);
  }
  private updateBoardAfterMove(move: Move): void {
    const originSquare = document.querySelector(`.square[data-position="${String.fromCharCode(97 + move.initialPosition.column)}${8 - move.initialPosition.row}"]`);
    const destinationSquare = document.querySelector(`.square[data-position="${String.fromCharCode(97 + move.finalPosition.column)}${8 - move.finalPosition.row}"]`);

    this.clearHighlights();

    // Déplacer l'image de la pièce
    if (originSquare && destinationSquare) {
      const piece = originSquare.querySelector('img');

      // Retirer toute pièce existante sur la case de destination
      const existingPiece = destinationSquare.querySelector('img');
      if (existingPiece) {
        existingPiece.remove();
      }

      if (piece) {
        destinationSquare.appendChild(piece);
      }
      this.highlightSquare(originSquare as HTMLElement);
      this.highlightSquare(destinationSquare as HTMLElement);
    }
  }

  convertToPosition(moov: string): Position {
    const column = moov.charCodeAt(0) - 'a'.charCodeAt(0); // Convert 'a' to 'h' to 0 to 7
    const row = 8 - parseInt(moov[1], 10); // Convert '1' to '8' to 7 to 0

    if (column < 0 || column > 7 || row < 0 || row > 7) {
      throw new Error('Position invalide');
    }

    return new Position(row, column);
  }

  private highlightSquare(square: HTMLElement): void {
    square.classList.add('highlight');
  }

  private clearHighlights(): void {
    const highlightedSquares = document.querySelectorAll('.square.highlight');
    highlightedSquares.forEach(square => square.classList.remove('highlight'));
  }
}
