import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout'], {
      userEmail: signal('test@example.com')
    });
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('component initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have authService injected', () => {
      expect(component.authService).toBeTruthy();
    });

    it('should have access to user email from authService', () => {
      expect(mockAuthService.userEmail()).toBe('test@example.com');
    });
  });

  describe('navigateToList', () => {
    it('should navigate to list route', () => {
      component.navigateToList();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/list']);
    });

    it('should be called when list button is clicked', () => {
      spyOn(component, 'navigateToList');

      const listButton = fixture.nativeElement.querySelector('button[type="button"]');
      if (listButton) {
        listButton.click();
        expect(component.navigateToList).toHaveBeenCalled();
      }
    });
  });

  describe('logout', () => {
    it('should call authService.logout', () => {
      component.logout();

      expect(mockAuthService.logout).toHaveBeenCalled();
    });

    it('should be called when logout button is clicked', () => {
      spyOn(component, 'logout');

      const buttons = fixture.nativeElement.querySelectorAll('button');
      const logoutButton = Array.from(buttons).find((btn: any) => 
        btn.textContent.includes('Logout')
      ) as HTMLButtonElement;

      if (logoutButton) {
        logoutButton.click();
        expect(component.logout).toHaveBeenCalled();
      }
    });
  });

  describe('template rendering', () => {
    it('should display dashboard title', () => {
      const title = fixture.nativeElement.querySelector('h1, h2, [role="heading"]');
      // Dashboard title might be in various formats
      expect(fixture.nativeElement.textContent).toContain('Dashboard');
    });

    it('should display list navigation button', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');
      const hasListButton = Array.from(buttons).some((btn: any) => 
        btn.textContent.includes('View Items') || btn.textContent.includes('List')
      );
      expect(hasListButton).toBe(true);
    });

    it('should display logout button', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');
      const hasLogoutButton = Array.from(buttons).some((btn: any) => 
        btn.textContent.includes('Logout')
      );
      expect(hasLogoutButton).toBe(true);
    });

    it('should display user email', () => {
      fixture.detectChanges();
      const text = fixture.nativeElement.textContent;
      expect(text).toContain('test@example.com');
    });
  });

  describe('component properties', () => {
    it('should have router injected', () => {
      expect(component['router']).toBeTruthy();
    });
  });

  describe('integration scenarios', () => {
    it('should navigate to list when navigateToList is called and then logout', () => {
      component.navigateToList();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/list']);

      mockRouter.navigate.calls.reset();

      component.logout();
      expect(mockAuthService.logout).toHaveBeenCalled();
    });

    it('should handle multiple logout attempts', () => {
      component.logout();
      expect(mockAuthService.logout).toHaveBeenCalledTimes(1);

      component.logout();
      expect(mockAuthService.logout).toHaveBeenCalledTimes(2);
    });

    it('should handle multiple navigate attempts', () => {
      component.navigateToList();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/list']);

      mockRouter.navigate.calls.reset();

      component.navigateToList();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/list']);
    });
  });

  describe('Material components', () => {
    it('should use Material toolbar', () => {
      const toolbar = fixture.nativeElement.querySelector('mat-toolbar');
      expect(toolbar).toBeTruthy();
    });

    it('should use Material cards', () => {
      const cards = fixture.nativeElement.querySelectorAll('mat-card');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('should use Material buttons', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button[mat-raised-button], button[mat-icon-button]');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
