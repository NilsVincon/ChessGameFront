import { Component } from '@angular/core';
import {RouterLink,Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, FormsModule, NgIf],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  passwordVisible: boolean = false;

  constructor(private router: Router) {}

  onSignUp() {
    if (this.username && this.email && this.password) {
      console.log('Sign Up successful!');
      this.router.navigate(['/playchess']);
    } else {
      console.log('Please fill all fields');
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
