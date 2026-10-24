import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AppHeaderComponent } from '../../organisms/app-header/app-header';

/** Two-column layout shared by the onboarding steps: header, heading/subtitle, then a projected left card and right content. */
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
