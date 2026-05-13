import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RestaurantStore } from '../../store/restaurant.store';
import { AuthStore } from '../../../../core/auth';
import { ButtonComponent, RatingDisplayComponent } from '../../../../shared/ui';

type RestaurantFilter = 'all' | 'mine' | 'shared';

@Component({
  selector: 'app-restaurant-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonComponent, RatingDisplayComponent],
  templateUrl: './restaurant-list.html',
})
export class RestaurantListComponent {
  protected restaurantStore = inject(RestaurantStore);
  private authStore = inject(AuthStore);

  protected selectedFilter = signal<RestaurantFilter>('all');
  protected filterOptions = [
    { key: 'all' as const, label: 'All' },
    { key: 'mine' as const, label: 'Mine' },
    { key: 'shared' as const, label: 'Shared' },
  ];

  protected visibleRestaurants = computed(() => {
    const currentUserId = this.authStore.uid();
    const allRestaurants = this.restaurantStore.list();
    switch (this.selectedFilter()) {
      case 'mine':
        return allRestaurants.filter((restaurant) => restaurant.ownerId === currentUserId);
      case 'shared':
        return allRestaurants.filter((restaurant) => restaurant.ownerId !== currentUserId);
      default:
        return allRestaurants;
    }
  });

  protected isOwnedByCurrentUser(restaurant: { ownerId: string }): boolean {
    return restaurant.ownerId === this.authStore.uid();
  }
}
