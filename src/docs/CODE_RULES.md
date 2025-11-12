# CURSOR.md

This file provides guidance to CURSOR when working with code in this repository.

## Project Overview

This is MangaReader, a React + Vite manga reading management system.

**Project
Techstack**

* Framework
  * React: ^19.2.0
  * React DOM: ^19.2.0
* Language
  * TypeScript: ~5.9.3
* Build Tooling
  * Vite: ^7.2.2
  * @vitejs/plugin-react: ^5.1.0
* Styling & UI
  * Ant Design: ^5.24.8
  * @ant-design/icons: ^5.5.1
  * SCSS/Sass: ^1.83.0
  * lucide-react (icons): ^0.553.0
* Routing
  * @tanstack/react-router: ^1.135.2
  * @tanstack/router-devtools: ^1.135.2 (dev)
* State Management
  * zustand: ^5.0.8
* Data & Validation
  * axios: ^1.13.2
  * zod: ^4.1.12
  * @hookform/resolvers: ^5.2.2
  * date-fns: ^4.1.0
* Linting & Quality
  * ESLint: ^9.39.1
  * @eslint/js: ^9.39.1
  * typescript-eslint: ^8.46.3
  * eslint-plugin-react-hooks: ^5.2.0
  * eslint-plugin-react-refresh: ^0.4.24
  * globals: ^16.5.0
* Types
  * @types/node: ^24.10.0
  * @types/react: ^19.2.2
  * @types/react-dom: ^19.2.2
* Project Config
  * ESM: "type": "module"
  * Alias: @ -> ./src (Vite + TS paths)

## Common Commands

### Development  

```bash
npm run dev              # Start dev server 
npm run build            # Build for production 
npm start                # Start production server
```

## Architecture & Critical Patterns

**CRITICAL RULE:** All API calls must be call by hooks and happen in Main Components (pages), not in Child Components. Data flows top-down.

### 1. Project Structure

Use a **feature-based folder structure**. Each feature should contain its own components, hooks, services, and types.

```bash
src/
  app/
    store.ts
    providers.tsx
    router.tsx
  components/
  hooks/
  utils/
  lib/
  constants/
  features/
    FeatureName/
      components/
      hooks/
      services/
      types.ts
      index.ts
  assets/
    global.scss
    variables.scss
  docs/
  main.tsx
  index.html
```

### 2. Naming Conventions

* Files and folders should be in **kebab-case** (e.g., `user-profile`).
* React component files must use **PascalCase** (e.g., `UserProfile.tsx`).
* Hooks must start with `use` (e.g., `useUserData.ts`).
* TypeScript interfaces should start with uppercase I (e.g., `IUser`, `IProduct`).

### 3. Imports

* Use **absolute imports** from `src/`.
* Do not use long relative paths like `../../../component`. Instead configure `@` as root alias.

### 4. Components

* Each component should be function component.
* Do not use any type.
* Each component should do one job.
* Do not write logic functional and mock data direct into JSX (split into variables or functions first)
* Components should be **small and reusable**.
* UI-only reusable components go to `./src/components`.
* Feature-specific UI goes inside its corresponding feature folder.

### 5. State Management

* Global state (cross-feature) should be placed in `/app/store.ts`.
* Feature-specific states should be implemented inside feature folders.

### 6. API & Services

* Networking logic should be done inside `services/` inside each feature.
* Do not call external APIs directly inside components.

### 7. TypeScript Rules

* Don't use ANY
* Always define type for props

### 8. CSS / UI

* Use **Ant Design** components for UI elements.
* Use **SCSS** for custom styling.
* Component-specific styles should be placed in `ComponentName.scss` next to the component file.
* Global styles and variables should be placed in `/assets`.
* SCSS variables are available globally via `variables.scss`.
* Prefer Ant Design components over custom implementations when possible.

### 9. Clean Code

* Remove unnecessary comments and redundant code.
* Follow SOLID principle
* Import in the following order:
  * React + libraries
  * UI Components
  * Hooks/store
  * Utils/types
  * styles

### 8. Commit Rules

Follow Conventional Commits:

```bash
feat: add new login flow
fix: correct cart calculation
refactor: clean up user profile component
style: adjust spacing in navbar
```

### 9. Testing

* Unit tests should be colocated with components (e.g., `Component.test.tsx`).

### 10. File Exports

* Each feature folder must have an `index.ts` that exports public modules.

## Axios Configuration

Pre-configured axios instance at `lib/axios.ts`:

* Base URL from environment variable
* Automatic retry (2 retries with exponential backoff on 500 errors)
* Query string serialization with `qs` (array format: brackets)
* 72-second timeout
* Content-Type: `application/json; charset=utf-8`
  