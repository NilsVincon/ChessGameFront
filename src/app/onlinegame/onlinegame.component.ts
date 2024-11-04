import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";
import {NgClass} from "@angular/common";
import { HttpClient } from '@angular/common/http';
import { Position } from '../models/position.model'; // Importez la classe Position
import { Move } from '../models/move.model'; // Importez la classe Move

@Component({
  selector: 'app-onlinegame',
  standalone: true,
  imports: [RouterLink,NgOptimizedImage, NgClass],
  templateUrl: './onlinegame.component.html',
  styleUrl: './onlinegame.component.scss'
})
export class OnlinegameComponent {

}
