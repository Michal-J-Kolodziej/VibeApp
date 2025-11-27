import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = signal('');
  password = signal(''); // Mock password for UI, not used in mock auth
  error = signal('');

  async onSubmit(): Promise<void> {
    if (!this.email()) {
      this.error.set('Please enter your email');
      return;
    }

    const success = await this.authService.login(this.email());
    if (success) {
      this.router.navigate(['/map']);
    } else {
      this.error.set('User not found. Please register first.');
    }
  }

  async onGoogleLogin(): Promise<void> {
    const success = await this.authService.loginWithGoogle();
    if (success) {
      this.router.navigate(['/map']);
    }
  }

  async onAppleLogin(): Promise<void> {
    const success = await this.authService.loginWithApple();
    if (success) {
      this.router.navigate(['/map']);
    }
  }
}
