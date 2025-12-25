import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth.service';
import { MockApiService, LoginResponse } from './mock-api.service';
import { of, throwError } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let mockCookieService: jasmine.SpyObj<CookieService>;
  let mockApiService: jasmine.SpyObj<MockApiService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockCookieService = jasmine.createSpyObj('CookieService', [
      'set',
      'get',
      'delete'
    ]);
    mockApiService = jasmine.createSpyObj('MockApiService', ['login']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: CookieService, useValue: mockCookieService },
        { provide: MockApiService, useValue: mockApiService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  describe('login', () => {
    it('should call mockApiService.login with credentials', (done) => {
      const credentials = { email: 'test@example.com', password: 'password' };
      const response: LoginResponse = {
        token: 'test-token',
        user: { email: 'test@example.com' }
      };

      mockApiService.login.and.returnValue(of(response));

      service.login(credentials).subscribe(() => {
        expect(mockApiService.login).toHaveBeenCalledWith(credentials);
        done();
      });
    });

    it('should set authentication cookies on successful login', (done) => {
      const credentials = { email: 'test@example.com', password: 'password' };
      const response: LoginResponse = {
        token: 'test-token',
        user: { email: 'test@example.com' }
      };

      mockApiService.login.and.returnValue(of(response));

      service.login(credentials).subscribe(() => {
        expect(mockCookieService.set).toHaveBeenCalledWith(
          'auth_token',
          'test-token',
          { expires: 7, path: '/' }
        );
        expect(mockCookieService.set).toHaveBeenCalledWith(
          'user_email',
          'test@example.com',
          { expires: 7, path: '/' }
        );
        done();
      });
    });

    it('should set isAuthenticated signal to true on successful login', (done) => {
      const credentials = { email: 'test@example.com', password: 'password' };
      const response: LoginResponse = {
        token: 'test-token',
        user: { email: 'test@example.com' }
      };

      mockApiService.login.and.returnValue(of(response));

      service.login(credentials).subscribe(() => {
        expect(service.isAuthenticated()).toBe(true);
        done();
      });
    });

    it('should set userEmail signal on successful login', (done) => {
      const credentials = { email: 'test@example.com', password: 'password' };
      const response: LoginResponse = {
        token: 'test-token',
        user: { email: 'test@example.com' }
      };

      mockApiService.login.and.returnValue(of(response));

      service.login(credentials).subscribe(() => {
        expect(service.userEmail()).toBe('test@example.com');
        done();
      });
    });

    it('should return error observable on failed login', (done) => {
      const credentials = { email: 'invalid@example.com', password: 'wrong' };
      const error = new Error('Invalid credentials');

      mockApiService.login.and.returnValue(throwError(() => error));

      service.login(credentials).subscribe({
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  describe('logout', () => {
    it('should delete authentication cookies', () => {
      service.logout();

      expect(mockCookieService.delete).toHaveBeenCalledWith('auth_token', '/');
      expect(mockCookieService.delete).toHaveBeenCalledWith('user_email', '/');
    });

    it('should set isAuthenticated signal to false', () => {
      service.logout();

      expect(service.isAuthenticated()).toBe(false);
    });

    it('should set userEmail signal to null', () => {
      service.logout();

      expect(service.userEmail()).toBe(null);
    });

    it('should navigate to login page', () => {
      service.logout();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('getToken', () => {
    it('should return token from cookie service', () => {
      mockCookieService.get.and.returnValue('test-token');

      const token = service.getToken();

      expect(mockCookieService.get).toHaveBeenCalledWith('auth_token');
      expect(token).toBe('test-token');
    });

    it('should return null when cookie is empty', () => {
      mockCookieService.get.and.returnValue('');

      const token = service.getToken();

      expect(token).toBe(null);
    });
  });

  describe('checkAuthStatus (on init)', () => {
    it('should set isAuthenticated to true if token and email exist', () => {
      mockCookieService.get.and.callFake((key: string) => {
        if (key === 'auth_token') return 'test-token';
        if (key === 'user_email') return 'test@example.com';
        return '';
      });

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          AuthService,
          { provide: CookieService, useValue: mockCookieService },
          { provide: MockApiService, useValue: mockApiService },
          { provide: Router, useValue: mockRouter }
        ]
      });

      const newService = TestBed.inject(AuthService);

      expect(newService.isAuthenticated()).toBe(true);
      expect(newService.userEmail()).toBe('test@example.com');
    });

    it('should keep isAuthenticated false if token is missing', () => {
      mockCookieService.get.and.returnValue('');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          AuthService,
          { provide: CookieService, useValue: mockCookieService },
          { provide: MockApiService, useValue: mockApiService },
          { provide: Router, useValue: mockRouter }
        ]
      });

      const newService = TestBed.inject(AuthService);

      expect(newService.isAuthenticated()).toBe(false);
    });
  });
});
