
import { Component, ChangeDetectionStrategy, output, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  switchToSignup = output<void>();
  switchToForgotPassword = output<void>();
  loginSuccess = output<User>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  
  isLoading = this.loadingService.isLoading;
  loginStatus = signal<{ message: string; isError: boolean } | null>(null);
  passwordVisible = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  togglePasswordVisibility() {
    this.passwordVisible.update(value => !value);
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loginStatus.set(null);
    try {
      const { email, password } = this.loginForm.value;
      const user = await this.authService.login(email!, password!);
      this.loginStatus.set({ message: 'Login successful! Redirecting...', isError: false });
      this.loginSuccess.emit(user);
    } catch (error: any) {
      this.loginStatus.set({ message: error.message, isError: true });
    }
  }

  onSignupClick() {
    this.switchToSignup.emit();
  }

  onForgotPasswordClick() {
    this.switchToForgotPassword.emit();
  }
}
