import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { User } from '../models/user.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // State
  private currentUserSignal = signal<User | null>(null);
  
  // Computed
  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isLoggedIn = computed(() => !!this.currentUserSignal());

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      this.currentUserSignal.set(JSON.parse(storedUser));
    }
  }

  async login(email: string, password?: string): Promise<boolean> {
    try {
      const response: any = await firstValueFrom(
        this.http.post(`${this.apiUrl}/login`, { email, password })
      );
      
      if (response.access_token && response.user) {
        this.handleAuthSuccess(response);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error logging in:', error);
      return false;
    }
  }

  async register(name: string, email: string, password?: string): Promise<boolean> {
    try {
      const response: any = await firstValueFrom(
        this.http.post(`${this.apiUrl}/register`, { name, email, password })
      );
      
      if (response.access_token && response.user) {
        this.handleAuthSuccess(response);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error registering:', error);
      return false;
    }
  }

  private handleAuthSuccess(response: any) {
    const user: User = {
      id: response.user.id,
      email: response.user.email,
      name: response.user.name,
      avatarUrl: response.user.avatarUrl,
      createdAt: new Date(response.user.createdAt)
    };
    
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSignal.set(user);
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSignal.set(null);
    this.router.navigate(['/']);
  }

  async loginWithGoogle(): Promise<boolean> {
    console.warn('Google login not implemented');
    return false;
  }

  async loginWithApple(): Promise<boolean> {
    console.warn('Apple login not implemented');
    return false;
  }

  updateProfile(data: Partial<User>): void {
    // Implement update profile logic if needed
    console.warn('Update profile not implemented yet');
  }
}
