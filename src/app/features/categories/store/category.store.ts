import { Injectable, computed, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { AuthStore } from '../../../core/auth';
import { CategoryService } from '../service/category.service';
import { Category, CategoryFormValue } from '../model/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryStore {
  private svc = inject(CategoryService);
  private auth = inject(AuthStore);

  readonly list = toSignal(
    toObservable(this.auth.uid).pipe(
      switchMap((uid) => (uid ? this.svc.watchForUser(uid) : of<Category[]>([]))),
    ),
    { initialValue: [] as Category[] },
  );

  readonly isLoading = computed(() => this.auth.isLoading());

  watchOne(id: string) {
    return this.svc.watchOne(id);
  }

  create(input: CategoryFormValue) {
    const uid = this.auth.uid();
    if (!uid) throw new Error('Not authenticated');
    return this.svc.create(uid, input);
  }

  update(id: string, input: CategoryFormValue) {
    const uid = this.auth.uid();
    if (!uid) throw new Error('Not authenticated');
    return this.svc.update(id, uid, input);
  }

  remove(id: string) {
    return this.svc.remove(id);
  }

  isOwner(category: Pick<Category, 'ownerId'> | null | undefined): boolean {
    return !!category && category.ownerId === this.auth.uid();
  }
}
