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
  public activePlayer: String = "white";

  constructor() {}


  connect(url: string,gameId:string): void {
    if (!this.isConnected) {
      this.stompClient = new Client({
        brokerURL: url,
        connectHeaders: {

        },
        onConnect: () => {
          this.isConnected = true;
          this.connectionSubject.next(true);
          console.log('Connected to WebSocket server');
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

      this.stompClient.activate();
    }
  }

  sendMove(move: any, gameId: string|null): void {
    if (this.stompClient && this.isConnected) {
      this.stompClient.publish({ destination: `/app/move/${gameId}`, body: JSON.stringify(move) });
    } else {
      console.error('WebSocket is not connected');
    }
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.isConnected = false;
      console.log('WebSocket connection closed');
    }
  }

  onMove() {
    console.log("onMoveResponse");
    return this.moveSubject.asObservable();
  }
  onMoveResponse() {
    return this.moveResponseSubject.asObservable();
  }

  onConnectionStatus() {
    return this.connectionSubject.asObservable();
  }

  private handleMoveMessage(message: IMessage): void {
    const moveResponse: Moveresponse = JSON.parse(message.body);
    this.activePlayer = moveResponse.activePlayer;
    console.log('Active player dans wsService :', this.activePlayer);
    console.log('Checkmate :', moveResponse.checkmate);
    if (moveResponse.checkmate) {
      console.log('Checkmate');
      alert("Checkmate");
      //TODO STOP LA PARTIE
    }
    this.moveSubject.next(moveResponse.move);
  }
}
