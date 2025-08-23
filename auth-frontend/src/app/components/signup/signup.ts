import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
signupData= {email: '', password: ''};
successMessage: string = '';
errorMessage: string = '';
constructor(private authService: Auth){}
onSignup() {
  this.successMessage= '';
  this.errorMessage = '';

  const {email, password} = this.signupData;
  this.authService.signUp(email, password).subscribe({
    next: (response) => {
      this.successMessage = 'Signup successful, you can now login.';
    
    this.signupData = {email: '', password: ''}
    },
    error: (err) => {
      this.errorMessage = err.errors?.message || 'Signup failed, please try again.';
    }
  });
}
}
