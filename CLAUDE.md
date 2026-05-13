# rateat

## Project Overview
Angular 21 application with standalone components, Signal-based state.

## Tech Stack
- **Framework**: Angular 21
- **Language**: TypeScript 5.9
- **Styling**: SCSS
- **Package Manager**: npm

## Common Commands
```bash
npm start        # Start dev server (ng serve)
npm run build    # Production build
npm run watch    # Dev build with watch mode
```

## Project Structure

```
src/
  app/
    app.ts                    # Root component
    app.config.ts             # App configuration
    app.routes.ts             # App routing
    core/                     # Core/singleton services and layout
      auth/                   # Authentication
        auth.guard.ts
        auth.service.ts
        auth.store.ts
        user.model.ts
        index.ts
      layout/                 # App shell (each component in its own folder)
        nav/                  # Navigation component
          nav.ts, nav.html, nav.scss, index.ts
        shell/                # Shell component
          shell.ts, shell.html, shell.scss, index.ts
        index.ts
    features/                 # Feature modules (restaurants, visits, partners, etc.)
      restaurants/
        component/            # Feature components (each in its own folder)
          restaurant-list/
            restaurant-list.ts, restaurant-list.html, restaurant-list.scss, index.ts
          restaurant-detail/
            restaurant-detail.ts, restaurant-detail.html, restaurant-detail.scss, index.ts
          restaurant-form/
            restaurant-form.ts, restaurant-form.html, restaurant-form.scss, index.ts
          index.ts
        service/restaurant.service.ts
        store/restaurant.store.ts
        model/restaurant.model.ts
        routes.ts
        index.ts
      visits/
        component/            # Each component in its own folder
          visit-form/
            visit-form.ts, visit-form.html, visit-form.scss, index.ts
          visit-list-item/
            visit-list-item.ts, visit-list-item.html, visit-list-item.scss, index.ts
          index.ts
        service/visit.service.ts
        store/visit.store.ts
        model/visit.model.ts
        routes.ts
        index.ts
    shared/
      ui/                     # Shared UI components
        button/               # Each component in its own folder
          button.ts, button.html, button.scss, index.ts
        card/
          card.ts, card.html, card.scss, index.ts
        rating-display/
          rating-display.ts, rating-display.html, rating-display.scss, index.ts
        rating-input/
          rating-input.ts, rating-input.html, rating-input.scss, index.ts
        index.ts              # Barrel export
  main.ts                     # Bootstrap entry point
  styles.scss                 # Global styles
  index.html                  # HTML shell
public/                       # Static assets
```

## Conventions
- **Folder Organization**: Each folder should contain max 6-7 files
- **Component Subfolders**: Always create individual subfolders for each component if a folder contains more than one component (e.g., if a folder has visit-form and visit-list-item, create `visit-form/` and `visit-list-item/` subfolders)
- Components use the Angular 21 naming convention (`app.ts` instead of `app.component.ts`)
- Styles written in SCSS
- Feature-based folder structure: `feature-name/{component,service,store,model,routes}`
- Each component in separate subfolders with individual files: `component-name.ts`, `component-name.html`, `component-name.scss`
- UI components (shared/ui) must each have their own folder: `button/`, `card/`, `rating-display/`, etc.
- All components use OnPush change detection
- API calls through services, never directly in components
- Barrel exports (index.ts) for every folder: feature folders, component folders, and ui components
- Use informative, descriptive variable names that convey intent and purpose (avoid single-letter or vague names like `data`, `tmp`, `x`)

## Barrel Exports (`index.ts`)

**Allowed locations** (public APIs only):
- `shared/` — Exports shared utilities and components
- `features/<feature>/` — Exports feature public API
- Library/module public API boundaries

**Do NOT create barrels for:**
- Individual component folders (internal implementation)
- Deep nested internal folders
- Every folder by default

**Examples:**
```ts
// ✓ ALLOWED: shared/ui/index.ts (public API)
export * from './button/button';
export * from './card/card';
export * from './rating-input/rating-input';
export * from './rating-display/rating-display';

// ✓ ALLOWED: features/restaurants/index.ts (feature public API)
export * from './routes';
export { RestaurantService } from './service/restaurant.service';

// ✗ NOT ALLOWED: features/restaurants/component/index.ts
// This is internal implementation — use direct imports instead

// ✓ PREFERRED: Direct import for internal code
import { RestaurantListComponent } from './component/restaurant-list/restaurant-list';

// ✗ AVOID: Importing from internal barrel
import { RestaurantListComponent } from './component';
```

**Rule of thumb:** Treat barrels as public APIs only. Internal implementation code should use direct imports.
