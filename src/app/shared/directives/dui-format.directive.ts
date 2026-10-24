import { Directive, Input, OnChanges, inject } from '@angular/core';

import { FloatingInputComponent } from '../molecules/floating-input/floating-input';

/** 8 digits, then an automatic hyphen, then the 1-digit check digit (e.g. 04341130-5). */
function formatDui(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 9);
  return digits.length <= 8 ? digits : `${digits.slice(0, 8)}-${digits.slice(8)}`;
}

/**
 * Hooks into the FloatingInputComponent it decorates (same host element) and
 * installs the DUI auto-hyphen transform, so the user never types the dash
 * themselves. `[appDuiFormat]` takes a boolean so the same document field
 * can toggle it on/off as the active document strategy changes — on for
 * AdultDocumentStrategy (DUI), off for MinorDocumentStrategy (carnet de
 * minoridad), which never gets hyphen/format validation.
 */
@Directive({
  selector: '[appDuiFormat]'
})
export class DuiFormatDirective implements OnChanges {
  private readonly host = inject(FloatingInputComponent, { self: true });

  @Input() appDuiFormat = true;

  ngOnChanges(): void {
    this.host.valueTransform = this.appDuiFormat ? formatDui : null;
  }
}
