import {Component, Input} from '@angular/core';
import {NgOptimizedImage, TitleCasePipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {CommonModule} from "@angular/common";



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgOptimizedImage, TitleCasePipe, RouterLink,CommonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input({required : true}) title!:string

  username: string | null = null;

  constructor(private authService: AuthService) {
    this.username = this.authService.getUsernameFromToken();
  }
}
