import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Position } from '../models/position.model';
import { Move } from '../models/move.model';
import { OnlineMove } from "../models/onlinemove";
import { WebsocketService } from "../services/websocket.service";
import {NgClass, NgIf, NgOptimizedImage} from "@angular/common";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-onlinegameplay',
  templateUrl: './onlinegameplay.component.html',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgClass,
    NgIf
  ],
  styleUrls: ['./onlinegameplay.component.scss']
})
export class OnlinegameplayComponent implements AfterViewInit, OnDestroy {

  private initialPosition: Position | null = null;
  isPlayerOneTurn: boolean = true;
  private whiteTime: number = 600;
  private blackTime: number = 600;
  private timerInterval: any;
  gameId: string | null = null;
  playerColor: string | null = null; // Couleur du joueur connecté
  opponentColor: string | null = null; // Couleur de l'adversaire
  isWhiteView: boolean = true; // Vue de l'échiquier basée sur la couleur du joueur
  private websocketSubscription: any;
  activePlayer : String = "";

  constructor(private http: HttpClient, private route: ActivatedRoute, private websocketService: WebsocketService,private authService : AuthService) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.startTimer();
      this.gameId = this.route.snapshot.paramMap.get('gameId');
      const username = this.authService.getUsernameFromToken();
      const senderUsername = this.route.snapshot.paramMap.get('senderUsername');
      const receiverUsername = this.route.snapshot.paramMap.get('receiverUsername');
      const colorSender = this.route.snapshot.paramMap.get('colorSender');
      const colorReceiver = this.route.snapshot.paramMap.get('colorReceiver');
      this.playerColor = username === senderUsername ? colorSender : colorReceiver;
      this.opponentColor = this.playerColor === 'white' ? 'black' : 'white';
      this.isWhiteView = this.playerColor === 'white';
      console.log("Je suis " + username + " et je joue la couleur " + this.playerColor + ". Mon adversaire est " + (username === senderUsername ? receiverUsername : senderUsername) + " et il joue la couleur " + this.opponentColor);


      if (this.gameId) {
        this.websocketService.connect('ws://localhost:8080/ws', this.gameId);

        // Subscription pour les mouvements reçus du WebSocket
        this.websocketSubscription = this.websocketService.onMove().subscribe(
          (message: any) => {
            this.updateBoardAfterMove(message);
          },
          (error) => {
            console.error('WebSocket error:', error);
          }
        );

        // Subscription pour les réponses aux mouvements
        this.websocketService.onMoveResponse().subscribe(response => {
          if (response.success) {
            this.updateBoardAfterMove(response.move);
          } else {
            console.error('Erreur de mouvement:', response.errorMessage);
            alert('Mouvement invalide ! Veuillez réessayer.');
            this.clearHighlights();
          }
        });
      } else {
        console.error('Game ID est manquant !');
      }

      // Gestion des clics sur les cases de l'échiquier
      const squares = document.querySelectorAll<HTMLDivElement>('.square');
      squares.forEach(square => {
        square.addEventListener('click', () => {
          const position = square.dataset['position'];
          if (position) {
            const posObject = this.convertToPosition(position);
            if (!this.initialPosition) {
              this.initialPosition = posObject;
              this.highlightSquare(square);
            } else {
              if (this.gameId) {
                this.activePlayer=this.websocketService.activePlayer;
                console.log("couleur du ws : "+this.activePlayer + " couleur du joueur : "+this.playerColor);
                if (this.websocketService.activePlayer === this.playerColor) {
                  const move = new OnlineMove(this.initialPosition, posObject, this.gameId, this.activePlayer);
                  this.sendMoveToBackend(move,this.activePlayer);
                  console.log("active player : "+this.activePlayer);
                  this.initialPosition = null;
                } else {
                  alert('Ce n\'est pas votre tour de jouer !');
                }
              } else {
                alert('Game ID est manquant!');
              }
            }
          } else {
            alert('Vous ne pouvez jouer que vos propres pièces !');
          }
        });
      });
    });
  }

  ngOnDestroy(): void {
    if (this.websocketSubscription) {
      this.websocketSubscription.unsubscribe(); // Désabonnement propre
    }
    this.websocketService.disconnect(); // Déconnexion propre du WebSocket
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

  sendMoveToBackend(move: Move,activePlayer : String): void {
    const moveData = {
      move: {  // Emballer move dans un objet
        initialPosition: {
          row: move.initialPosition.row,
          column: move.initialPosition.column
        },
        finalPosition: {
          row: move.finalPosition.row,
          column: move.finalPosition.column
        }
      },
      activePlayer: activePlayer
    };
    console.log("Sending move data:", moveData);
    this.websocketService.sendMove(moveData, this.gameId);
  }

  private updateBoardAfterMove(move: Move): void {
    const originSquare = document.querySelector(`.square[data-position="${String.fromCharCode(97 + move.initialPosition.column)}${8 - move.initialPosition.row}"]`);
    const destinationSquare = document.querySelector(`.square[data-position="${String.fromCharCode(97 + move.finalPosition.column)}${8 - move.finalPosition.row}"]`);

    this.clearHighlights();

    if (originSquare && destinationSquare) {
      const piece = originSquare.querySelector('img');

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
    const column = moov.charCodeAt(0) - 'a'.charCodeAt(0);
    const row = 8 - parseInt(moov[1], 10);

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
