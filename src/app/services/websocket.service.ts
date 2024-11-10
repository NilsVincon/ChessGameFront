import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: any;
  private isConnected: boolean = false;

  constructor() { }

  connect() {
    const socket = new SockJS('http://localhost:8080/ws'); // Remplacez l'URL si nécessaire
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      this.isConnected = true;
      console.log('Connected to WebSocket');

      // Abonnez-vous au topic pour recevoir les messages
      this.stompClient.subscribe('/topic/game-progress', (message: any) => {
        console.log('Received:', JSON.parse(message.body));
      });
    }, (error: any) => {
      console.error('WebSocket error:', error);
      this.isConnected = false;
    });
  }

  sendMove(move: any) {
    if (this.isConnected) {
      this.stompClient.subscribe(`/topic/game-progress/${move.gameId}`, (message: any) => {
        console.log('Received message for game', move.gameId, ':', JSON.parse(message.body));
      });
    } else {
      console.error('WebSocket is not connected.');
    }
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        console.log('Disconnected from WebSocket');
        this.isConnected = false;
      });
    }
  }
}
