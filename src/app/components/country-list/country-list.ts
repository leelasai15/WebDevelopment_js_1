// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-country-list',
//   imports: [],
//   templateUrl: './country-list.html',
//   styleUrl: './country-list.css',
// })
// export class CountryList {}
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data';

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="search-container">
      <input type="text" [(ngModel)]="searchTerm" (input)="filterCountries()" placeholder="Search for a country...">
    </div>

    <div *ngIf="isLoading" class="status-message">Loading countries...</div>
    <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>

    <div class="grid" *ngIf="!isLoading && !errorMessage">
      <div *ngFor="let country of filteredCountries" class="card" [routerLink]="['/country', country.name.common]">
        <img [src]="country.flags.png" [alt]="'Flag of ' + country.name.common">
        <div class="card-content">
          <h3>{{ country.name.common }}</h3>
          <p><strong>Region:</strong> {{ country.region }}</p>
          <p><strong>Capital:</strong> {{ country.capital ? country.capital[0] : 'N/A' }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-container { margin-bottom: 40px; text-align: center; }
    
    /* Modern Search Bar */
    input { 
      padding: 16px 24px; 
      width: 100%; 
      max-width: 500px; 
      font-size: 16px; 
      border-radius: 50px; 
      border: none; 
      box-shadow: 0 4px 15px rgba(0,0,0,0.06); 
      transition: all 0.3s ease; 
      outline: none; 
      font-family: inherit;
    }
    input:focus { box-shadow: 0 6px 20px rgba(0,0,0,0.12); transform: translateY(-2px); }
    
    /* Smooth Grid & Floating Cards */
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 30px; }
    .card { 
      background: white; 
      border-radius: 16px; 
      overflow: hidden; 
      cursor: pointer; 
      transition: all 0.3s ease; 
      box-shadow: 0 4px 6px rgba(0,0,0,0.04); 
      border: 1px solid rgba(0,0,0,0.02);
    }
    .card:hover { transform: translateY(-8px); box-shadow: 0 15px 25px rgba(0,0,0,0.1); }
    
    /* Image & Typography */
    .card img { width: 100%; height: 160px; object-fit: cover; border-bottom: 1px solid #f0f0f0; }
    .card-content { padding: 20px; }
    .card-content h3 { margin: 0 0 8px 0; font-size: 1.25rem; font-weight: 700; color: #1a202c; }
    .card-content p { margin: 4px 0; font-size: 0.95rem; color: #718096; }
    
    .status-message { text-align: center; font-size: 1.2rem; color: #718096; margin-top: 50px; }
    .error-message { text-align: center; color: #e53e3e; font-weight: 600; padding: 20px; }
  `]
})
export class CountryListComponent implements OnInit {
  countries: any[] = [];
  filteredCountries: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef // Forces Angular to update the screen
  ) {}

  ngOnInit() {
    this.dataService.getCountries().subscribe({
      next: (data) => {
        // Sort countries alphabetically
        this.countries = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        this.filteredCountries = this.countries;
        this.isLoading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        this.errorMessage = 'Failed to load countries. Please check your connection.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterCountries() {
    this.filteredCountries = this.countries.filter(c =>
      c.name.common.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}