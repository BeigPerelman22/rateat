import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { RatingStore } from '../../store/rating.store';
import { CategoryStore, RatingParameter } from '../../../categories';
import { ButtonComponent, RatingInputComponent } from '../../../../shared/ui';
import { RatingFormValue } from '../../model/rating.model';

@Component({
  selector: 'app-rating-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ButtonComponent, RatingInputComponent],
  templateUrl: './rating-form.html',
  styleUrl: './rating-form.scss',
})
export class RatingFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private ratingStore = inject(RatingStore);
  private categoryStore = inject(CategoryStore);
  private router = inject(Router);

  readonly itemId = input.required<string>();
  readonly categoryId = input.required<string>();
  readonly ratingId = input<string>();

  protected form = this.formBuilder.nonNullable.group({
    ratedAt: [this.todayAsInputDate(), Validators.required],
    overall: [0, [Validators.required, Validators.min(0)]],
    review: [''],
  });

  protected isSaving = signal(false);
  protected saveError = signal<string | null>(null);
  protected editingRatingId = signal<string | null>(null);
  protected categoryParameters = signal<RatingParameter[]>([]);
  protected allowMultipleRatings = signal<boolean>(false);
  protected ratingMethod = signal<'5star' | '10point'>('5star');

  protected isEditing = () => this.editingRatingId() !== null;

  async ngOnInit() {
    const category = await firstValueFrom(this.categoryStore.watchOne(this.categoryId()));
    if (category) {
      this.categoryParameters.set(category.parameters);
      this.allowMultipleRatings.set(category.allowMultipleRatings);
      this.ratingMethod.set(category.ratingMethod ?? '5star');
      for (const param of category.parameters) {
        (this.form as any).addControl(param.id, this.formBuilder.nonNullable.control(0));
      }
    }

    const currentRatingId = this.ratingId();
    if (!currentRatingId) return;
    this.editingRatingId.set(currentRatingId);

    try {
      const existingRating = await firstValueFrom(this.ratingStore.watchOne(currentRatingId));
      if (!existingRating) return;
      this.form.patchValue({
        ratedAt: this.dateToInputValue(existingRating.ratedAt?.toDate() ?? new Date()),
        overall: existingRating.overall,
        review: existingRating.review,
      });
      for (const param of this.categoryParameters()) {
        this.form.get(param.id)?.setValue(existingRating.parameterValues[param.id] ?? 0);
      }
    } catch {
      this.saveError.set('Could not load rating.');
    }
  }

  async submit() {
    if (this.form.invalid || this.isSaving()) return;
    this.isSaving.set(true);
    this.saveError.set(null);

    const formValues = this.form.getRawValue();
    const parameterValues: Record<string, number> = {};
    for (const param of this.categoryParameters()) {
      parameterValues[param.id] =
        ((formValues as Record<string, unknown>)[param.id] as number) ?? 0;
    }

    const ratingFormData: RatingFormValue = {
      ratedAt: new Date(formValues.ratedAt),
      overall: formValues.overall,
      review: formValues.review,
      parameterValues,
    };

    try {
      const currentEditingId = this.editingRatingId();
      if (currentEditingId) {
        await this.ratingStore.update(currentEditingId, ratingFormData);
      } else {
        await this.ratingStore.create(this.itemId(), this.categoryId(), ratingFormData);
      }
      await this.router.navigate(['/categories', this.categoryId(), 'items', this.itemId()]);
    } catch (e) {
      this.saveError.set((e as Error).message ?? 'Could not save rating.');
    } finally {
      this.isSaving.set(false);
    }
  }

  cancel() {
    return this.router.navigate(['/categories', this.categoryId(), 'items', this.itemId()]);
  }

  async remove() {
    const currentEditingId = this.editingRatingId();
    if (!currentEditingId) return;
    if (!confirm('Delete this rating?')) return;
    this.isSaving.set(true);
    try {
      await this.ratingStore.remove(currentEditingId);
      await this.router.navigate(['/categories', this.categoryId(), 'items', this.itemId()]);
    } catch (e) {
      this.saveError.set((e as Error).message ?? 'Could not delete.');
      this.isSaving.set(false);
    }
  }

  private todayAsInputDate(): string {
    return this.dateToInputValue(new Date());
  }

  private dateToInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const dayOfMonth = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${dayOfMonth}`;
  }
}
