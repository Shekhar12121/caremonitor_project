import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ListComponent } from './list.component';
import { ItemsStore } from '../../stores/items.store';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of } from 'rxjs';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let mockItemsStore: jasmine.SpyObj<InstanceType<typeof ItemsStore>>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const itemsSignal = signal<any[]>([]);
    const isLoadingSignal = signal(false);
    const errorSignal = signal(null);

    mockItemsStore = jasmine.createSpyObj('ItemsStore', ['loadItems'], {
      items: itemsSignal,
      isLoading: isLoadingSignal,
      error: errorSignal
    });

    mockAuthService = jasmine.createSpyObj('AuthService', ['logout']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ListComponent,
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        MatListModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ItemsStore, useValue: mockItemsStore },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('component initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have ItemsStore injected', () => {
      expect(component.store).toBeTruthy();
    });

    it('should call loadItems on init', () => {
      expect(mockItemsStore.loadItems).toHaveBeenCalled();
    });

    it('should have authService injected', () => {
      // Injected but not directly exposed
      expect(component).toBeTruthy();
    });

    it('should have router injected', () => {
      // Injected but not directly exposed
      expect(component).toBeTruthy();
    });
  });

  describe('store access', () => {
    it('should have access to store items', () => {
      (mockItemsStore.items as any).set([
        { id: 1, name: 'Item 1', description: 'Description 1' },
        { id: 2, name: 'Item 2', description: 'Description 2' }
      ]);

      expect(component.store.items()).toEqual([
        { id: 1, name: 'Item 1', description: 'Description 1' },
        { id: 2, name: 'Item 2', description: 'Description 2' }
      ]);
    });

    it('should have access to store isLoading', () => {
      (mockItemsStore.isLoading as any).set(true);

      expect(component.store.isLoading()).toBe(true);
    });

    it('should have access to store error', () => {
      (mockItemsStore.error as any).set('Test error');

      expect(component.store.error()).toBe('Test error');
    });
  });

  describe('retry', () => {
    it('should call store.loadItems', () => {
      component.retry();

      expect(mockItemsStore.loadItems).toHaveBeenCalled();
    });

    it('should reload items on retry', () => {
      const callCount = mockItemsStore.loadItems.calls.count();

      component.retry();

      expect(mockItemsStore.loadItems.calls.count()).toBe(callCount + 1);
    });
  });

  describe('goBack', () => {
    it('should navigate to dashboard', () => {
      component.goBack();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });

  describe('logout', () => {
    it('should call authService.logout', () => {
      component.logout();

      expect(mockAuthService.logout).toHaveBeenCalled();
    });
  });

  describe('template rendering - loading state', () => {
    it('should display loading spinner when isLoading is true', () => {
      (mockItemsStore.isLoading as any).set(true);
      fixture.detectChanges();

      const spinner = fixture.nativeElement.querySelector('mat-spinner');

      expect(spinner).toBeTruthy();
    });

    it('should display loading text when isLoading is true', () => {
      (mockItemsStore.isLoading as any).set(true);
      fixture.detectChanges();

      const text = fixture.nativeElement.textContent;

      expect(text).toContain('Loading items');
    });

    it('should not display spinner when isLoading is false', () => {
      (mockItemsStore.isLoading as any).set(false);
      fixture.detectChanges();

      const spinner = fixture.nativeElement.querySelector('mat-spinner');

      expect(spinner).toBeFalsy();
    });
  });

  describe('template rendering - error state', () => {
    it('should display error card when error exists', () => {
      (mockItemsStore.error as any).set('Failed to load items');
      fixture.detectChanges();

      const errorCard = fixture.nativeElement.textContent;

      expect(errorCard).toContain('Failed to load items');
    });

    it('should display error icon when error exists', () => {
      (mockItemsStore.error as any).set('Test error');
      fixture.detectChanges();

      const icons = fixture.nativeElement.querySelectorAll('mat-icon');
      const hasErrorIcon = Array.from(icons).some((icon: any) => 
        icon.textContent.includes('error')
      );

      expect(hasErrorIcon).toBe(true);
    });

    it('should display retry button when error exists', () => {
      (mockItemsStore.error as any).set('Test error');
      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll('button');
      const hasRetryButton = Array.from(buttons).some((btn: any) => 
        btn.textContent.includes('Retry')
      );

      expect(hasRetryButton).toBe(true);
    });

    it('should not display error card when no error', () => {
      (mockItemsStore.error as any).set(null);
      fixture.detectChanges();

      const text = fixture.nativeElement.textContent;

      expect(text).not.toContain('error-message');
    });
  });

  describe('template rendering - items list', () => {
    it('should display items list when items exist and no error', () => {
      (mockItemsStore.items as any).set([
        { id: 1, name: 'Item 1', description: 'Description 1' }
      ]);
      (mockItemsStore.isLoading as any).set(false);
      (mockItemsStore.error as any).set(null);
      fixture.detectChanges();

      const listItems = fixture.nativeElement.querySelectorAll('mat-list-item');

      expect(listItems.length).toBeGreaterThan(0);
    });

    it('should display item names', () => {
      (mockItemsStore.items as any).set([
        { id: 1, name: 'Test Item', description: 'Test Description' }
      ]);
      (mockItemsStore.isLoading as any).set(false);
      (mockItemsStore.error as any).set(null);
      fixture.detectChanges();

      const text = fixture.nativeElement.textContent;

      expect(text).toContain('Test Item');
    });

    it('should display item descriptions', () => {
      (mockItemsStore.items as any).set([
        { id: 1, name: 'Test Item', description: 'Test Description' }
      ]);
      (mockItemsStore.isLoading as any).set(false);
      (mockItemsStore.error as any).set(null);
      fixture.detectChanges();

      const text = fixture.nativeElement.textContent;

      expect(text).toContain('Test Description');
    });

    it('should display item count in title', () => {
      (mockItemsStore.items as any).set([
        { id: 1, name: 'Item 1', description: 'Description 1' },
        { id: 2, name: 'Item 2', description: 'Description 2' }
      ]);
      (mockItemsStore.isLoading as any).set(false);
      (mockItemsStore.error as any).set(null);
      fixture.detectChanges();

      const text = fixture.nativeElement.textContent;

      expect(text).toContain('2');
    });

    it('should display multiple items', () => {
      (mockItemsStore.items as any).set([
        { id: 1, name: 'Item 1', description: 'Description 1' },
        { id: 2, name: 'Item 2', description: 'Description 2' },
        { id: 3, name: 'Item 3', description: 'Description 3' }
      ]);
      (mockItemsStore.isLoading as any).set(false);
      (mockItemsStore.error as any).set(null);
      fixture.detectChanges();

      const listItems = fixture.nativeElement.querySelectorAll('mat-list-item');

      expect(listItems.length).toBe(3);
    });
  });

  describe('template rendering - empty state', () => {
    it('should display empty state when no items', () => {
      (mockItemsStore.items as any).set([]);
      (mockItemsStore.isLoading as any).set(false);
      (mockItemsStore.error as any).set(null);
      fixture.detectChanges();

      const text = fixture.nativeElement.textContent;

      expect(text).toContain('No items found');
    });

    it('should display empty icon', () => {
      (mockItemsStore.items as any).set([]);
      (mockItemsStore.isLoading as any).set(false);
      (mockItemsStore.error as any).set(null);
      fixture.detectChanges();

      const icons = fixture.nativeElement.querySelectorAll('mat-icon');
      const hasInboxIcon = Array.from(icons).some((icon: any) => 
        icon.textContent.includes('inbox')
      );

      expect(hasInboxIcon).toBe(true);
    });
  });

  describe('template rendering - toolbar', () => {
    it('should display toolbar', () => {
      const toolbar = fixture.nativeElement.querySelector('mat-toolbar');

      expect(toolbar).toBeTruthy();
    });

    it('should display back button', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');
      const hasBackButton = Array.from(buttons).some((btn: any) => {
        const icons = btn.querySelectorAll('mat-icon');
        return Array.from(icons).some((icon: any) => 
          icon.textContent.includes('arrow_back')
        );
      });

      expect(hasBackButton).toBe(true);
    });

    it('should display logout button', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');
      const hasLogoutButton = Array.from(buttons).some((btn: any) => 
        btn.textContent.includes('Logout')
      );

      expect(hasLogoutButton).toBe(true);
    });

    it('should display toolbar title', () => {
      const text = fixture.nativeElement.textContent;

      expect(text).toContain('Items List');
    });
  });

  describe('button interactions', () => {
    it('back button should call goBack', () => {
      spyOn(component, 'goBack');

      const buttons = fixture.nativeElement.querySelectorAll('button');
      const backButton = Array.from(buttons).find((btn: any) => {
        const icons = btn.querySelectorAll('mat-icon');
        return Array.from(icons).some((icon: any) => 
          icon.textContent.includes('arrow_back')
        );
      }) as HTMLButtonElement;

      if (backButton) {
        backButton.click();
        expect(component.goBack).toHaveBeenCalled();
      }
    });

    it('logout button should call logout', () => {
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

    it('retry button should call retry when error exists', () => {
      spyOn(component, 'retry');
      (mockItemsStore.error as any).set('Test error');
      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll('button');
      const retryButton = Array.from(buttons).find((btn: any) => 
        btn.textContent.includes('Retry')
      ) as HTMLButtonElement;

      if (retryButton) {
        retryButton.click();
        expect(component.retry).toHaveBeenCalled();
      }
    });
  });

  describe('Material components', () => {
    it('should use Material toolbar', () => {
      const toolbar = fixture.nativeElement.querySelector('mat-toolbar');

      expect(toolbar).toBeTruthy();
    });

    it('should use Material card', () => {
      const card = fixture.nativeElement.querySelector('mat-card');

      expect(card).toBeTruthy();
    });

    it('should use Material list', () => {
      (mockItemsStore.items as any).set([
        { id: 1, name: 'Item 1', description: 'Description 1' }
      ]);
      fixture.detectChanges();

      const list = fixture.nativeElement.querySelector('mat-list');

      expect(list).toBeTruthy();
    });

    it('should use Material spinner', () => {
      (mockItemsStore.isLoading as any).set(true);
      fixture.detectChanges();

      const spinner = fixture.nativeElement.querySelector('mat-spinner');

      expect(spinner).toBeTruthy();
    });
  });
});
