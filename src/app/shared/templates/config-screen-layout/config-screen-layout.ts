import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AppHeaderComponent } from '../../organisms/app-header/app-header';

/**
 * Page-level template (Atomic Design) for every "Configuración" screen:
 * header, back arrow + heading + subtitle, then a two-column row with a
 * projected left card and right content. Reused by the profile step and,
 * from module 6 on, the Pokémon-selection step — only what each slot
 * projects changes between them.
 */
@Component({
  selector: 'app-config-screen-layout',
  imports: [AppHeaderComponent],
  templateUrl: './config-screen-layout.html',
  styleUrl: './config-screen-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigScreenLayoutComponent {
  readonly heading = input.required<string>();
  readonly subtitle = input('');
}
