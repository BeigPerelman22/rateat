import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ItemStore } from '../../store/item.store';
import { PartnerStore } from '../../../partners';
import { ButtonComponent } from '../../../../shared/ui';

@Component({
  selector: 'app-item-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, ButtonComponent],
  templateUrl: './item-form.html',
  styleUrl: './item-form.scss',
})
export class ItemFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  protected itemStore = inject(ItemStore);
  protected partnerStore = inject(PartnerStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
  });

  protected tagsInput = '';
  protected selectedPartnerIds = signal<Set<string>>(new Set());
  protected isSaving = signal(false);
  protected saveError = signal<string | null>(null);
  protected editingItemId = signal<string | null>(null);
  protected isEditing = () => this.editingItemId() !== null;

  protected categoryId =
    this.route.snapshot.paramMap.get('categoryId') ??
    this.route.parent?.snapshot.paramMap.get('categoryId') ??
    '';

  protected cancelNavigationTarget = () =>
    this.isEditing()
      ? ['/categories', this.categoryId, 'items', this.editingItemId()]
      : ['/categories', this.categoryId];

  async ngOnInit() {
    const itemId = this.route.snapshot.paramMap.get('itemId');
    if (!itemId) return;
    this.editingItemId.set(itemId);
    try {
      const existingItem = await firstValueFrom(this.itemStore.watchOne(itemId));
      if (!existingItem) return;
      this.form.patchValue({ name: existingItem.name });
      this.tagsInput = existingItem.tags.join(', ');
      this.selectedPartnerIds.set(new Set(existingItem.sharedWith));
    } catch {
      this.saveError.set('Could not load item.');
    }
  }

  togglePartner(partnerUid: string) {
    const updatedPartnerIds = new Set(this.selectedPartnerIds());
    if (updatedPartnerIds.has(partnerUid)) updatedPartnerIds.delete(partnerUid);
    else updatedPartnerIds.add(partnerUid);
    this.selectedPartnerIds.set(updatedPartnerIds);
  }

  async submit() {
    if (this.form.invalid) return;
    this.isSaving.set(true);
    this.saveError.set(null);
    const { name } = this.form.getRawValue();
    const itemFormData = {
      name,
      tags: this.tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      sharedWith: Array.from(this.selectedPartnerIds()),
    };
    try {
      const currentItemId = this.editingItemId();
      if (currentItemId) {
        await this.itemStore.update(currentItemId, itemFormData);
        await this.router.navigate(['/categories', this.categoryId, 'items', currentItemId]);
      } else {
        const newItemId = await this.itemStore.create(this.categoryId, itemFormData);
        await this.router.navigate(['/categories', this.categoryId, 'items', newItemId]);
      }
    } catch (e) {
      this.saveError.set((e as Error).message ?? 'Could not save.');
    } finally {
      this.isSaving.set(false);
    }
  }

  async remove() {
    const currentItemId = this.editingItemId();
    if (!currentItemId) return;
    if (!confirm('Delete this item and all its ratings?')) return;
    this.isSaving.set(true);
    try {
      await this.itemStore.remove(currentItemId);
      await this.router.navigate(['/categories', this.categoryId]);
    } catch (e) {
      this.saveError.set((e as Error).message ?? 'Could not delete.');
      this.isSaving.set(false);
    }
  }
}
