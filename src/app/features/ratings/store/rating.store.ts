import { Injectable, inject } from '@angular/core';
import { of } from 'rxjs';
import { AuthStore } from '../../../core/auth';
import { RatingService } from '../service/rating.service';
import { Rating, RatingFormValue } from '../model/rating.model';

@Injectable({ providedIn: 'root' })
export class RatingStore {
  private svc = inject(RatingService);
  private auth = inject(AuthStore);

  watchByItem(itemId: string) {
    const uid = this.auth.uid();
    if (!uid) return of<Rating[]>([]);
    return this.svc.watchByItem(itemId, uid);
  }

  watchOne(id: string) {
    return this.svc.watchOne(id);
  }

  create(itemId: string, categoryId: string, input: RatingFormValue) {
    const uid = this.auth.uid();
    if (!uid) throw new Error('Not authenticated');
    return this.svc.create(itemId, categoryId, uid, input);
  }

  update(id: string, input: RatingFormValue) {
    return this.svc.update(id, input);
  }

  remove(id: string) {
    return this.svc.remove(id);
  }
}
