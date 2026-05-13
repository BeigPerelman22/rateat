import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class ButtonComponent {
  readonly type = input<'button' | 'submit'>('button');
  readonly variant = input<ButtonVariant>('primary');
  readonly disabled = input<boolean>(false);
  readonly full = input<boolean>(false);

  protected buttonClassNames() {
    const baseClassNames =
      'inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed';
    const widthClassName = this.full() ? 'w-full' : '';
    const variantClassNames: Record<ButtonVariant, string> = {
      primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800',
      secondary:
        'border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50',
      ghost: 'text-neutral-600 hover:bg-neutral-100',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    };
    return `${baseClassNames} ${variantClassNames[this.variant()]} ${widthClassName}`.trim();
  }
}
