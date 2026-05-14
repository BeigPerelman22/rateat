import { Injectable, inject } from '@angular/core';
import { of } from 'rxjs';
import { AuthStore } from '../../../core/auth';
import { ItemService } from '../service/item.service';
import { Item, ItemFormValue } from '../model/item.model';

@Injectable({ providedIn: 'root' })
export class ItemStore {
  private svc = inject(ItemService);
  private auth = inject(AuthStore);

  watchByCategory(categoryId: string) {
    const uid = this.auth.uid();
    if (!uid) return of<Item[]>([]);
    return this.svc.watchByCategory(categoryId, uid);
  }

  watchOne(id: string) {
    return this.svc.watchOne(id);
  }

  create(categoryId: string, input: ItemFormValue) {
    const uid = this.auth.uid();
    if (!uid) throw new Error('Not authenticated');
    return this.svc.create(categoryId, uid, input);
  }

  update(id: string, input: ItemFormValue) {
    const uid = this.auth.uid();
    if (!uid) throw new Error('Not authenticated');
    return this.svc.update(id, uid, input);
  }

  remove(id: string) {
    return this.svc.remove(id);
  }

  isOwner(item: Pick<Item, 'ownerId'> | null | undefined): boolean {
    return !!item && item.ownerId === this.auth.uid();
  }
}
