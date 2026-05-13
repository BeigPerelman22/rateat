import {
  ChangeDetectionStrategy,
  Component,
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
  readonly starOptions = [1, 2, 3, 4, 5] as const;

  readonly selectedValue = signal<number>(0);
  readonly hoveredValue = signal<number>(0);
  readonly isDisabled = signal<boolean>(false);

  protected displayedValue = () => this.hoveredValue() || this.selectedValue();

  private notifyValueChange: (newValue: number) => void = () => {};
  private notifyTouched: () => void = () => {};

  selectRating(starNumber: number) {
    if (this.isDisabled()) return;
    this.selectedValue.set(starNumber);
    this.notifyValueChange(starNumber);
    this.notifyTouched();
  }

  writeValue(incomingValue: number | null): void {
    this.selectedValue.set(incomingValue ?? 0);
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
