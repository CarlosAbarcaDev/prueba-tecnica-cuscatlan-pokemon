import { ValidatorFn, Validators } from '@angular/forms';

import { DocumentKind } from '../models/trainer.model';
import { duiFormatValidator } from '../validators/dui.validator';

/**
 * Strategy pattern: each document kind owns its own label, required-ness
 * and format validation, instead of branching on age throughout the
 * profile form. `resolveDocumentStrategy` is the single decision point.
 */
export interface DocumentStrategy {
  readonly kind: DocumentKind;
  readonly label: string;
  readonly required: boolean;
  /** Only the DUI strategy enforces a format (and the auto-hyphen directive). */
  readonly autoFormat: boolean;
  readonly validators: ValidatorFn[];
}

export const ADULT_DOCUMENT_STRATEGY: DocumentStrategy = {
  kind: 'dui',
  label: 'DUI',
  required: true,
  autoFormat: true,
  validators: [Validators.required, duiFormatValidator]
};

export const MINOR_DOCUMENT_STRATEGY: DocumentStrategy = {
  kind: 'minority-card',
  label: 'Carnet de Minoridad',
  required: false,
  autoFormat: false,
  validators: []
};

export function resolveDocumentStrategy(age: number): DocumentStrategy {
  return age >= 18 ? ADULT_DOCUMENT_STRATEGY : MINOR_DOCUMENT_STRATEGY;
}
