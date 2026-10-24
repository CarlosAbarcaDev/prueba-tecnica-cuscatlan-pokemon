import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const DUI_PATTERN = /^(\d{8})-(\d)$/;
const CHECK_DIGIT_WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2];

/** Computes the Salvadoran DUI check digit from its first 8 digits (mod-10 weighted sum). */
function computeDuiCheckDigit(digits: string): number {
  const sum = digits
    .split('')
    .reduce((total, digit, index) => total + Number(digit) * CHECK_DIGIT_WEIGHTS[index], 0);
  const remainder = sum % 10;
  return remainder === 0 ? 0 : 10 - remainder;
}

/** Validates the Salvadoran DUI format and check digit: 8 digits, a hyphen, and a matching check digit (e.g. 04341130-5). */
export const duiFormatValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value as string | null;
  if (!value) {
    return null;
  }
  const match = DUI_PATTERN.exec(value);
  if (!match) {
    return { duiFormat: true };
  }
  const [, digits, checkDigit] = match;
  return computeDuiCheckDigit(digits) === Number(checkDigit) ? null : { duiFormat: true };
};
