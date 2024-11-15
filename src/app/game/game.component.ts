import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {NgClass, NgOptimizedImage} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Position } from '../models/position.model';
import { Move } from '../models/move.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    RouterLink,
    NgOptimizedImage,
    NgClass,
    FormsModule
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit, OnInit, FormsModule {


  private initialPosition: Position | null = null; // Pour stocker la position initiale
  isPlayerOneTurn: boolean = true;
  private whiteTime: number = 600;
  private blackTime: number = 600;
  private activePlayer: 'white' | 'black' = 'white';
  private timerInterval: any;
  whiteDrawRequest: boolean = false;
  blackDrawRequest: boolean = false;


  resetGame(): void {
    this.whiteTime = 600;
    this.blackTime = 600;
    this.activePlayer = 'white';
    this.isPlayerOneTurn = true;
    this.clearHighlights();
    this.whiteDrawRequest = false;
    this.blackDrawRequest = false;
    //this.initialPosition = null;
    //clearInterval(this.timerInterval);
    //this.startTimer();
  }

  ngOnInit(): void {
    this.resetGame();
  }

  constructor(private http: HttpClient, public dialog: MatDialog,  private router: Router) {}

  ngAfterViewInit(): void {
    this.startTimer();
    const squares = document.querySelectorAll<HTMLDivElement>('.square');

    squares.forEach(square => {
      square.addEventListener('click', () => {
        const position = square.dataset['position'];
        if (position) {
          // Convertir la position en objet Position
          const posObject = this.convertToPosition(position);
          console.log(`Objet Position:`, posObject);

          if (!this.initialPosition) {
            this.initialPosition = posObject;
            this.highlightSquare(square);
          } else {
            const move = new Move(this.initialPosition, posObject);
            console.log('Objet Move:', move);
            this.sendMoveToBackend(move);
            this.initialPosition = null;
            this.toggleTurn();
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
    this.activePlayer = this.activePlayer === 'white' ? 'black' : 'white';
    clearInterval(this.timerInterval);
    this.startTimer();
  }

  toggleTurnAndRotateBoard(): void {
    this.isPlayerOneTurn = !this.isPlayerOneTurn;

    const chessboardRotatable = document.querySelector('.chessboard-rotatable');
    if (chessboardRotatable) {
      if (this.isPlayerOneTurn) {
        chessboardRotatable.classList.remove('rotate-180');
      } else {
        chessboardRotatable.classList.add('rotate-180');
      }
    }
  }

  sendMoveToBackend(move: Move): void {
    const url = 'http://localhost:8080/move';
    const body = {
      initialPosition: {
        row: move.initialPosition.row,
        column: move.initialPosition.column
      },
      finalPosition: {
        row: move.finalPosition.row,
        column: move.finalPosition.column
      }
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(response => this.handleResponse(response))
      .then(data => {
        console.log('Success:', data);
        if (data.checkmate=="true") {
          if(this.activePlayer == 'black'){
            alert('Échec et mat ! Les blancs ont gagné ');
            this.router.navigate(['']);
          }
          else{
            alert('Échec et mat ! Les noirs ont gagné ');
            this.router.navigate(['']);
          }

        }})
      .then(data => this.updateBoard(move))
      .catch(error => this.handleError(error));
  }
  private handleResponse(response: Response): Promise<any> {
    if (!response.ok) {
      return response.json().then(errorData => {
        throw new Error(errorData.message || 'Erreur lors de la requête');
      });
    }
    return response.json();
  }
  private updateBoard(move: Move): void {
    console.log('Succès : Mouvement accepté');

    const originSquare = this.getSquare(move.initialPosition);
    const destinationSquare = this.getSquare(move.finalPosition);


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


    this.toggleTurnAndRotateBoard();
  }


  private getSquare(position: { row: number, column: number }): Element | null {
    const positionCode = `${String.fromCharCode(97 + position.column)}${8 - position.row}`;
    return document.querySelector(`.square[data-position="${positionCode}"]`);
  }

  private handleError(error: Error): void {
    console.error('Problème lors de l opération fetch:', error);
    alert('Mouvement invalide ! Veuillez réessayer.');
    this.initialPosition = null;
    this.clearHighlights();
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



  onSurrender(player: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(`${player} a abandonné la partie.`);
        this.sendSurrenderToBackend(player);
      } else {
        console.log(`${player} a annulé l'abandon.`);
      }
    });
  }



  sendSurrenderToBackend(player: string): void {
    const url = 'http://localhost:8080/move/surrender';
    const body = { player };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

      .then(() => {
        alert(`Les ${player} ont abandonné la partie.`);
        this.router.navigate(['']);
      })
      .catch(error => {
        console.error('Problème lors de l opération fetch:', error);
        alert('Erreur lors de l\'abandon de la partie. Veuillez réessayer.');
      });
  }

  onDrawRequestChange(): void {
    if (this.whiteDrawRequest && this.blackDrawRequest) {
      this.sendDrawRequestToBackend();
    }
  }

  sendDrawRequestToBackend(): void {
    const url = 'http://localhost:8080/move/draw';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(() =>{
          alert('La partie est déclarée nulle');
          this.router.navigate(['']);
      })
      .catch(error => this.handleError(error));
  }


}
