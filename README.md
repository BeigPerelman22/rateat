# Rateat

A collaborative restaurant rating and visit tracking app built with Angular 21 and Firebase.

Track where you've eaten, rate your experiences across multiple dimensions, and share restaurants with partners for joint discovery.

## Features

- **Restaurant management** — Add, edit, and browse restaurants with cuisine type, address, and custom tags
- **Multi-dimensional ratings** — Rate visits on overall experience, food, service, ambiance, and value
- **Visit history** — Log every visit with notes and per-visit ratings; restaurants aggregate scores automatically
- **Partner sharing** — Link accounts with friends or a partner to share restaurants and see each other's visits
- **Real-time sync** — All data streams live from Firestore; changes appear instantly across sessions
- **Google Sign-In** — One-click authentication, no password required

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Angular 21 (standalone components, signals) |
| Language | TypeScript 5.9 (strict mode) |
| Styling | Tailwind CSS 3 + SCSS |
| Backend | Firebase (Auth + Firestore) |
| State | Angular Signals + AngularFire |
| Package manager | npm 11 |

## Project Structure

```
src/app/
├── core/
│   ├── auth/          ← Firebase auth service, signal store, route guards
│   └── layout/        ← Shell wrapper + navigation
├── features/
│   ├── restaurants/   ← List, detail, create/edit restaurant
│   ├── visits/        ← Log and edit visits per restaurant
│   └── partners/      ← Search and link partner accounts
└── shared/
    └── ui/            ← Button, Card, RatingInput, RatingDisplay
```

Each feature follows the same slice layout: `component/`, `service/`, `store/`, `model/`, `routes.ts`.

## Getting Started

### Prerequisites

- Node.js 20+
- npm 11+
- A Firebase project with Authentication (Google provider) and Firestore enabled

### Install dependencies

```bash
npm install
```

### Configure Firebase

Update `src/environments/environment.ts` with your Firebase project credentials:

```ts
export const environment = {
  production: false,
  firebase: {
    apiKey: '...',
    authDomain: '...',
    projectId: '...',
    storageBucket: '...',
    messagingSenderId: '...',
    appId: '...',
  },
};
```

### Run the dev server

```bash
npm start
```

Open `http://localhost:4200`. The app reloads automatically on file changes.

### Build for production

```bash
npm run build
```

Artifacts are written to `dist/`.

## Routing

```
/login                              ← Google Sign-In (public)
/restaurants                        ← Restaurant list
/restaurants/new                    ← Add restaurant
/restaurants/:id                    ← Restaurant detail + visit history
/restaurants/:id/edit               ← Edit restaurant
/restaurants/:restaurantId/visits/new          ← Log a visit
/restaurants/:restaurantId/visits/:visitId/edit ← Edit a visit
/partners                           ← Manage partner connections
```

All routes except `/login` require authentication.

## Data Model

**Restaurant** — `ownerId`, `sharedWith[]`, `memberIds[]`, `name`, `cuisine`, `address`, `tags[]`, `latestRating`, `visitCount`

**Visit** — `restaurantId`, `ownerId`, `memberIds[]`, `visitedAt`, `ratings { overall, food, service, ambiance, value }`, `notes`

**User** — `uid`, `email`, `displayName`, `photoURL`, `partners[]`
