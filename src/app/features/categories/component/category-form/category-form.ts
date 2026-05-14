import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CategoryStore } from '../../store/category.store';
import { PartnerStore } from '../../../partners';
import { ButtonComponent } from '../../../../shared/ui';
import { RatingParameter } from '../../model/category.model';
import { ParameterEditorComponent } from '../parameter-editor/parameter-editor';

@Component({
  selector: 'app-category-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, ParameterEditorComponent],
  templateUrl: './category-form.html',
})
export class CategoryFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private categoryStore = inject(CategoryStore);
  protected partnerStore = inject(PartnerStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
  });

  protected parameters = signal<RatingParameter[]>([]);
  protected allowMultipleRatings = signal<boolean>(false);
  protected selectedPartnerIds = signal<Set<string>>(new Set());
  protected isSaving = signal(false);
  protected saveError = signal<string | null>(null);
  protected editingCategoryId = signal<string | null>(null);

  protected isEditing = () => this.editingCategoryId() !== null;

  async ngOnInit() {
    const categoryId = this.route.snapshot.paramMap.get('categoryId');
    if (!categoryId) return;
    this.editingCategoryId.set(categoryId);
    const existing = await firstValueFrom(this.categoryStore.watchOne(categoryId));
    if (existing) {
      this.form.patchValue({ name: existing.name });
      this.parameters.set(existing.parameters);
      this.allowMultipleRatings.set(existing.allowMultipleRatings);
      this.selectedPartnerIds.set(new Set(existing.sharedWith));
    }
  }

  togglePartner(uid: string) {
    const updated = new Set(this.selectedPartnerIds());
    if (updated.has(uid)) updated.delete(uid);
    else updated.add(uid);
    this.selectedPartnerIds.set(updated);
  }

  async submit() {
    if (this.form.invalid) return;
    this.isSaving.set(true);
    this.saveError.set(null);
    try {
      const categoryId = this.editingCategoryId();
      const formData = {
        ...this.form.getRawValue(),
        parameters: this.parameters(),
        allowMultipleRatings: this.allowMultipleRatings(),
        sharedWith: Array.from(this.selectedPartnerIds()),
      };
      if (categoryId) {
        await this.categoryStore.update(categoryId, formData);
        await this.router.navigate(['/categories', categoryId]);
      } else {
        const ref = await this.categoryStore.create(formData);
        await this.router.navigate(['/categories', ref.id]);
      }
    } catch (e) {
      this.saveError.set((e as Error).message ?? 'Could not save.');
    } finally {
      this.isSaving.set(false);
    }
  }

  async remove() {
    const categoryId = this.editingCategoryId();
    if (!categoryId || !confirm('Delete this category?')) return;
    this.isSaving.set(true);
    try {
      await this.categoryStore.remove(categoryId);
      await this.router.navigateByUrl('/categories');
    } catch (e) {
      this.saveError.set((e as Error).message ?? 'Could not delete.');
      this.isSaving.set(false);
    }
  }
}
