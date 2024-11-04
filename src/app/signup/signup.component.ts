import { Component } from '@angular/core';
import {RouterLink,Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, FormsModule, NgIf],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  username: string = '';
  password: string = '';
  password2: string = '';
  passwordVisible: boolean = false;
  passwordVisible2: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router,private _http: HttpClient) {}

  onSignUp() {
    this.errorMessage = '';
    if (this.username && this.password && this.password2) {
      if (this.password !== this.password2) {
        this.errorMessage = 'Les mots de passe ne correspondent pas.';
        return;
      }
      if (localStorage.getItem('jwtToken')!==null){
        localStorage.removeItem('jwtToken');
      }
      this._http.post('http://localhost:8080/api/auth/signup', { username: this.username, password: this.password })
        .subscribe({
          next: (response) => {
            console.log('Inscription réussie !', response);
            this.router.navigate(['/login']);
          },
          error: (error) => {
            if (error.status === 409) {
              this.errorMessage = error.error.message.toString();
            } else {
              this.errorMessage = "Erreur inattendue: " + error.message;
            }
            console.log('Erreur lors de l\'inscription:', this.errorMessage);
          },
          complete: () => {
            console.log('Requête terminée');
          }
        });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs.';
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  togglePasswordVisibility2() {
    this.passwordVisible2 = !this.passwordVisible2;
  }
}
