import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {RouterLink,Router} from '@angular/router';

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
  email: string = '';
  password: string = '';
  passwordVisible: boolean = false;
  /*
  signupEmail: string = '';
  signupPassword: string = '';
  showSignup: boolean = false;
   */


  constructor(private router: Router) {}

  onLogin() {
    if (this.email === 'test@example.com' && this.password === 'password') {
      console.log('Login successful!');
      this.router.navigate(['/playchess']);
    } else {
      console.log('Invalid credentials');
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
