import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

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
  private mockUsers = [
    { email: 'user@example.com', password: 'password123' },
    { email: 'admin@example.com', password: 'admin123' }
  ];

  private mockItems: ListItem[] = [
    { id: 1, name: 'Item One', description: 'This is the first item in the list' },
    { id: 2, name: 'Item Two', description: 'This is the second item in the list' },
    { id: 3, name: 'Item Three', description: 'This is the third item in the list' },
    { id: 4, name: 'Item Four', description: 'This is the fourth item in the list' },
    { id: 5, name: 'Item Five', description: 'This is the fifth item in the list' }
  ];

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const user = this.mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      const response: LoginResponse = {
        token: this.generateMockToken(),
        user: { email: user.email }
      };
      return of(response).pipe(delay(1000));
    }

    return throwError(() => new Error('Invalid credentials')).pipe(delay(1000));
  }

  getItems(): Observable<ListItem[]> {
    return of(this.mockItems).pipe(delay(800));
  }

  private generateMockToken(): string {
    return 'mock-token-' + Math.random().toString(36).substring(2) + Date.now();
  }
}
