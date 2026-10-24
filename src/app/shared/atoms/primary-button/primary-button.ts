import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** CTA button used across the onboarding wizard (Continuar / Guardar). */
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
