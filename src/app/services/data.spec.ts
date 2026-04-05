// import { TestBed } from '@angular/core/testing';

// import { Data } from './data';

// describe('Data', () => {
//   let service: Data;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(Data);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  private countryUrl = 'https://restcountries.com/v3.1/all';
  private weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
  // ⚠️ Replace this with your actual OpenWeather API key
  private apiKey = 'YOUR_OPENWEATHER_API_KEY';

  constructor(private http: HttpClient) {}

  getCountries(): Observable<any[]> {
    return this.http.get<any[]>(this.countryUrl).pipe(
      catchError(this.handleError)
    );
  }

  getWeather(city: string): Observable<any> {
    const url = `${this.weatherUrl}?q=${city}&appid=${this.apiKey}&units=metric`;
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => new Error('Something went wrong fetching data.'));
  }
}