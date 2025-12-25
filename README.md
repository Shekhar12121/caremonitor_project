# CareMonitor Project

## Project Overview

CareMonitor is an Angular 21 demo application featuring:
- Standalone components
- Signal Store state management (@ngrx/signals)
- Angular Material UI
- Mock API with realistic delays (login & list endpoints)
- Cookie-based authentication
- Lazy-loaded routes
- Comprehensive unit tests (Karma & Jasmine)

## Prerequisites
- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** (optional, for version control)

## Setup Instructions

### 1. Extract the Project
Unzip the project folder and navigate to it:
```bash
unzip caremonitor_project.zip
cd caremonitor_project
```

### 2. Install Dependencies
Install all required npm packages:
```bash
npm install
```

### 3. Start the Development Server
Run the app in development mode:
```bash
npm start
```
Or:
```bash
ng serve
```

Visit: [http://localhost:4200](http://localhost:4200)

### 4. Run Unit Tests
To run all tests:
```bash
npm test
```
Or with code coverage:
```bash
ng test --code-coverage
```

### 5. Build for Production
To create a production build:
```bash
npm run build
```
Output will be in the `/dist/demo` folder.

## Testing Credentials
| Email               | Password    |
|---------------------|------------|
| user@example.com    | password123|
| admin@example.com   | admin123   |

## Project Structure
```
caremonitor_project/
├── src/
│   ├── app.routes.ts
│   ├── main.ts
│   ├── components/
│   │   ├── dashboard/
│   │   ├── list/
│   │   └── login/
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── mock-api.service.ts
│   │   └── mock-api.interceptor.ts
│   ├── stores/
│   │   └── items.store.ts
│   └── guards/
│       └── auth.guard.ts
├── package.json
├── angular.json
├── tsconfig.json
├── REQUIREMENTS_CHECKLIST.md
└── SETUP.md
```

## Key Features
- Angular 21 (standalone)
- Signal Store (@ngrx/signals)
- Angular Material UI
- Mock API (login & list endpoints)
- Cookie-based authentication
- Lazy loading
- Unit tests (Karma & Jasmine)

## Troubleshooting
- **Port 4200 in use:**
  ```bash
  ng serve --port 4201
  ```
- **Chrome not found for tests:**
  Ensure Google Chrome is installed.
- **npm install fails:**
  ```bash
  npm cache clean --force
  npm install
  ```
- **Tests fail with module errors:**
  ```bash
  npm install
  npm install --save-dev karma-coverage
  ```

## Next Steps
1. Run `npm install`
2. Run `npm start`
3. Open [http://localhost:4200](http://localhost:4200)
4. Login with test credentials
5. Run `npm test` to execute tests

---

**Project Status:** 100% Complete ✅
See `REQUIREMENTS_CHECKLIST.md` for details.
