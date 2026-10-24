import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  forwardRef,
  inject,
  input,
  signal
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { parseIsoDateLocal } from '../../../core/utils/age.util';
import { IconComponent } from '../../atoms/icon/icon';

const WEEKDAY_INITIALS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
];
const MONTH_ABBREVIATIONS = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sept',
  'Oct',
  'Nov',
  'Dic'
];

interface DayCell {
  date: Date;
  day: number;
  inCurrentMonth: boolean;
  disabled: boolean;
}

function noop(): void {
  /* intentionally empty default CVA callback */
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Custom calendar field (day grid + a year-list shortcut) replacing the
 * native <input type="date">, whose popup can't be restyled. CVA value is
 * an ISO date string (yyyy-MM-dd).
 */
@Component({
  selector: 'app-date-picker',
  imports: [IconComponent],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ]
})
export class DatePickerComponent implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly label = input.required<string>();
  readonly required = input(false);

  protected readonly monthNames = MONTH_NAMES;
  protected readonly weekdayInitials = WEEKDAY_INITIALS;

  protected value: string | null = null;
  protected disabled = false;
  protected isOpen = false;
  protected panelMode: 'days' | 'years' = 'days';

  private readonly today = new Date();
  private readonly todayMidnight = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
  private readonly maxYearMonth = this.today.getFullYear() * 12 + this.today.getMonth();

  protected readonly viewYear = signal(this.today.getFullYear());
  protected readonly viewMonth = signal(this.today.getMonth());

  protected readonly monthLabel = computed(() => `${this.monthNames[this.viewMonth()]} ${this.viewYear()}`);

  // Birth dates can never be in the future, so "next month"/future days stay
  // disabled instead of letting the picker produce a negative age.
  protected readonly isNextMonthDisabled = computed(
    () => this.viewYear() * 12 + this.viewMonth() >= this.maxYearMonth
  );

  protected readonly days = computed<DayCell[]>(() => {
    const year = this.viewYear();
    const month = this.viewMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: DayCell[] = [];
    const makeCell = (date: Date, day: number, inCurrentMonth: boolean): DayCell => ({
      date,
      day,
      inCurrentMonth,
      disabled: date.getTime() > this.todayMidnight.getTime()
    });

    for (let i = startOffset - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      cells.push(makeCell(new Date(year, month - 1, day), day, false));
    }
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(makeCell(new Date(year, month, day), day, true));
    }
    while (cells.length % 7 !== 0) {
      const day = cells.length - (startOffset + daysInMonth) + 1;
      cells.push(makeCell(new Date(year, month + 1, day), day, false));
    }

    return cells;
  });

  protected readonly years = computed(() => {
    const current = this.today.getFullYear();
    return Array.from({ length: 101 }, (_, i) => current - i);
  });

  private onChange: (value: string | null) => void = noop;
  private onTouched: () => void = noop;

  writeValue(value: string | null): void {
    this.value = value;
    if (value) {
      const parsed = parseIsoDateLocal(value);
      this.viewYear.set(parsed.getFullYear());
      this.viewMonth.set(parsed.getMonth());
    }
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

  protected formatDisplay(iso: string): string {
    const date = parseIsoDateLocal(iso);
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${MONTH_ABBREVIATIONS[date.getMonth()]}/${date.getFullYear()}`;
  }

  protected togglePanel(): void {
    if (this.disabled) {
      return;
    }
    this.isOpen = !this.isOpen;
    this.panelMode = 'days';
  }

  protected closePanel(): void {
    this.isOpen = false;
    this.onTouched();
  }

  @HostListener('document:click', ['$event'])
  protected handleDocumentClick(event: MouseEvent): void {
    if (this.isOpen && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closePanel();
    }
  }

  protected toggleYearPicker(event: Event): void {
    event.stopPropagation();
    this.panelMode = this.panelMode === 'days' ? 'years' : 'days';
  }

  protected goToPreviousMonth(event: Event): void {
    event.stopPropagation();
    this.shiftMonth(-1);
  }

  protected goToNextMonth(event: Event): void {
    event.stopPropagation();
    this.shiftMonth(1);
  }

  protected selectYear(year: number, event: Event): void {
    event.stopPropagation();
    const month = year * 12 + this.viewMonth() > this.maxYearMonth ? this.today.getMonth() : this.viewMonth();
    this.viewYear.set(year);
    this.viewMonth.set(month);
    this.panelMode = 'days';
  }

  protected selectDay(cell: DayCell, event: Event): void {
    event.stopPropagation();
    if (cell.disabled) {
      return;
    }
    if (!cell.inCurrentMonth) {
      this.viewYear.set(cell.date.getFullYear());
      this.viewMonth.set(cell.date.getMonth());
    }
    this.value = toIsoDate(cell.date);
    this.onChange(this.value);
    this.isOpen = false;
  }

  protected isSelected(cell: DayCell): boolean {
    return !!this.value && toIsoDate(cell.date) === this.value;
  }

  private shiftMonth(delta: number): void {
    let month = this.viewMonth() + delta;
    let year = this.viewYear();
    if (month < 0) {
      month = 11;
      year -= 1;
    } else if (month > 11) {
      month = 0;
      year += 1;
    }
    if (year * 12 + month > this.maxYearMonth) {
      year = this.today.getFullYear();
      month = this.today.getMonth();
    }
    this.viewMonth.set(month);
    this.viewYear.set(year);
  }
}
