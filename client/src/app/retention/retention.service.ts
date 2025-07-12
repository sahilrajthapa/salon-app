import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRetention } from './retention.interface';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class RetentionService {
  constructor(private http: HttpClient) {}

  getReport(): Observable<IRetention[]> {
    return this.http.get<IRetention[]>(`${environment.API_URL}/retention`);
  }
}
