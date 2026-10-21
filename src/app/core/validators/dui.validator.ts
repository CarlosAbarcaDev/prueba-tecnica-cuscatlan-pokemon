import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const DUI_PATTERN = /^\d{8}-\d$/;

/** Validates the Salvadoran DUI format: 8 digits, a hyphen, and a check digit (e.g. 04341130-5). */
export const duiFormatValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value as string | null;
  if (!value) {
    return null;
  }
  return DUI_PATTERN.test(value) ? null : { duiFormat: true };
};
