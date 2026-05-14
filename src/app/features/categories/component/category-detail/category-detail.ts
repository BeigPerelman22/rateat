import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { CategoryStore } from '../../store/category.store';
import { AuthStore } from '../../../../core/auth';
import { ButtonComponent, CardComponent, RatingDisplayComponent } from '../../../../shared/ui';
import { ItemStore } from '../../../items/store/item.store';

@Component({
  selector: 'app-category-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonComponent, CardComponent, RatingDisplayComponent],
  templateUrl: './category-detail.html',
})
export class CategoryDetailComponent {
  readonly categoryId = input.required<string>();

  private categoryStore = inject(CategoryStore);
  protected authStore = inject(AuthStore);
  private itemStore = inject(ItemStore);

  protected categoryData = toSignal(
    toObservable(this.categoryId).pipe(switchMap((id) => this.categoryStore.watchOne(id))),
  );

  protected itemsError = signal<string | null>(null);

  protected categoryItems = toSignal(
    combineLatest([toObservable(this.categoryId), toObservable(this.authStore.uid)]).pipe(
      switchMap(([catId, uid]) => (uid ? this.itemStore.watchByCategory(catId) : of([]))),
      catchError((err) => {
        console.error('[CategoryDetail] items query failed:', err);
        this.itemsError.set('Could not load items. Please try refreshing the page.');
        return of([]);
      }),
    ),
    { initialValue: [] },
  );

  protected canEdit = computed(() => {
    const currentCategory = this.categoryData();
    return !!currentCategory && currentCategory.ownerId === this.authStore.uid();
  });
}
