
import { Component, ChangeDetectionStrategy, output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  switchToLogin = output<void>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);

  isLoading = this.loadingService.isLoading;
  statusMessage = signal<string | null>(null);

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  async onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.statusMessage.set(null);
    try {
      const email = this.forgotPasswordForm.value.email!;
      await this.authService.sendPasswordResetLink(email);
      this.statusMessage.set('If an account exists for this email, a password reset link has been sent.');
      this.forgotPasswordForm.reset();
    } catch (error) {
      this.statusMessage.set('An unexpected error occurred. Please try again.');
    }
  }

  onBackToLoginClick() {
    this.switchToLogin.emit();
  }
}
