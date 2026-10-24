import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The yellow rounded card shell reused by the photo-upload step and the
 * read-only trainer review card — same shape, different projected content.
 */
@Component({
  selector: 'app-card-shell',
  templateUrl: './card-shell.html',
  styleUrl: './card-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardShellComponent {}
