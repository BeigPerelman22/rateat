import { Injectable, computed, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, of, switchMap } from 'rxjs';
import { AuthStore } from '../../../core/auth';
import { RestaurantService } from '../service/restaurant.service';
import { Restaurant, RestaurantFormValue } from '../model/restaurant.model';

@Injectable({ providedIn: 'root' })
export class RestaurantStore {
  private svc = inject(RestaurantService);
  private auth = inject(AuthStore);

  readonly list = toSignal(
    toObservable(this.auth.uid).pipe(
      switchMap((uid) => (uid ? this.svc.watchForUser(uid) : of<Restaurant[]>([]))),
    ),
    { initialValue: [] as Restaurant[] },
  );

  readonly isLoading = computed(() => this.auth.isLoading());

  watchOne(id: string) {
    return this.svc.watchOne(id);
  }

  create(input: RestaurantFormValue) {
    const uid = this.auth.uid();
    if (!uid) throw new Error('Not authenticated');
    return this.svc.create(uid, input);
  }

  update(id: string, input: RestaurantFormValue) {
    const uid = this.auth.uid();
    if (!uid) throw new Error('Not authenticated');
    return this.svc.update(id, uid, input);
  }

  remove(id: string) {
    return this.svc.remove(id);
  }

  isOwner(r: Pick<Restaurant, 'ownerId'> | null | undefined): boolean {
    return !!r && r.ownerId === this.auth.uid();
  }
}
