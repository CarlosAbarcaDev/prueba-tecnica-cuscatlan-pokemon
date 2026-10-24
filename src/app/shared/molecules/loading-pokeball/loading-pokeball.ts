import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Loading screen animation: a pokéball that opens and closes in a loop
 * while "rain" falls through the seam. Built entirely in CSS/SVG (no .gif
 * asset) so it stays crisp at any size and needs no binary file to ship.
 */
@Component({
  selector: 'app-loading-pokeball',
  templateUrl: './loading-pokeball.html',
  styleUrl: './loading-pokeball.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingPokeballComponent {
  readonly label = input('Cargando...');
}
