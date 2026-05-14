# rateat

## Project Overview
Angular 21 application with standalone components, Signal-based state.

## Tech Stack
- **Framework**: Angular 21
- **Language**: TypeScript 5.9
- **Styling**: SCSS
- **Package Manager**: npm

## Common Commands
See @package.json for root-level scripts.

## Project Structure

```
src/app/
  core/          ← Singleton services, guards, interceptors
  features/      ← Feature-sliced modules (partners/restaurants  )
  shared/        ← Reusable components, pipes, directives
  models/        ← TypeScript interfaces mirroring backend API types
```

## Conventions
- Folder Organization: Each folder should contain max 6-7 files
- Component Subfolders: Always create individual subfolders for each component if a folder contains more than one component (e.g., if a folder has visit-form and visit-list-item, create `visit-form/` and `visit-list-item/` subfolders)
- Components use the Angular 21 naming convention (`app.ts` instead of `app.component.ts`)
- Components are dumb by default - smart logic belongs in services or stores
- CSS: Tailwind utility classes only - no custom CSS unless absolutely necessary
- Feature-based folder structure: `feature-name/{component,service,store,model,routes}`
- Each component in separate subfolders with individual files: `component-name.ts`, `component-name.html`, `component-name.scss`
- UI components (shared/ui) must each have their own folder: `button/`, `card/`, `rating-display/`, etc.
- All components use OnPush change detection
- API calls through services, never directly in components
- Use barrel exports (`index.ts`) only for public APIs and module boundaries (`shared/`, `features/<feature>/`, libraries), avoid barrels for internal/local components or deep nested folders, prefer direct imports for internal implementation, and avoid nested barrels/circular dependencies.
- Use informative, descriptive variable names that convey intent and purpose (avoid single-letter or vague names like `data`, `tmp`, `x`)
