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
  errorMessage: string = '';

  constructor(private router: Router, private _http: HttpClient) {}

  login() {
    this.errorMessage = '';
    this._http.post<{ jwt: string }>('http://localhost:8080/api/auth/login', { username: this.username, password: this.password })
      .subscribe({
        next: (response) => {
          console.log('Connexion réussie !', response);
          localStorage.setItem('jwtToken', response.jwt);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.errorMessage = 'Identifiant ou mot de passe incorrect';
        }
      });
  }





  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
