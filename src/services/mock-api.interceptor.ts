
import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LoginRequest, LoginResponse, ListItem } from './mock-api.service';

const mockUsers = [
  { email: 'user@example.com', password: 'password123' },
  { email: 'admin@example.com', password: 'admin123' }
];

const mockItems: ListItem[] = [
  { id: 1, name: 'Item One', description: 'This is the first item in the list' },
  { id: 2, name: 'Item Two', description: 'This is the second item in the list' },
  { id: 3, name: 'Item Three', description: 'This is the third item in the list' },
  { id: 4, name: 'Item Four', description: 'This is the fourth item in the list' },
  { id: 5, name: 'Item Five', description: 'This is the fifth item in the list' }
];

function generateMockToken(): string {
  return 'mock-token-' + Math.random().toString(36).substring(2) + Date.now();
}

export function MockApiInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  // Handle POST /api/login
  if (req.method === 'POST' && req.url.endsWith('/api/login')) {
    const credentials: LoginRequest = req.body;
    const user = mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );
    if (user) {
      const response: LoginResponse = {
        token: generateMockToken(),
        user: { email: user.email }
      };
      return of(new HttpResponse({ status: 200, body: response })).pipe(delay(1000));
    } else {
      return throwError(() => new Error('Invalid credentials')).pipe(delay(1000));
    }
  }

  // Handle GET /api/items
  if (req.method === 'GET' && req.url.endsWith('/api/items')) {
    return of(new HttpResponse({ status: 200, body: mockItems })).pipe(delay(800));
  }

  // Pass through other requests
  return next(req);
}
