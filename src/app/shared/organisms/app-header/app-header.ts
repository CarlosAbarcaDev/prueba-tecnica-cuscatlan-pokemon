import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Logo bar shown at the top of every screen, with a slot for page-specific nav content (e.g. Home's user dropdown and search). */
@Component({
  selector: 'app-header',
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHeaderComponent {}
