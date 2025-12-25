import { TestBed } from '@angular/core/testing';
import { MockApiService, LoginRequest, LoginResponse, ListItem } from './mock-api.service';

describe('MockApiService', () => {
  let service: MockApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockApiService]
    });

    service = TestBed.inject(MockApiService);
  });

  describe('login', () => {
    it('should return token and user for valid credentials', (done) => {
      const credentials: LoginRequest = {
        email: 'user@example.com',
        password: 'password123'
      };

      service.login(credentials).subscribe((response: LoginResponse) => {
        expect(response.token).toBeTruthy();
        expect(response.token).toContain('mock-token-');
        expect(response.user.email).toBe('user@example.com');
        done();
      });
    });

    it('should return token for admin credentials', (done) => {
      const credentials: LoginRequest = {
        email: 'admin@example.com',
        password: 'admin123'
      };

      service.login(credentials).subscribe((response: LoginResponse) => {
        expect(response.token).toBeTruthy();
        expect(response.user.email).toBe('admin@example.com');
        done();
      });
    });

    it('should throw error for invalid email', (done) => {
      const credentials: LoginRequest = {
        email: 'invalid@example.com',
        password: 'password123'
      };

      service.login(credentials).subscribe({
        error: (error) => {
          expect(error.message).toBe('Invalid credentials');
          done();
        }
      });
    });

    it('should throw error for invalid password', (done) => {
      const credentials: LoginRequest = {
        email: 'user@example.com',
        password: 'wrongpassword'
      };

      service.login(credentials).subscribe({
        error: (error) => {
          expect(error.message).toBe('Invalid credentials');
          done();
        }
      });
    });

    it('should add delay to login response', (done) => {
      const credentials: LoginRequest = {
        email: 'user@example.com',
        password: 'password123'
      };

      const startTime = Date.now();

      service.login(credentials).subscribe(() => {
        const elapsed = Date.now() - startTime;
        expect(elapsed).toBeGreaterThanOrEqual(900); // Allow 100ms tolerance
        done();
      });
    });

    it('should generate unique tokens', (done) => {
      const credentials: LoginRequest = {
        email: 'user@example.com',
        password: 'password123'
      };

      let firstToken: string;

      service.login(credentials).subscribe((response1) => {
        firstToken = response1.token;

        setTimeout(() => {
          service.login(credentials).subscribe((response2) => {
            expect(response2.token).not.toBe(firstToken);
            done();
          });
        }, 100);
      });
    });
  });

  describe('getItems', () => {
    it('should return array of items', (done) => {
      service.getItems().subscribe((items: ListItem[]) => {
        expect(Array.isArray(items)).toBe(true);
        expect(items.length).toBeGreaterThan(0);
        done();
      });
    });

    it('should return items with correct structure', (done) => {
      service.getItems().subscribe((items: ListItem[]) => {
        items.forEach((item) => {
          expect(item.id).toBeDefined();
          expect(item.name).toBeDefined();
          expect(item.description).toBeDefined();
          expect(typeof item.id).toBe('number');
          expect(typeof item.name).toBe('string');
          expect(typeof item.description).toBe('string');
        });
        done();
      });
    });

    it('should return 5 mock items', (done) => {
      service.getItems().subscribe((items: ListItem[]) => {
        expect(items.length).toBe(5);
        done();
      });
    });

    it('should return items with correct IDs', (done) => {
      service.getItems().subscribe((items: ListItem[]) => {
        const ids = items.map((item) => item.id);
        expect(ids).toEqual([1, 2, 3, 4, 5]);
        done();
      });
    });

    it('should return items with non-empty names and descriptions', (done) => {
      service.getItems().subscribe((items: ListItem[]) => {
        items.forEach((item) => {
          expect(item.name.length).toBeGreaterThan(0);
          expect(item.description.length).toBeGreaterThan(0);
        });
        done();
      });
    });

    it('should add delay to getItems response', (done) => {
      const startTime = Date.now();

      service.getItems().subscribe(() => {
        const elapsed = Date.now() - startTime;
        expect(elapsed).toBeGreaterThanOrEqual(700); // Allow 100ms tolerance
        done();
      });
    });

    it('should return same items on multiple calls', (done) => {
      let firstItems: ListItem[];

      service.getItems().subscribe((items1) => {
        firstItems = items1;

        service.getItems().subscribe((items2) => {
          expect(items2).toEqual(firstItems);
          done();
        });
      });
    });
  });
});
