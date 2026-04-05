import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  // REST Countries API (Requests specific fields to prevent 400 errors)
  private countryUrl = 'https://restcountries.com/v3.1/all?fields=name,flags,region,capital,population,subregion';
  
  private weatherUrl = 'https://api.weatherapi.com/v1/current.json';
  
  private apiKey = 'fbe2e3e27140420bad252613260204';

  constructor(private http: HttpClient) {}

  getCountries(): Observable<any[]> {
    return this.http.get<any[]>(this.countryUrl).pipe(
      catchError(this.handleError)
    );
  }

  getWeather(city: string): Observable<any> {
   
    const timestamp = new Date().getTime();
    const url = `${this.weatherUrl}?key=${this.apiKey}&q=${city}&t=${timestamp}`;
    
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('API Error details:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}