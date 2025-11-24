import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  
  // State
  private currentUserSignal = signal<User | null>(null);
  
  // Computed
  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isLoggedIn = computed(() => !!this.currentUserSignal());

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          this.currentUserSignal.set(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse user from storage', e);
          localStorage.removeItem('currentUser');
        }
      }
    }
  }

  login(email: string): boolean {
    // Mock login - in a real app this would validate against a backend
    // For this demo, we'll simulate a successful login if email is provided
    if (!email) return false;

    // Check if user exists in "database" (localStorage)
    const users = this.getUsers();
    const user = users.find(u => u.email === email);

    if (user) {
      this.setCurrentUser(user);
      return true;
    }
    return false;
  }

  register(name: string, email: string): boolean {
    const users = this.getUsers();
    
    if (users.some(u => u.email === email)) {
      return false; // User already exists
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      createdAt: new Date(),
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=059669&color=fff`
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser);
    return true;
  }

  async loginWithGoogle(): Promise<boolean> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: 'google-user-' + crypto.randomUUID(),
      name: 'Google User',
      email: 'user@gmail.com',
      avatarUrl: 'https://lh3.googleusercontent.com/a/default-user=s96-c', // Generic Google-like avatar
      createdAt: new Date()
    };
    
    this.setCurrentUser(mockUser);
    return true;
  }

  async loginWithApple(): Promise<boolean> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: 'apple-user-' + crypto.randomUUID(),
      name: 'Apple User',
      email: 'user@icloud.com',
      avatarUrl: 'https://ui-avatars.com/api/?name=Apple+User&background=000&color=fff',
      createdAt: new Date()
    };
    
    this.setCurrentUser(mockUser);
    return true;
  }

  logout(): void {
    this.currentUserSignal.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.router.navigate(['/']);
  }

  updateProfile(data: Partial<User>): void {
    const currentUser = this.currentUserSignal();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...data };
      this.setCurrentUser(updatedUser);
      
      // Update in "database"
      const users = this.getUsers();
      const index = users.findIndex(u => u.id === currentUser.id);
      if (index !== -1) {
        users[index] = updatedUser;
        this.saveUsers(users);
      }
    }
  }

  private setCurrentUser(user: User): void {
    this.currentUserSignal.set(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  private getUsers(): User[] {
    if (isPlatformBrowser(this.platformId)) {
      const users = localStorage.getItem('users');
      return users ? JSON.parse(users) : [];
    }
    return [];
  }

  private saveUsers(users: User[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }
}
