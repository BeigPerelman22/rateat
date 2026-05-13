import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { RestaurantStore } from '../store/restaurant.store';
import { AuthStore } from '../../../core/auth';
import {
  ButtonComponent,
  CardComponent,
  RatingDisplayComponent,
} from '../../../shared/ui';
import { VisitStore } from '../../visits/store/visit.store';
import { VisitListItemComponent } from '../../visits/component/visit-list-item';

@Component({
  selector: 'app-restaurant-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    ButtonComponent,
    CardComponent,
    RatingDisplayComponent,
    VisitListItemComponent,
  ],
  templateUrl: './restaurant-detail.html',
})
export class RestaurantDetailComponent {
  readonly restaurantId = input.required<string>({ alias: 'id' });

  private restaurantStore = inject(RestaurantStore);
  private authStore = inject(AuthStore);
  private visitStore = inject(VisitStore);

  protected restaurantData = toSignal(
    toObservable(this.restaurantId).pipe(switchMap((id) => this.restaurantStore.watchOne(id))),
  );

  protected restaurantVisits = toSignal(
    toObservable(this.restaurantId).pipe(switchMap((id) => this.visitStore.watchByRestaurant(id))),
    { initialValue: [] },
  );

  protected canEdit = computed(() => {
    const currentRestaurant = this.restaurantData();
    return !!currentRestaurant && currentRestaurant.ownerId === this.authStore.uid();
  });
}
