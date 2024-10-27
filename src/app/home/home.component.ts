import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private router: Router, private _http: HttpClient) {}

  testRequest() {
    this._http.get('http://localhost:8080/api/protected')
      .subscribe({
        next: (response) => {
          console.log('Réponse de l\'API avec JWT :', response);
          if (response){
            this.router.navigate(['/new-game'])
          }
        },
        error: (error) => {
          console.log('Vous devez etre connecte pour acceder a cette ressource');
          if (error) {
            this.router.navigate(['/login']);
          }
        }
      });
  }

}
