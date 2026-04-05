import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data';

@Component({
  selector: 'app-country-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a routerLink="/" class="back-btn">⬅ Back to List</a>

    <div *ngIf="isLoading" class="status-message">Loading details...</div>

    <div *ngIf="country" class="detail-container">
      
      <div class="country-info card-panel">
        <h2>{{ country.name.common }}</h2>
        <img [src]="country.flags.png" [alt]="'Flag of ' + country.name.common" class="detail-flag">
        <div class="info-grid">
          <p><strong>Official Name:</strong><br>{{ country.name.official }}</p>
          <p><strong>Population:</strong><br>{{ country.population | number }}</p>
          <p><strong>Region:</strong><br>{{ country.region }}</p>
          <p><strong>Subregion:</strong><br>{{ country.subregion }}</p>
          <p><strong>Capital:</strong><br>{{ country.capital ? country.capital[0] : 'N/A' }}</p>
        </div>
      </div>

      <div class="weather-info card-panel" *ngIf="country.capital">
        <h3>Current Weather in {{ country.capital[0] }}</h3>
        
        <div *ngIf="weatherError" class="error-message">{{ weatherError }}</div>
        
        <div *ngIf="weather" class="weather-card">
          <img [src]="weather.current.condition.icon" alt="Weather icon" class="weather-icon">
          <p class="temp">{{ weather.current.temp_c }}<span class="celsius">°C</span></p>
          <p class="condition">{{ weather.current.condition.text }}</p>
          
          <div class="weather-stats">
            <p><strong>Feels like:</strong> {{ weather.current.feelslike_c }}°C</p>
            <p><strong>Humidity:</strong> {{ weather.current.humidity }}%</p>
            <p><strong>Wind:</strong> {{ weather.current.wind_kph }} km/h</p>
          </div>
        </div>
      </div>
      
    </div>
  `,
  styles: [`
    /* Clean Back Button */
    .back-btn { 
      display: inline-block; margin-bottom: 30px; text-decoration: none; 
      color: #4a5568; font-weight: 600; background: white; padding: 12px 24px; 
      border-radius: 50px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: all 0.2s; 
    }
    .back-btn:hover { background: #edf2f7; transform: translateX(-5px); color: #1a202c; }
    
    /* Layout */
    .detail-container { display: flex; gap: 30px; flex-wrap: wrap; align-items: stretch; }
    .card-panel { 
      flex: 1; min-width: 320px; background: white; padding: 30px; 
      border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.03); 
    }
    
    /* Country Info */
    .country-info h2 { margin-top: 0; color: #1a202c; font-size: 2.2rem; font-weight: 700; }
    .detail-flag { width: 100%; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 4px 10px rgba(0,0,0,0.08); }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .info-grid p { margin: 0; color: #4a5568; font-size: 1.05rem; }
    .info-grid strong { color: #1a202c; display: block; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    
    /* Weather Info */
    .weather-info { background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%); }
    .weather-info h3 { margin-top: 0; color: #1a202c; font-size: 1.4rem; text-align: center; font-weight: 600; }
    .weather-card { text-align: center; padding: 20px 0; }
    .weather-icon { width: 90px; height: 90px; filter: drop-shadow(0 8px 10px rgba(0,0,0,0.1)); margin-bottom: -10px; }
    .temp { font-size: 5rem; font-weight: 700; margin: 0; color: #2b6cb0; line-height: 1; letter-spacing: -2px; }
    .celsius { font-size: 2.5rem; font-weight: 400; vertical-align: top; color: #4299e1; }
    .condition { font-size: 1.3rem; color: #4a5568; margin: 15px 0 30px 0; font-weight: 600; }
    
    /* Weather Stats Footer */
    .weather-stats { 
      display: flex; justify-content: space-around; background: white; 
      padding: 20px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.04); 
    }
    .weather-stats p { margin: 0; color: #718096; font-size: 0.95rem; }
    .weather-stats strong { display: block; color: #2d3748; font-size: 1.1rem; margin-top: 5px; }
    
    .status-message { text-align: center; font-size: 1.2rem; color: #718096; padding: 50px; }
    .error-message { color: #e53e3e; font-weight: 600; text-align: center; padding: 20px; }
  `]
})
export class CountryDetailComponent implements OnInit {
  country: any;
  weather: any;
  isLoading: boolean = true;
  weatherError: string = '';

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');
    
    this.dataService.getCountries().subscribe({
      next: (list) => {
        this.country = list.find(c => c.name.common === name);
        this.isLoading = false;
        this.cdr.detectChanges(); // Erase "Loading details..."

        if (this.country && this.country.capital) {
          this.dataService.getWeather(this.country.capital[0]).subscribe({
            next: (w) => {
              this.weather = w;
              this.cdr.detectChanges(); // Draw the weather card
            },
            error: (err) => {
              console.error('Weather error:', err);
              this.weatherError = 'Could not load current weather data.';
              this.cdr.detectChanges();
            }
          });
        }
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}