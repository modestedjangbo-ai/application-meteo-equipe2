import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '669a7af55fbf18ef9d3e663fd9b6a59b';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(private http: HttpClient) { }

  getWeather(city: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric&lang=fr`);
  }

  getForecast(city: string): Observable<any> {
    return this.http.get(`${this.forecastUrl}?q=${city}&appid=${this.apiKey}&units=metric&lang=fr&cnt=40`);
  }
}