import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../../core/auth';
import { ButtonComponent } from '../../../shared/ui';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private authStore = inject(AuthStore);
  private router = inject(Router);

  protected isSigningIn = signal(false);
  protected signInErrorMessage = signal<string | null>(null);

  async signIn() {
    this.isSigningIn.set(true);
    this.signInErrorMessage.set(null);
    try {
      await this.authStore.signInWithGoogle();
      await this.router.navigateByUrl('/restaurants');
    } catch (caughtError) {
      const firebaseError = caughtError as { code?: string; message?: string };
      const isUserCancellation =
        firebaseError.code === 'auth/popup-closed-by-user' ||
        firebaseError.code === 'auth/cancelled-popup-request';
      if (isUserCancellation) {
        this.signInErrorMessage.set(null);
      } else {
        this.signInErrorMessage.set(firebaseError.message ?? 'Sign-in failed. Try again.');
      }
    } finally {
      this.isSigningIn.set(false);
    }
  }
}
