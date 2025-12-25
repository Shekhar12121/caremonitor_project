import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatIconModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('component initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize loginForm with email and password', () => {
      expect(component.loginForm.get('email')).toBeTruthy();
      expect(component.loginForm.get('password')).toBeTruthy();
    });

    it('should set default values in form', () => {
      expect(component.loginForm.get('email')?.value).toBe('user@example.com');
      expect(component.loginForm.get('password')?.value).toBe('password123');
    });

    it('should initialize isLoading signal as false', () => {
      expect(component.isLoading()).toBe(false);
    });

    it('should initialize errorMessage signal as null', () => {
      expect(component.errorMessage()).toBe(null);
    });

    it('should initialize hidePassword signal as true', () => {
      expect(component.hidePassword()).toBe(true);
    });
  });

  describe('form validation', () => {
    it('should require email field', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('');
      emailControl?.markAsTouched();

      expect(emailControl?.hasError('required')).toBe(true);
    });

    it('should require valid email format', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();

      expect(emailControl?.hasError('email')).toBe(true);
    });

    it('should accept valid email', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('valid@example.com');

      expect(emailControl?.hasError('email')).toBe(false);
    });

    it('should require password field', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('');
      passwordControl?.markAsTouched();

      expect(passwordControl?.hasError('required')).toBe(true);
    });

    it('should mark form as invalid when email is invalid', () => {
      component.loginForm.get('email')?.setValue('invalid-email');
      component.loginForm.get('password')?.setValue('password');

      expect(component.loginForm.valid).toBe(false);
    });

    it('should mark form as invalid when password is empty', () => {
      component.loginForm.get('email')?.setValue('test@example.com');
      component.loginForm.get('password')?.setValue('');

      expect(component.loginForm.valid).toBe(false);
    });

    it('should mark form as valid with correct input', () => {
      component.loginForm.get('email')?.setValue('test@example.com');
      component.loginForm.get('password')?.setValue('password123');

      expect(component.loginForm.valid).toBe(true);
    });
  });

  describe('togglePasswordVisibility', () => {
    it('should toggle hidePassword from true to false', () => {
      component.hidePassword.set(true);

      component.togglePasswordVisibility();

      expect(component.hidePassword()).toBe(false);
    });

    it('should toggle hidePassword from false to true', () => {
      component.hidePassword.set(false);

      component.togglePasswordVisibility();

      expect(component.hidePassword()).toBe(true);
    });

    it('should toggle hidePassword multiple times', () => {
      expect(component.hidePassword()).toBe(true);

      component.togglePasswordVisibility();
      expect(component.hidePassword()).toBe(false);

      component.togglePasswordVisibility();
      expect(component.hidePassword()).toBe(true);

      component.togglePasswordVisibility();
      expect(component.hidePassword()).toBe(false);
    });
  });

  describe('onSubmit', () => {
    it('should not submit invalid form', () => {
      component.loginForm.get('email')?.setValue('invalid-email');
      component.loginForm.get('password')?.setValue('password');

      component.onSubmit();

      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('should call authService.login with form values', () => {
      const credentials = { email: 'test@example.com', password: 'password' };
      component.loginForm.patchValue(credentials);

      mockAuthService.login.and.returnValue(of({ token: 'test', user: { email: 'test@example.com' } }));

      component.onSubmit();

      expect(mockAuthService.login).toHaveBeenCalledWith(credentials);
    });

    it('should set isLoading to true during login', (done) => {
      const credentials = { email: 'test@example.com', password: 'password' };
      component.loginForm.patchValue(credentials);

      let isLoadingDuringCall = false;

      mockAuthService.login.and.callFake(() => {
        isLoadingDuringCall = component.isLoading();
        return of({ token: 'test', user: { email: 'test@example.com' } });
      });

      component.onSubmit();

      setTimeout(() => {
        expect(isLoadingDuringCall).toBe(true);
        done();
      }, 50);
    });

    it('should set isLoading to false on success', (done) => {
      const credentials = { email: 'test@example.com', password: 'password' };
      component.loginForm.patchValue(credentials);

      mockAuthService.login.and.returnValue(of({ token: 'test', user: { email: 'test@example.com' } }));

      component.onSubmit();

      setTimeout(() => {
        expect(component.isLoading()).toBe(false);
        done();
      }, 50);
    });

    it('should clear error message on successful login', (done) => {
      component.errorMessage.set('Previous error');
      const credentials = { email: 'test@example.com', password: 'password' };
      component.loginForm.patchValue(credentials);

      mockAuthService.login.and.returnValue(of({ token: 'test', user: { email: 'test@example.com' } }));

      component.onSubmit();

      setTimeout(() => {
        expect(component.errorMessage()).toBe(null);
        done();
      }, 50);
    });

    it('should navigate to dashboard on successful login', (done) => {
      const credentials = { email: 'test@example.com', password: 'password' };
      component.loginForm.patchValue(credentials);

      mockAuthService.login.and.returnValue(of({ token: 'test', user: { email: 'test@example.com' } }));

      component.onSubmit();

      setTimeout(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
        done();
      }, 50);
    });

    it('should handle login error', (done) => {
      const credentials = { email: 'invalid@example.com', password: 'wrong' };
      const errorMessage = 'Invalid credentials';
      component.loginForm.patchValue(credentials);

      mockAuthService.login.and.returnValue(
        throwError(() => ({ message: errorMessage }))
      );

      component.onSubmit();

      setTimeout(() => {
        expect(component.errorMessage()).toBe(errorMessage);
        expect(component.isLoading()).toBe(false);
        done();
      }, 50);
    });

    it('should set generic error message when error has no message', (done) => {
      const credentials = { email: 'test@example.com', password: 'password' };
      component.loginForm.patchValue(credentials);

      mockAuthService.login.and.returnValue(throwError(() => ({})));

      component.onSubmit();

      setTimeout(() => {
        expect(component.errorMessage()).toBe('Login failed. Please try again.');
        done();
      }, 50);
    });

    it('should not navigate to dashboard on error', (done) => {
      const credentials = { email: 'test@example.com', password: 'password' };
      component.loginForm.patchValue(credentials);

      mockAuthService.login.and.returnValue(
        throwError(() => new Error('Login failed'))
      );

      component.onSubmit();

      setTimeout(() => {
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        done();
      }, 50);
    });
  });

  describe('button disabled state', () => {
    it('should disable submit button when form is invalid', () => {
      component.loginForm.get('email')?.setValue('invalid-email');
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button[type="submit"]');

      expect(button.disabled).toBe(true);
    });

    it('should disable submit button when isLoading is true', () => {
      component.loginForm.get('email')?.setValue('test@example.com');
      component.loginForm.get('password')?.setValue('password');
      component.isLoading.set(true);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button[type="submit"]');

      expect(button.disabled).toBe(true);
    });

    it('should enable submit button when form is valid and not loading', () => {
      component.loginForm.get('email')?.setValue('test@example.com');
      component.loginForm.get('password')?.setValue('password');
      component.isLoading.set(false);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button[type="submit"]');

      expect(button.disabled).toBe(false);
    });
  });
});
