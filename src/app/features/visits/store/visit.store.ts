import { Injectable, inject } from '@angular/core';
import { AuthStore } from '../../../core/auth';
import { VisitService } from '../service/visit.service';
import { VisitFormValue } from '../model/visit.model';

@Injectable({ providedIn: 'root' })
export class VisitStore {
  private svc = inject(VisitService);
  private auth = inject(AuthStore);

  watchByRestaurant(restaurantId: string) {
    const uid = this.auth.uid();
    if (!uid) return [];
    return this.svc.watchByRestaurant(restaurantId, uid);
  }

  watchOne(id: string) {
    return this.svc.watchOne(id);
  }

  create(restaurantId: string, input: VisitFormValue) {
    const uid = this.auth.uid();
    if (!uid) throw new Error('Not authenticated');
    return this.svc.create(restaurantId, uid, input);
  }

  update(id: string, input: VisitFormValue) {
    return this.svc.update(id, input);
  }

  remove(id: string) {
    return this.svc.remove(id);
  }
}
