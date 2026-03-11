import { Injectable, inject } from '@angular/core';
import { LoadingService } from './loading.service';

export interface WeatherData {
  location: string;
  temp: number;
  condition: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private loadingService = inject(LoadingService);
  // In a real-world application, this key should be stored securely
  // in an environment variable and not be exposed in the client-side code.
  private readonly apiKey = '63586511f13147bbab964352251311';
  private readonly apiUrl = 'https://api.weatherapi.com/v1/current.json';

  async getWeatherForLocation(location: string, showLoading = true): Promise<WeatherData | null> {
    if (showLoading) this.loadingService.show();
    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}&q=${location}&aqi=no`);
      if (!response.ok) {
        console.error('Weather API request failed with status:', response.status);
        return null;
      }
      const data = await response.json();
      if (data && data.current && data.location) {
        return {
          location: data.location.name,
          temp: data.current.temp_c,
          condition: data.current.condition.text,
          icon: `https:${data.current.condition.icon}` // Ensure protocol is present
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      return null;
    } finally {
      if (showLoading) this.loadingService.hide();
    }
  }
}
