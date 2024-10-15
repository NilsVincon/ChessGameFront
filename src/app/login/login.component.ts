import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {AuthService} from '../services/auth.service';
import {RouterLink, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf, RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  passwordVisible: boolean = false;
  errorMessage = '';


  constructor(private authService: AuthService, private router: Router) {
  }

  login(): void {
    const credentials = {username: this.username, password: this.password};

    this.authService.login(credentials).subscribe({
      next: (response) => {
        const token = response.token; // Le token est supposé être dans la réponse
        if (token) {
          this.authService.setToken(token);  // Stocker le token dans le localStorage
          this.router.navigate(['/dashboard']);  // Rediriger après connexion
        }
      },
      error: (err) => {
        this.errorMessage = 'Login failed. Please check your credentials.';
      }
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
