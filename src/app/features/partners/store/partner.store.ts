import { Injectable, computed, inject } from '@angular/core';
import { AuthStore } from '../../../core/auth';
import { PartnerService } from '../service/partner.service';
import { Partner } from '../model/partner.model';

@Injectable({ providedIn: 'root' })
export class PartnerStore {
  private auth = inject(AuthStore);
  private svc = inject(PartnerService);

  readonly list = computed<Partner[]>(() => this.auth.appUser()?.partners ?? []);
  readonly isLoading = computed(() => this.auth.appUser() === undefined);

  findByEmail(email: string) {
    return this.svc.findUserByEmail(email);
  }

  async add(other: Partner) {
    const me = this.currentMe();
    if (!me || me.uid === other.uid) return;
    await this.svc.linkPartner(me, other);
  }

  async remove(other: Partner) {
    const me = this.currentMe();
    if (!me) return;
    await this.svc.unlinkPartner(me, other);
  }

  private currentMe(): Partner | null {
    const u = this.auth.appUser();
    if (!u) return null;
    return { uid: u.uid, email: u.email, displayName: u.displayName };
  }
}
