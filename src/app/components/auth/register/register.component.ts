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
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  name = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  error = signal('');

  async onSubmit(): Promise<void> {
    if (this.password() !== this.confirmPassword()) {
      this.error.set('Passwords do not match');
      return;
    }

    const success = await this.authService.register(this.name(), this.email(), this.password());
    if (success) {
      this.router.navigate(['/map']);
    } else {
      this.error.set('Email already registered');
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
