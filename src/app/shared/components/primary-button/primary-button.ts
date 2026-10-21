import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * CTA button used across the onboarding wizard (Continuar / Guardar).
 * Visual spec from Figma: navy fill + white text when enabled, light gray
 * fill + muted text when disabled — no hover/active variants were present
 * in the design beyond these two states.
 */
@Component({
  selector: 'app-primary-button',
  templateUrl: './primary-button.html',
  styleUrl: './primary-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimaryButtonComponent {
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
}
