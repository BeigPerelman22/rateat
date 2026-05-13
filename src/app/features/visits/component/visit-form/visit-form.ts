import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { VisitStore } from '../../store/visit.store';
import { ButtonComponent, RatingInputComponent } from '../../../../shared/ui';

@Component({
  selector: 'app-visit-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ButtonComponent, RatingInputComponent],
  templateUrl: './visit-form.html',
})
export class VisitFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private visitStore = inject(VisitStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected form = this.formBuilder.nonNullable.group({
    visitedAt: [this.todayAsInputDate(), Validators.required],
    overall: [0, [Validators.required, Validators.min(1)]],
    food: [0],
    service: [0],
    ambiance: [0],
    value: [0],
    notes: [''],
  });

  protected isSaving = signal(false);
  protected saveError = signal<string | null>(null);
  protected editingVisitId = signal<string | null>(null);
  protected isEditing = () => this.editingVisitId() !== null;

  private get restaurantId(): string {
    return (
      this.route.snapshot.paramMap.get('restaurantId') ??
      this.route.parent?.snapshot.paramMap.get('restaurantId') ??
      ''
    );
  }

  async ngOnInit() {
    const visitId = this.route.snapshot.paramMap.get('visitId');
    if (!visitId) return;
    this.editingVisitId.set(visitId);
    try {
      const existingVisit = await firstValueFrom(this.visitStore.watchOne(visitId));
      if (!existingVisit) return;
      this.form.patchValue({
        visitedAt: this.dateToInputValue(existingVisit.visitedAt?.toDate() ?? new Date()),
        overall: existingVisit.overall,
        food: existingVisit.food,
        service: existingVisit.service,
        ambiance: existingVisit.ambiance,
        value: existingVisit.value,
        notes: existingVisit.notes,
      });
    } catch {
      this.saveError.set('Could not load visit.');
    }
  }

  async submit() {
    if (this.form.invalid || !this.restaurantId) return;
    this.isSaving.set(true);
    this.saveError.set(null);
    const formValues = this.form.getRawValue();
    const visitFormData = {
      visitedAt: new Date(formValues.visitedAt),
      overall: formValues.overall,
      food: formValues.food,
      service: formValues.service,
      ambiance: formValues.ambiance,
      value: formValues.value,
      notes: formValues.notes,
    };
    try {
      const currentEditingId = this.editingVisitId();
      if (currentEditingId) {
        await this.visitStore.update(currentEditingId, visitFormData);
      } else {
        await this.visitStore.create(this.restaurantId, visitFormData);
      }
      await this.router.navigate(['/restaurants', this.restaurantId]);
    } catch (e) {
      this.saveError.set((e as Error).message ?? 'Could not save visit.');
    } finally {
      this.isSaving.set(false);
    }
  }

  cancel() {
    return this.router.navigate(['/restaurants', this.restaurantId]);
  }

  async remove() {
    const visitId = this.editingVisitId();
    if (!visitId) return;
    if (!confirm('Delete this visit?')) return;
    this.isSaving.set(true);
    try {
      await this.visitStore.remove(visitId);
      await this.router.navigate(['/restaurants', this.restaurantId]);
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
