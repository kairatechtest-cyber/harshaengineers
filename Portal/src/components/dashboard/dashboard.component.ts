import { Component, signal, HostListener, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { API_CONFIG } from '../../config/api.config';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,   // ⭐ IMPORTANT
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  
  constructor(
    private auth: AuthService,
    private http: HttpClient
  ) {
    setInterval(() => this.time.set(new Date()), 1000);
  }

  time = signal(new Date());

  greeting = () => {
    const h = this.time().getHours();
    return h < 12 ? 'Good Morning ☀️' : h < 18 ? 'Good Afternoon 🌤️' : 'Good Evening 🌙';
  };

  menu = { water: false, tyre: false, mixer: false, tbm: false };

  toggle(k: keyof typeof this.menu) {
    this.menu[k] = !this.menu[k];
  }
   /* ================= WHATSAPP ================= */

  showWhatsApp = false;
  mobile = '';
  waResponse = '';

  loadWhatsApp() {
    this.showWhatsApp = true;
    this.waResponse = '';
    this.mobile = '';
  }

  sendMessage() {
    if (!this.mobile || this.mobile.length < 8) {
      this.waResponse = '❌ Please enter a valid mobile number';
      return;
    }

    this.waResponse = 'Sending message...';

    this.http.post<any>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.WHATSAPP.SEND_MESSAGE}`,
      { mobile: this.mobile }
    ).subscribe({
      next: () => {
        this.waResponse = '✔ Message sent successfully!';
      },
      error: (err) => {
        this.waResponse =
          err?.error?.message || '❌ Failed to send message';
      }
    });
  }

  /* ================= WEATHER WIDGET ================= */
  weatherExpanded = signal(false);

  @HostListener('window:message', ['$event'])
  handleWeather(e: any) {
    if (e.data?.type === 'weatherExpand') this.weatherExpanded.set(true);
    if (e.data?.type === 'weatherCollapse') this.weatherExpanded.set(false);
  }

  onLogout() {
    this.auth.logout();
  }
  
}
