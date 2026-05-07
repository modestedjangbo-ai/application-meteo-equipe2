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
  erreurVille = signal('');
  
  // On ajoute cette variable pour stocker toutes les données météo (vent, humidité, etc.)
  weatherData: any = null;
  forecastData: any[] = [];
  sunrise: string = '';
  sunset: string = '';

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    // Ville par défaut au lancement
    this.lancerRecherche('Cotonou');
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
      this.weatherData = data;// Stocke les données complètes
      this.temperature.set(data.main.temp + '°C');// Met à jour le signal température
      this.erreurVille.set('');// Efface l'erreur

      // Lever et coucher du soleil
      this.sunrise = this.formatTime(data.sys.sunrise);
      this.sunset = this.formatTime(data.sys.sunset);

      // Prévisions 5 jours
      this.weatherService.getForecast(ville).subscribe({
        next: (forecast: any) => {
          // On prend 1 prévision par jour (toutes les 24h = index 0,8,16,24,32)
          this.forecastData = forecast.list.filter((_: any, i: number) => i % 8 === 0).slice(0, 5);
        }
      });
    },
    error: (err: any) => {
      console.error(err);
      this.temperature.set('');
      this.weatherData = null;
      this.forecastData = [];
      this.erreurVille.set('Ville introuvable. Veuillez vérifier le nom.');
    }
  });
}
arrondir(val: number): number {
  return Math.round(val);
}
getJour(dtTxt: string): string {
  const jours = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const date = new Date(dtTxt);
  return jours[date.getDay()];
}
// Convertir timestamp en heure lisible
formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

  getWeatherIcon() {
    if (!this.weatherData || !this.weatherData.weather) return 'bi-cloud';
    
    // On récupère le "main" (ex: "Clear", "Clouds", "Rain")
    const condition = this.weatherData.weather[0].main;

    switch (condition) {
      case 'Clear': return 'bi-sun-fill text-warning';
      case 'Clouds': return 'bi-cloud-fill text-light';
      case 'Rain': return 'bi-cloud-rain-fill text-info';
      case 'Drizzle': return 'bi-cloud-drizzle-fill text-info';
      case 'Thunderstorm': return 'bi-cloud-lightning-fill text-warning';
      case 'Snow': return 'bi-snow text-white';
      default: return 'bi-cloud';
    }
  }
  getIconFromForecast(day: any): string {
  if (!day?.weather) return 'bi bi-cloud';
  const condition = day.weather[0].main;
  switch (condition) {
    case 'Clear': return 'bi bi-sun-fill text-warning';
    case 'Clouds': return 'bi bi-cloud-fill text-light';
    case 'Rain': return 'bi bi-cloud-rain-fill text-info';
    case 'Drizzle': return 'bi bi-cloud-drizzle-fill text-info';
    case 'Thunderstorm': return 'bi bi-cloud-lightning-fill text-warning';
    case 'Snow': return 'bi bi-snow text-white';
    default: return 'bi bi-cloud';
  }
}
  }