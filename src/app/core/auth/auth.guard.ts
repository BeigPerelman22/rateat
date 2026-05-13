import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';
import { filter, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = await firstValueFrom(
    auth.firebaseUser$.pipe(
      filter((u) => u !== undefined),
      take(1),
    ),
  );

  if (user) return true;
  return router.createUrlTree(['/login']);
};

export const unauthGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = await firstValueFrom(
    auth.firebaseUser$.pipe(
      filter((u) => u !== undefined),
      take(1),
    ),
  );

  if (!user) return true;
  return router.createUrlTree(['/restaurants']);
};
