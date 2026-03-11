import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { LoadingService } from './loading.service';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private loadingService = inject(LoadingService);

  private API = `${API_CONFIG.BASE_URL}/api/auth`;

  private allowedDomains = [
    'honda.com',
    'gmail.com',
    'wipro.com',
    "harshaengineers.com",
    'kaira-technologies.com'
  ];


  loggedInUser = signal<User | null>(null);

  isCorporateEmail(email: string): boolean {
    if (!email || !email.includes('@')) {
      return false;
    }
    const domain = email.split('@')[1];
    return this.allowedDomains.includes(domain.toLowerCase());
  }

  // ================= SIGNUP =================
  async signup(userData: any): Promise<void> {
    this.loadingService.show();

    if (!this.isCorporateEmail(userData.email)) {
      this.loadingService.hide();
      throw new Error('This email domain is not authorized');
    }

    try {
      await this.http.post(`${this.API}/signup`, userData).toPromise();
    } catch (err: any) {
      throw new Error(err.error?.message || 'Signup failed');
    } finally {
      this.loadingService.hide();
    }
  }

  // ================= LOGIN =================
  async login(email: string, password: string): Promise<User> {
    this.loadingService.show();

    try {
      const res: any = await this.http
        .post(`${this.API}/login`, { email, password })
        .toPromise();

      localStorage.setItem('token', res.token);
      this.loggedInUser.set(res.user);

      return res.user;
    } catch (err: any) {
      throw new Error(err.error?.message || 'Invalid credentials');
    } finally {
      this.loadingService.hide();
    }
  }

  logout(): void {
    localStorage.clear();
    this.loggedInUser.set(null);
    window.location.href = '/';
  }
  async sendPasswordResetLink(email: string): Promise<void> {
    this.loadingService.show();
    // console.log(`Sending password reset link to: ${email}`);
    try {
      // await new Promise<void>((resolve) => {
      //   // Simulate API call
      //   setTimeout(() => {
      //     console.log('Password reset link sent (simulated).');
      //     resolve();
      //   }, 1000);
      // });
      await this.http.post(`${this.API}/forgot-password`, { email }).toPromise();
    } finally {
      this.loadingService.hide();
    }
  }
}