import { Component, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {NgClass, NgOptimizedImage} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Position } from '../models/position.model'; // Importez la classe Position
import { Move } from '../models/move.model'; // Importez la classe Move

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    RouterLink,
    NgOptimizedImage,
    NgClass
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit {

  private initialPosition: Position | null = null; // Pour stocker la position initiale
  isPlayerOneTurn: boolean = true;
  private whiteTime: number = 600;
  private blackTime: number = 600;
  private activePlayer: 'white' | 'black' = 'white';
  private timerInterval: any;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.startTimer();
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
            const move = new Move(this.initialPosition, posObject); // Créer un nouvel objet Move
            console.log('Objet Move:', move);
            this.sendMoveToBackend(move); // Envoyer l'objet Move
            this.initialPosition = null; // Réinitialiser la position initiale
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
    this.activePlayer = this.activePlayer === 'white' ? 'black' : 'white'; // Change le joueur actif
    clearInterval(this.timerInterval); // Arrêtez le minuteur actuel
    this.startTimer(); // Démarre le minuteur pour le nouveau joueur
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
    const url = 'http://localhost:8080/move'; // Remplacez par l'URL de votre backend
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

    // Efface les surlignages actuels
    this.clearHighlights();

    // Déplace la pièce de la case d'origine vers la case de destination
    if (originSquare && destinationSquare) {
      const piece = originSquare.querySelector('img');

      // Supprime toute pièce existante sur la case de destination (en cas de prise)
      const existingPiece = destinationSquare.querySelector('img');
      if (existingPiece) {
        existingPiece.remove();
      }

      // Place la pièce sur la case de destination
      if (piece) {
        destinationSquare.appendChild(piece);
      }

      // Surligne les cases d'origine et de destination
      this.highlightSquare(originSquare as HTMLElement);
      this.highlightSquare(destinationSquare as HTMLElement);
    }

    // Alterne le tour et, si nécessaire, fait pivoter l'échiquier
    this.toggleTurnAndRotateBoard();
  }

// Sélectionne une case sur l'échiquier en fonction des coordonnées
  private getSquare(position: { row: number, column: number }): Element | null {
    const positionCode = `${String.fromCharCode(97 + position.column)}${8 - position.row}`;
    return document.querySelector(`.square[data-position="${positionCode}"]`);
  }

// Gère les erreurs d'envoi et affiche un message d'alerte
  private handleError(error: Error): void {
    console.error('Problème lors de l opération fetch:', error);
    alert('Mouvement invalide ! Veuillez réessayer.');
    this.initialPosition = null;
    this.clearHighlights();
  }


  convertToPosition(moov: string): Position {
    // Convertit le premier caractère de la chaîne 'moov' en un nombre de 0 à 7 pour les colonnes
    const column = moov.charCodeAt(0) - 'a'.charCodeAt(0); // Convert 'a' to 'h' to 0 to 7

    // Convertit le deuxième caractère de la chaîne 'moov' en un nombre de 0 à 7 pour les lignes, mais inversé
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
