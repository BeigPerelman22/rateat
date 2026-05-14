import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryStore } from '../../store/category.store';
import { AuthStore } from '../../../../core/auth';
import { ButtonComponent } from '../../../../shared/ui';

type CategoryFilter = 'all' | 'mine' | 'shared';

@Component({
  selector: 'app-category-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonComponent],
  templateUrl: './category-list.html',
})
export class CategoryListComponent {
  protected categoryStore = inject(CategoryStore);
  private authStore = inject(AuthStore);

  protected selectedFilter = signal<CategoryFilter>('all');
  protected filterOptions = [
    { key: 'all' as const, label: 'All' },
    { key: 'mine' as const, label: 'Mine' },
    { key: 'shared' as const, label: 'Shared' },
  ];

  protected visibleCategories = computed(() => {
    const currentUserId = this.authStore.uid();
    const allCategories = this.categoryStore.list();
    switch (this.selectedFilter()) {
      case 'mine':
        return allCategories.filter((category) => category.ownerId === currentUserId);
      case 'shared':
        return allCategories.filter((category) => category.ownerId !== currentUserId);
      default:
        return allCategories;
    }
  });

  protected isOwnedByCurrentUser(category: { ownerId: string }): boolean {
    return category.ownerId === this.authStore.uid();
  }
}
