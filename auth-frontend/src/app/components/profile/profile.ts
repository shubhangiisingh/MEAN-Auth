import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements  OnInit {
userData : any = null;
errorMessage = '';
constructor(private http: HttpClient, private authService: Auth){};
ngOnInit(): void {
  this.http.get(environment.apiUrl + '/api/profile').subscribe({
    next: (response:any) => {
      this.userData = response.user;
    },
    error: (err:any) => {
      console.error('Error fetching profile', err);
      this.errorMessage = err.errors?.message || 'Could not load profile data.';
    }
  });
}
  onLogout(){
      this.authService.logout();
  }

}
