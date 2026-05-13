import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../auth';

@Component({
  selector: 'app-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class NavComponent {
  protected authStore = inject(AuthStore);

  signOut() {
    return this.authStore.signOut();
  }

  buildInitials(displayName: string): string {
    return displayName
      .split(/\s+/)
      .map((namePart) => namePart[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
