
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    email: string;
  };
}

export interface ListItem {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  constructor(private http: HttpClient) {}

  /**
   * POST /api/login
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/login', credentials);
  }

  /**
   * GET /api/items
   */
  getItems(): Observable<ListItem[]> {
    return this.http.get<ListItem[]>('/api/items');
  }
}
