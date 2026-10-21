import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Logo bar shown at the top of every screen. Home (module 7) projects its
 * extra nav content (user dropdown, search) into the right-side slot.
 */
@Component({
  selector: 'app-header',
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHeaderComponent {}
