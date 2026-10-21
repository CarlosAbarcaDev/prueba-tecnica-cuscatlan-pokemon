import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName = 'cloud-upload' | 'trash' | 'user' | 'calendar' | 'chevron-down' | 'search' | 'pokeball';

/**
 * Smallest reusable visual unit for the inline SVG icons the design uses
 * (atom, in Atomic Design terms) — one place to add a new icon instead of
 * copy-pasting an <svg> into every component that needs one.
 */
@Component({
  selector: 'app-icon',
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
  readonly name = input.required<IconName>();
}
