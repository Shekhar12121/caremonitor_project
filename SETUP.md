# Project Setup Guide

## Prerequisites
Before running this project, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for version control)

## Setup Steps

### 1. Extract the Project
Unzip the project folder to your desired location:
```bash
unzip caremonitor_project.zip
cd caremonitor_project
```

### 2. Install Dependencies
Install all required npm packages:
```bash
npm install
```
This will install all dependencies listed in `package.json`, including:
- Angular 21
- Angular Material
- @ngrx/signals
- Karma & Jasmine for testing
- And other required packages

**Installation time:** ~2-5 minutes (depends on internet speed)

### 3. Start the Development Server
Run the application in development mode:
```bash
npm start
```
Or equivalently:
```bash
ng serve
```

The application will be available at:
```
http://localhost:4200
```

The server will automatically reload when you make changes to the files.

### 4. Run Unit Tests
To run the test suite:
```bash
npm test
```
Or with code coverage:
```bash
ng test --code-coverage
```

This will:
- Run all test files (`.spec.ts`)
- Open Karma test runner in Chrome
- Watch for changes and re-run tests
- Generate coverage reports in `/coverage` folder

**Available test files:**
- `src/services/auth.service.spec.ts`
- `src/services/mock-api.service.spec.ts`
- `src/stores/items.store.spec.ts`
- `src/components/list/list.component.spec.ts`
- `src/components/login/login.component.spec.ts`
- `src/components/dashboard/dashboard.component.spec.ts`
- `src/guards/auth.guard.spec.ts`

### 5. Build for Production
To create a production-ready build:
```bash
npm run build
```

The compiled files will be in the `/dist/demo` folder.

---

## Project Structure

```
caremonitor_project/
├── src/
│   ├── app.routes.ts              # Application routing configuration
│   ├── main.ts                    # Application bootstrap
│   ├── test.ts                    # Test configuration
│   ├── components/
│   │   ├── dashboard/             # Dashboard component
│   │   ├── list/                  # List component with tests
│   │   └── login/                 # Login component
│   ├── services/
│   │   ├── auth.service.ts        # Authentication service
│   │   └── mock-api.service.ts    # Mock API service
│   ├── stores/
│   │   └── items.store.ts         # Signal Store for state management
│   └── guards/
│       └── auth.guard.ts          # Route authentication guard
├── karma.conf.js                  # Karma test runner configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies and scripts
├── angular.json                   # Angular CLI configuration
└── REQUIREMENTS_CHECKLIST.md      # Project requirements status
```

---

## Testing Credentials

The mock authentication service includes these test credentials:

| Email | Password |
|-------|----------|
| user@example.com | password123 |
| admin@example.com | admin123 |

---

## Available npm Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server (http://localhost:4200) |
| `npm test` | Run unit tests with Karma |
| `npm run build` | Build for production |
| `npm run watch` | Build in watch mode |
| `ng test --code-coverage` | Run tests with code coverage report |

---

## Troubleshooting

### Issue: Port 4200 already in use
**Solution:** Use a different port:
```bash
ng serve --port 4201
```

### Issue: Chrome not found for tests
**Solution:** Ensure Google Chrome is installed. Karma uses Chrome to run tests.

### Issue: npm install fails
**Solution:** Clear npm cache and try again:
```bash
npm cache clean --force
npm install
```

### Issue: Tests fail with "Cannot find module" errors
**Solution:** Make sure all dependencies are installed:
```bash
npm install
npm install --save-dev karma-coverage
```

---

## Key Features

✅ **Angular 21** with standalone components  
✅ **Signal Store** for state management (@ngrx/signals)  
✅ **Angular Material** UI components  
✅ **Authentication** with cookie-based tokens  
✅ **Loading & Error States** with spinner animations  
✅ **Mock API** with realistic delays  
✅ **Lazy Loading** for routes  
✅ **Comprehensive Unit Tests** with Karma & Jasmine  
✅ **Code Coverage** support  

---

## Development Notes

- The application uses **standalone components** (Angular 14+)
- State management is handled by **Signal Store** from @ngrx/signals
- All services return **Observables** with proper RxJS patterns
- Material Icons are loaded from **Google Fonts CDN**
- Tests use **Jasmine** with **Karma** test runner

---

## Next Steps

1. Run `npm install` to install dependencies
2. Run `npm start` to start the development server
3. Open `http://localhost:4200` in your browser
4. Login with test credentials (see Testing Credentials section)
5. Run `npm test` to execute the test suite

---

**Project Status:** 100% Complete ✅  
All core requirements and unit tests implemented.

For detailed requirements, see `REQUIREMENTS_CHECKLIST.md`
