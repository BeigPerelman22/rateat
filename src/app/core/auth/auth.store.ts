import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private svc = inject(AuthService);

  readonly firebaseUser = toSignal(this.svc.firebaseUser$, { initialValue: undefined });
  readonly appUser = toSignal(this.svc.appUser$, { initialValue: undefined });

  readonly uid = computed(() => this.firebaseUser()?.uid ?? null);
  readonly isAuthenticated = computed(() => !!this.firebaseUser());
  readonly isLoading = computed(() => this.firebaseUser() === undefined);

  signInWithGoogle() {
    return this.svc.signInWithGoogle();
  }

  signOut() {
    return this.svc.signOut();
  }
}
