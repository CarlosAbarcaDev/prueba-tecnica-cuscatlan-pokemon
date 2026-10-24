import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const HOBBY_OPTIONS = [
  'Jugar Fútbol',
  'Jugar Basquetball',
  'Jugar Tennis',
  'Jugar Voleibol',
  'Jugar Fifa',
  'Jugar Videojuegos',
  'Leer',
  'Ver Series',
  'Cocinar',
  'Viajar'
];

let nextId = 0;

function noop(): void {
  /* intentionally empty default CVA callback */
}

/**
 * Favorite-hobby field: a filterable suggestion list that, once a hobby is
 * picked, collapses into a single removable chip. Optional field, so an
 * empty value is valid.
 */
@Component({
  selector: 'app-hobby-select',
  templateUrl: './hobby-select.html',
  styleUrl: './hobby-select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HobbySelectComponent),
      multi: true
    }
  ]
})
export class HobbySelectComponent implements ControlValueAccessor {
  protected readonly inputId = `hobby-select-${nextId++}`;

  protected selected: string | null = null;
  protected query = '';
  protected isOpen = false;
  protected disabled = false;

  private onChange: (value: string | null) => void = noop;
  private onTouched: () => void = noop;

  protected get filteredOptions(): string[] {
    const normalized = this.query.trim().toLowerCase();
    if (!normalized) {
      return HOBBY_OPTIONS;
    }
    return HOBBY_OPTIONS.filter((option) => option.toLowerCase().includes(normalized));
  }

  writeValue(value: string | null): void {
    this.selected = value;
    this.query = '';
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected handleQueryInput(event: Event): void {
    this.query = (event.target as HTMLInputElement).value;
    this.isOpen = true;
  }

  protected openPanel(): void {
    if (!this.disabled) {
      this.isOpen = true;
    }
  }

  protected closePanel(): void {
    this.isOpen = false;
    this.onTouched();
  }

  protected selectOption(option: string, event: Event): void {
    event.preventDefault();
    this.selected = option;
    this.query = '';
    this.isOpen = false;
    this.onChange(option);
  }

  protected clearSelection(): void {
    this.selected = null;
    this.onChange(null);
  }
}
