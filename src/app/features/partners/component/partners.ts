import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PartnerStore } from '../store/partner.store';
import { AuthStore } from '../../../core/auth';
import { ButtonComponent, CardComponent } from '../../../shared/ui';
import { Partner } from '../model/partner.model';

@Component({
  selector: 'app-partners',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ButtonComponent, CardComponent],
  templateUrl: './partners.html',
  styleUrl: './partners.scss',
})
export class PartnersComponent {
  protected partnerStore = inject(PartnerStore);
  private authStore = inject(AuthStore);

  protected emailInput = '';
  protected isSubmitting = signal(false);
  protected statusMessage = signal<string | null>(null);
  protected isErrorMessage = signal(false);

  async addPartner() {
    const normalizedEmail = this.emailInput.trim().toLowerCase();
    if (!normalizedEmail) return;
    const currentUser = this.authStore.appUser();
    if (!currentUser) return;
    if (normalizedEmail === currentUser.email.toLowerCase()) {
      this.setStatusMessage("That's your own email.", true);
      return;
    }
    const isAlreadyLinked = currentUser.partners.some(
      (existingPartner) => existingPartner.email.toLowerCase() === normalizedEmail,
    );
    if (isAlreadyLinked) {
      this.setStatusMessage('Already linked to that partner.', true);
      return;
    }

    this.isSubmitting.set(true);
    this.statusMessage.set(null);
    try {
      const foundPartner = await this.partnerStore.findByEmail(normalizedEmail);
      if (!foundPartner) {
        this.setStatusMessage(
          'No user found with that email. They need to sign in at least once first.',
          true,
        );
        return;
      }
      await this.partnerStore.add(foundPartner);
      this.emailInput = '';
      this.setStatusMessage(`Linked with ${foundPartner.displayName}.`, false);
    } catch (caughtError) {
      this.setStatusMessage((caughtError as Error).message ?? 'Could not link partner.', true);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async removePartner(partnerToRemove: Partner) {
    this.statusMessage.set(null);
    try {
      await this.partnerStore.remove(partnerToRemove);
      this.setStatusMessage(`Unlinked ${partnerToRemove.displayName}.`, false);
    } catch (caughtError) {
      this.setStatusMessage((caughtError as Error).message ?? 'Could not unlink partner.', true);
    }
  }

  private setStatusMessage(messageText: string, isError: boolean) {
    this.statusMessage.set(messageText);
    this.isErrorMessage.set(isError);
  }
}
