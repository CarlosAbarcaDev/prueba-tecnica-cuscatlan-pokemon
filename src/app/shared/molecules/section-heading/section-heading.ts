import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Title + subtitle pair used at the top of the right-hand column on every
 * "Configuración" screen ("Tu información" / "Pokémon", etc.) — identical
 * styling, different copy, so it is its own molecule instead of being
 * redeclared per page.
 */
@Component({
  selector: 'app-section-heading',
  templateUrl: './section-heading.html',
  styleUrl: './section-heading.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionHeadingComponent {
  readonly heading = input.required<string>();
  readonly subtitle = input<string>('');
}
