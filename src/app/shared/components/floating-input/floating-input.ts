import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextId = 0;

function noop(): void {
  /* intentionally empty default CVA callback */
}

/**
 * Outlined text input with a floating label, matching the Figma input
 * component: the label sits inline as a placeholder until the field is
 * focused or filled, then floats above the border. The CSS relies on the
 * native `:placeholder-shown` pseudo-class (placeholder set to a single
 * space) so no JS state is needed to drive the float.
 */
@Component({
  selector: 'app-floating-input',
  templateUrl: './floating-input.html',
  styleUrl: './floating-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FloatingInputComponent),
      multi: true
    }
  ]
})
export class FloatingInputComponent implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly type = input<'text' | 'date'>('text');
  readonly required = input(false);
  readonly inputId = `floating-input-${nextId++}`;

  protected value = '';
  protected disabled = false;

  /**
   * Optional formatting hook, installed imperatively by a co-located
   * attribute directive (e.g. DuiFormatDirective) rather than passed as a
   * template input — keeps this component generic while letting specific
   * fields opt into input masking.
   */
  valueTransform: ((raw: string) => string) | null = null;

  protected onChange: (value: string) => void = noop;
  protected onTouched: () => void = noop;

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    let value = target.value;
    if (this.valueTransform) {
      value = this.valueTransform(value);
      target.value = value;
    }
    this.value = value;
    this.onChange(value);
  }
}
