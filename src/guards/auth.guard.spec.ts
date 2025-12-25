import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { signal } from '@angular/core';

describe('authGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRoute: jasmine.SpyObj<ActivatedRouteSnapshot>;
  let mockState: jasmine.SpyObj<RouterStateSnapshot>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', [], {
      isAuthenticated: signal(false)
    });
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRoute = jasmine.createSpyObj('ActivatedRouteSnapshot', ['']);
    mockState = jasmine.createSpyObj('RouterStateSnapshot', ['']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  describe('guard activation', () => {
    it('should allow activation when user is authenticated', () => {
      mockAuthService.isAuthenticated.set(true);

      const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(result).toBe(true);
    });

    it('should prevent activation when user is not authenticated', () => {
      mockAuthService.isAuthenticated.set(false);

      const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(result).toBe(false);
    });

    it('should navigate to login when user is not authenticated', () => {
      mockAuthService.isAuthenticated.set(false);

      TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should not navigate to login when user is authenticated', () => {
      mockAuthService.isAuthenticated.set(true);

      TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('multiple guard checks', () => {
    it('should return true consistently when authenticated', () => {
      mockAuthService.isAuthenticated.set(true);

      const result1 = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      const result2 = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(result1).toBe(true);
      expect(result2).toBe(true);
    });

    it('should return false consistently when not authenticated', () => {
      mockAuthService.isAuthenticated.set(false);

      const result1 = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      const result2 = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });
  });

  describe('authentication state changes', () => {
    it('should allow access when authentication status changes to true', () => {
      mockAuthService.isAuthenticated.set(false);

      let result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      expect(result).toBe(false);

      mockAuthService.isAuthenticated.set(true);

      result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      expect(result).toBe(true);
    });

    it('should deny access when authentication status changes to false', () => {
      mockAuthService.isAuthenticated.set(true);

      let result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      expect(result).toBe(true);

      mockAuthService.isAuthenticated.set(false);

      result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      expect(result).toBe(false);
    });

    it('should navigate to login when authentication is revoked', () => {
      mockAuthService.isAuthenticated.set(true);
      TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      mockRouter.navigate.calls.reset();

      mockAuthService.isAuthenticated.set(false);
      TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('guard with route context', () => {
    it('should be a CanActivateFn', () => {
      expect(typeof authGuard).toBe('function');
    });

    it('should return a boolean', () => {
      mockAuthService.isAuthenticated.set(true);

      const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(typeof result).toBe('boolean');
    });
  });

  describe('navigation behavior', () => {
    it('should navigate only once per guard check', () => {
      mockAuthService.isAuthenticated.set(false);

      TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
    });

    it('should navigate to exact login path', () => {
      mockAuthService.isAuthenticated.set(false);

      TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      const navigateCalls = mockRouter.navigate.calls.all();
      expect(navigateCalls[0].args[0]).toEqual(['/login']);
    });

    it('should not navigate to other routes when denying access', () => {
      mockAuthService.isAuthenticated.set(false);

      TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
      expect(mockRouter.navigate).not.toHaveBeenCalledWith(['/dashboard']);
      expect(mockRouter.navigate).not.toHaveBeenCalledWith(['/list']);
    });
  });

  describe('edge cases', () => {
    it('should handle guard with signal value immediately changing', () => {
      mockAuthService.isAuthenticated.set(false);

      const result1 = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      mockAuthService.isAuthenticated.set(true);

      const result2 = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(result1).toBe(false);
      expect(result2).toBe(true);
    });

    it('should not throw error when navigation fails', () => {
      mockAuthService.isAuthenticated.set(false);
      mockRouter.navigate.and.returnValue(Promise.reject('Navigation error'));

      expect(() => {
        TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      }).not.toThrow();
    });
  });

  describe('security', () => {
    it('should prevent access to protected routes for unauthenticated users', () => {
      mockAuthService.isAuthenticated.set(false);

      const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(result).toBe(false);
    });

    it('should grant access to protected routes for authenticated users', () => {
      mockAuthService.isAuthenticated.set(true);

      const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(result).toBe(true);
    });

    it('should always redirect to login for unauthenticated access attempts', () => {
      mockAuthService.isAuthenticated.set(false);

      TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      // Should navigate twice for two guard checks
      expect(mockRouter.navigate.calls.count()).toBe(2);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('integration with authentication service', () => {
    it('should depend on AuthService.isAuthenticated signal', () => {
      expect(mockAuthService.isAuthenticated).toBeDefined();
    });

    it('should respect AuthService state', () => {
      // When AuthService says user is authenticated
      mockAuthService.isAuthenticated.set(true);
      let result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      expect(result).toBe(true);

      // When AuthService says user is not authenticated
      mockAuthService.isAuthenticated.set(false);
      result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      expect(result).toBe(false);
    });

    it('should work with AuthService logout (signal update)', () => {
      mockAuthService.isAuthenticated.set(true);
      let result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      expect(result).toBe(true);

      // Simulate logout by updating signal
      mockAuthService.isAuthenticated.set(false);
      result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});