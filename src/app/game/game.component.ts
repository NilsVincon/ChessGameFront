import { Component, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Position } from '../models/position.model'; // Importez la classe Position
import { Move } from '../models/move.model'; // Importez la classe Move

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    RouterLink,
    NgOptimizedImage
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit {

  private initialPosition: Position | null = null; // Pour stocker la position initiale

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
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
            this.initialPosition = posObject; // Définir la position initiale
          } else {
            const move = new Move(this.initialPosition, posObject); // Créer un nouvel objet Move
            console.log('Objet Move:', move);
            this.sendMoveToBackend(move); // Envoyer l'objet Move
            this.initialPosition = null; // Réinitialiser la position initiale
          }
        }
      });
    });
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
    }; // Créez l'objet à envoyer

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(errorData.message || 'Erreur lors de la requête');
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        // Sélectionner la case d'origine et de destination
        const originSquare = document.querySelector(`.square[data-position="${String.fromCharCode(97 + move.initialPosition.column)}${8 - move.initialPosition.row}"]`);
        const destinationSquare = document.querySelector(`.square[data-position="${String.fromCharCode(97 + move.finalPosition.column)}${8 - move.finalPosition.row}"]`);

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
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        alert('Mouvement invalide ! Veuillez réessayer.'); // Afficher un message d'erreur
        this.initialPosition = null; // Réinitialiser la position initiale pour permettre un nouveau mouvement
      });
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

}
