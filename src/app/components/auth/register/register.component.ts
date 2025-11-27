import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  name = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  error = signal('');
  loading = signal(false);

  async onSubmit(): Promise<void> {
    if (this.password() !== this.confirmPassword()) {
      this.error.set('Passwords do not match');
      this.notificationService.showError('Passwords do not match');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      const success = await this.authService.register(this.name(), this.email(), this.password());
      if (success) {
        this.notificationService.showSuccess('Registration successful!');
        this.router.navigate(['/map']);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      this.error.set(errorMessage);
      this.notificationService.showError(errorMessage);
    } finally {
      this.loading.set(false);
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
