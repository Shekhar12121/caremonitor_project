import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, tap } from 'rxjs';
import { MockApiService, LoginRequest, LoginResponse } from './mock-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_EMAIL_KEY = 'user_email';

  isAuthenticated = signal<boolean>(false);
  userEmail = signal<string | null>(null);

  constructor(
    private cookieService: CookieService,
    private mockApiService: MockApiService,
    private router: Router
  ) {
    this.checkAuthStatus();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.mockApiService.login(credentials).pipe(
      tap(response => {
        this.cookieService.set(this.TOKEN_KEY, response.token, { expires: 7, path: '/' });
        this.cookieService.set(this.USER_EMAIL_KEY, response.user.email, { expires: 7, path: '/' });
        this.isAuthenticated.set(true);
        this.userEmail.set(response.user.email);
      })
    );
  }

  logout(): void {
    this.cookieService.delete(this.TOKEN_KEY, '/');
    this.cookieService.delete(this.USER_EMAIL_KEY, '/');
    this.isAuthenticated.set(false);
    this.userEmail.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.cookieService.get(this.TOKEN_KEY) || null;
  }

  private checkAuthStatus(): void {
    const token = this.getToken();
    const email = this.cookieService.get(this.USER_EMAIL_KEY);

    if (token && email) {
      this.isAuthenticated.set(true);
      this.userEmail.set(email);
    }
  }
}
