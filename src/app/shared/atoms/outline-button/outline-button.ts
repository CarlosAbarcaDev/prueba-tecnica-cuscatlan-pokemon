import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { IconComponent, IconName } from '../icon/icon';

/**
 * Small pill button (navy border, transparent fill, icon + label) used for
 * the "Editar perfil" / "Editar" actions on Home — visually distinct from
 * PrimaryButtonComponent's solid navy CTA style.
 */
@Component({
  selector: 'app-outline-button',
  imports: [IconComponent],
  templateUrl: './outline-button.html',
  styleUrl: './outline-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutlineButtonComponent {
  readonly icon = input.required<IconName>();
  readonly type = input<'button' | 'submit'>('button');
}
