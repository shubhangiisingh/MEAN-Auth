import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
loginData = {email: '', password: ''};
errorMessage: string = '';
constructor(private authService: Auth, private router: Router){}


onLogin(){
  this.errorMessage = '';
  this.authService.login(this.loginData.email, this.loginData.password)
  .subscribe({
    next: (response) => {
     const token = response.token;
     localStorage.setItem('token', token);
    this.router.navigate(['/profile']); 
    },
    error: (err) => {
      this.errorMessage = err.errors?.message || 'Login failed, please try again.';
    }
  });
}
}
