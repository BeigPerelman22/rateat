import { Routes } from '@angular/router';
import { authGuard, unauthGuard } from './core/auth';
import { ShellComponent } from './core/layout';

export const APP_ROUTES: Routes = [
  {
    path: 'login',
    canActivate: [unauthGuard],
    loadChildren: () => import('./features/login').then((m) => m.LOGIN_ROUTES),
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'restaurants' },
      {
        path: 'restaurants',
        loadChildren: () =>
          import('./features/restaurants').then((m) => m.RESTAURANT_ROUTES),
      },
      {
        path: 'restaurants/:restaurantId/visits',
        loadChildren: () =>
          import('./features/visits').then((m) => m.VISIT_ROUTES),
      },
      {
        path: 'partners',
        loadChildren: () =>
          import('./features/partners').then((m) => m.PARTNER_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
