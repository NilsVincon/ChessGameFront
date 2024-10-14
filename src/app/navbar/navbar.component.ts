import {Component, Input} from '@angular/core';
import {NgOptimizedImage, TitleCasePipe} from "@angular/common";
import {RouterLink} from "@angular/router";



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgOptimizedImage, TitleCasePipe, RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input({required : true}) title!:string
}
