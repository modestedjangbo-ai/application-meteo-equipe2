import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from './services/weather'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html', // On pointe vers ton fichier HTML externe
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  // Définition des signaux
  temperature = signal<string>('Chargement...');
  villeRecherchee = signal<string>('');
  
  // On ajoute cette variable pour stocker toutes les données météo (vent, humidité, etc.)
  weatherData: any;

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    // Ville par défaut au lancement
    this.lancerRecherche('');
  }

  // La fonction pour ton bouton ou ton initialisation
  chercherMeteo() {
    const ville = this.villeRecherchee();
    if (ville) {
      this.lancerRecherche(ville);
    }
  }

  // Fonction réutilisable pour appeler l'API
  lancerRecherche(ville: string) {
    this.weatherService.getWeather(ville).subscribe({
      next: (data: any) => {
        this.weatherData = data; // Stocke les données complètes
        this.temperature.set(data.main.temp + '°C'); // Met à jour le signal température
      },
      error: (err: any) => {
        console.error(err);
        this.temperature.set('');
      }
    });
  }
}