import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-rating-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingInputComponent),
      multi: true,
    },
  ],
  templateUrl: './rating-input.html',
  styleUrl: './rating-input.scss',
})
export class RatingInputComponent implements ControlValueAccessor {
  readonly label = input<string>('Rating');
  readonly max = input<number>(5);
  readonly ratingMethod = input<'5star' | '10point'>('5star');

  readonly starOptions = computed(() => Array.from({ length: this.max() }, (_, i) => i + 1));

  readonly selectedValue = signal<number>(0);
  readonly hoveredValue = signal<number>(0);
  readonly isDisabled = signal<boolean>(false);

  protected displayedValue = () => this.hoveredValue() || this.selectedValue();

  private notifyValueChange: (newValue: number) => void = () => {};
  protected notifyTouched: () => void = () => {};

  selectRating(value: number) {
    if (this.isDisabled()) return;
    this.selectedValue.set(value);
    this.notifyValueChange(value);
    this.notifyTouched();
  }

  selectRatingFromInput(rawValue: string) {
    const parsed = parseFloat(rawValue);
    const clamped = isNaN(parsed) ? 0 : Math.min(Math.max(parsed, 0), this.max());
    this.selectRating(clamped);
  }

  writeValue(incomingValue: number | null): void {
    const clampedValue = Math.min(incomingValue ?? 0, this.max());
    this.selectedValue.set(clampedValue);
  }
  registerOnChange(changeHandler: (newValue: number) => void): void {
    this.notifyValueChange = changeHandler;
  }
  registerOnTouched(touchedHandler: () => void): void {
    this.notifyTouched = touchedHandler;
  }
  setDisabledState(disabledState: boolean): void {
    this.isDisabled.set(disabledState);
  }
}
