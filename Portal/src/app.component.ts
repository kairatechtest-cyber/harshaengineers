
import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthService } from './services/auth.service';
import { User } from './models/user.model';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, LoginComponent, SignupComponent, ForgotPasswordComponent, DashboardComponent, LoadingIndicatorComponent],
})
export class AppComponent {
  private authService = inject(AuthService);
  
  authViewState = signal<'login' | 'signup' | 'forgot-password'>('login');
  
  loggedInUser = this.authService.loggedInUser;
  
  isLoggedIn = computed(() => !!this.loggedInUser());

  onSwitchToSignup(): void {
    this.authViewState.set('signup');
  }

  onSwitchToLogin(): void {
    this.authViewState.set('login');
  }

  onSwitchToForgotPassword(): void {
    this.authViewState.set('forgot-password');
  }

  onLoginSuccess(user: User): void {
    this.authService.loggedInUser.set(user);
  }

  onLogout(): void {
    this.authService.logout();
    this.authViewState.set('login');
  }
}
