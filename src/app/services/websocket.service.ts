import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { Subject } from 'rxjs';
import {Moveresponse} from "../models/moveresponse.model";
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: Client | null = null;
  private isConnected: boolean = false;

  private moveSubject = new Subject<any>();
  private connectionSubject = new Subject<boolean>();
  private moveResponseSubject = new Subject<any>();

  constructor() {}

  // Connexion au serveur STOMP via WebSocket
  connect(url: string,gameId:string): void {
    if (!this.isConnected) {
      this.stompClient = new Client({
        brokerURL: url,
        connectHeaders: {
          // Si nécessaire, tu peux ajouter des headers ici
        },
        onConnect: () => {
          this.isConnected = true;
          this.connectionSubject.next(true);
          console.log('Connected to WebSocket server');
          // S'abonner à un canal STOMP
          this.stompClient?.subscribe(`/topic/game-progress/${gameId}`, (message: IMessage) => {
            this.handleMoveMessage(message);
          });
        },
        onDisconnect: () => {
          this.isConnected = false;
          this.connectionSubject.next(false);
          console.log('Disconnected from WebSocket server');
        },
        onStompError: (frame) => {
          console.error('STOMP error', frame);
        }
      });

      this.stompClient.activate(); // Active la connexion STOMP
    }
  }

  // Envoie un mouvement au serveur STOMP
  sendMove(move: any, gameId: string|null): void {
    if (this.stompClient && this.isConnected) {
      this.stompClient.publish({ destination: `/app/move/${gameId}`, body: JSON.stringify(move) });
    } else {
      console.error('WebSocket is not connected');
    }
  }

  // Déconnexion du serveur STOMP
  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.isConnected = false;
      console.log('WebSocket connection closed');
    }
  }

  // Retourne l'observable pour les mouvements
  onMove() {
    console.log("onMoveResponse");
    return this.moveSubject.asObservable();
  }
  onMoveResponse() {
    return this.moveResponseSubject.asObservable();
  }

  // Retourne l'observable pour l'état de la connexion
  onConnectionStatus() {
    return this.connectionSubject.asObservable();
  }

  // Traite le message de mouvement reçu
  private handleMoveMessage(message: IMessage): void {
    const moveResponse: Moveresponse = JSON.parse(message.body);
    console.log('Checkmate :', moveResponse.checkmate);
    if (moveResponse.checkmate) {
      console.log('Checkmate');
      alert("Checkmate");
    }
    this.moveSubject.next(moveResponse.move);
  }
}
