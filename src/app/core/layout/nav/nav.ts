import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../../auth';

@Component({
  selector: 'app-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class NavComponent {
  protected authStore = inject(AuthStore);
  private router = inject(Router);

  protected isDropdownOpen = signal(false);
  protected imageLoadError = signal(false);

  toggleDropdown() {
    this.isDropdownOpen.update((open) => !open);
  }

  closeDropdown() {
    this.isDropdownOpen.set(false);
  }

  onImageError() {
    this.imageLoadError.set(true);
  }

  async signOut() {
    this.isDropdownOpen.set(false);
    await this.authStore.signOut();
    await this.router.navigate(['/login']);
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
