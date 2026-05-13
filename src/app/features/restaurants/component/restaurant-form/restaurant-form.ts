import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { RestaurantStore } from '../../store/restaurant.store';
import { PartnerStore } from '../../../partners';
import { ButtonComponent } from '../../../../shared/ui';
import { Restaurant } from '../../model/restaurant.model';

@Component({
  selector: 'app-restaurant-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, ButtonComponent],
  templateUrl: './restaurant-form.html',
})
export class RestaurantFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private restaurantStore = inject(RestaurantStore);
  protected partnerStore = inject(PartnerStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    cuisine: [''],
    address: [''],
  });

  protected tagsInput = '';
  protected selectedPartnerIds = signal<Set<string>>(new Set());
  protected isSaving = signal(false);
  protected saveError = signal<string | null>(null);
  protected editingRestaurantId = signal<string | null>(null);
  protected isEditing = () => this.editingRestaurantId() !== null;
  protected cancelNavigationTarget = () =>
    this.isEditing() ? ['/restaurants', this.editingRestaurantId()] : ['/restaurants'];

  async ngOnInit() {
    const restaurantId = this.route.snapshot.paramMap.get('id');
    if (!restaurantId) return;
    this.editingRestaurantId.set(restaurantId);
    try {
      const restaurant = await firstValueFrom(this.restaurantStore.watchOne(restaurantId));
      if (!restaurant) return;
      this.populateFrom(restaurant);
    } catch {
      this.saveError.set('Could not load restaurant.');
    }
  }

  private populateFrom(restaurant: Restaurant) {
    this.form.patchValue({
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      address: restaurant.address,
    });
    this.tagsInput = restaurant.tags.join(', ');
    this.selectedPartnerIds.set(new Set(restaurant.sharedWith));
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
    const { name, cuisine, address } = this.form.getRawValue();
    const restaurantFormData = {
      name,
      cuisine,
      address,
      tags: this.tagsInput.split(',').map((tag) => tag.trim()).filter(Boolean),
      sharedWith: Array.from(this.selectedPartnerIds()),
    };
    try {
      const restaurantId = this.editingRestaurantId();
      if (restaurantId) {
        await this.restaurantStore.update(restaurantId, restaurantFormData);
        await this.router.navigate(['/restaurants', restaurantId]);
      } else {
        const newRestaurantRef = await this.restaurantStore.create(restaurantFormData);
        await this.router.navigate(['/restaurants', newRestaurantRef.id]);
      }
    } catch (e) {
      this.saveError.set((e as Error).message ?? 'Could not save.');
    } finally {
      this.isSaving.set(false);
    }
  }

  async remove() {
    const restaurantId = this.editingRestaurantId();
    if (!restaurantId) return;
    if (!confirm('Delete this restaurant and all its visits?')) return;
    this.isSaving.set(true);
    try {
      await this.restaurantStore.remove(restaurantId);
      await this.router.navigateByUrl('/restaurants');
    } catch (e) {
      this.saveError.set((e as Error).message ?? 'Could not delete.');
      this.isSaving.set(false);
    }
  }
}
