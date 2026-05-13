import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-rating-display',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rating-display.html',
  styleUrl: './rating-display.scss',
})
export class RatingDisplayComponent {
  readonly value = input.required<number | null>();
  readonly showMax = input<boolean>(false);

  protected formattedRating = computed(() => {
    const ratingValue = this.value();
    if (ratingValue == null) return '—';
    return Number.isInteger(ratingValue) ? ratingValue.toString() : ratingValue.toFixed(1);
  });

  protected accessibilityLabel = computed(() => {
    const ratingValue = this.value();
    return ratingValue == null ? 'No rating' : `${ratingValue} out of 5`;
  });
}
