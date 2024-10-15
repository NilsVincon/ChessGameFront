import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {RouterLink,Router} from '@angular/router';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  passwordVisible: boolean = false;

  constructor(private router: Router, private _http: HttpClient) {}

  login() {
    this._http.post<{ jwt: string }>('http://localhost:8080/api/auth/login', { username: "Harry", password: "Covert" })
      .subscribe({
        next: (response) => {
          console.log('Connexion réussie !', response);
          localStorage.setItem('jwtToken', response.jwt);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.log('Identifiants invalides', error);
        },
        complete: () => {
          console.log('Requête terminée');
        }
      });
  }





  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
