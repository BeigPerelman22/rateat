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
    app.ts           # Root component
    app.config.ts    # App configuration
  main.ts            # Bootstrap entry point
  styles.scss        # Global styles
  index.html         # HTML shell
public/              # Static assets
```

## Conventions
- Components use the Angular 21 naming convention (`app.ts` instead of `app.component.ts`)
- Styles written in SCSS
- Feature-based folder structure: feature-name/{component,service,store,model,routes}
- All components use OnPush change detection
- API calls through services, never directly in components
- Barrel exports (index.ts) for every feature folder
