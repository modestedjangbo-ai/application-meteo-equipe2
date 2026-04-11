import { Component, OnInit, signal } from '@angular/core'; // On ajoute signal
import { CommonModule } from '@angular/common';
import { WeatherService } from './services/weather'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="text-align:center; padding: 50px; font-family: Arial, sans-serif;">
      <h1 style="color: #333;">🌦️ Météo actuelle - Parakou</h1>
      <p style="font-size: 3em; font-weight: bold; color: #007bff;">{{ temperature() }}</p>
    </div>
  `,
})
export class AppComponent implements OnInit {
  // On crée un signal qui contient 'Chargement...' par défaut
  temperature = signal<string>('Chargement...');

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.weatherService.getWeather('Parakou').subscribe({
      next: (data: any) => {
        // On met à jour le signal avec .set()
        this.temperature.set(data.main.temp + '°C');
      },
      error: (err: any) => {
        this.temperature.set('Erreur de connexion');
      }
    });
  }
}
