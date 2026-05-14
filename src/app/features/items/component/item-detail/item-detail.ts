import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ItemStore } from '../../store/item.store';
import { AuthStore } from '../../../../core/auth';
import { ButtonComponent, CardComponent, RatingDisplayComponent } from '../../../../shared/ui';
import { CategoryStore } from '../../../categories/store/category.store';
import { RatingStore } from '../../../ratings/store/rating.store';
import { RatingListItemComponent } from '../../../ratings/component/rating-list-item/rating-list-item';

@Component({
  selector: 'app-item-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    ButtonComponent,
    CardComponent,
    RatingDisplayComponent,
    RatingListItemComponent,
  ],
  templateUrl: './item-detail.html',
  styleUrl: './item-detail.scss',
})
export class ItemDetailComponent {
  readonly itemId = input.required<string>();
  readonly categoryId = input.required<string>();

  protected itemStore = inject(ItemStore);
  protected authStore = inject(AuthStore);
  protected categoryStore = inject(CategoryStore);
  protected ratingStore = inject(RatingStore);

  protected itemData = toSignal(
    toObservable(this.itemId).pipe(switchMap((id) => this.itemStore.watchOne(id))),
  );

  protected categoryData = toSignal(
    toObservable(this.categoryId).pipe(switchMap((id) => this.categoryStore.watchOne(id))),
  );

  protected ratingsError = signal<string | null>(null);

  protected itemRatings = toSignal(
    combineLatest([toObservable(this.itemId), toObservable(this.authStore.uid)]).pipe(
      switchMap(([itemId, uid]) => (uid ? this.ratingStore.watchByItem(itemId) : of([]))),
      catchError((err) => {
        console.error('[ItemDetail] ratings query failed:', err);
        this.ratingsError.set('Could not load ratings. Please try refreshing the page.');
        return of([]);
      }),
    ),
    { initialValue: [] },
  );

  protected canEdit = computed(() => {
    const currentItem = this.itemData();
    return !!currentItem && this.itemStore.isOwner(currentItem);
  });
}
