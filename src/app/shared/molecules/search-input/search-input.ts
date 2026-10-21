import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { IconComponent } from '../../atoms/icon/icon';

/**
 * Filled search pill (not part of a reactive form — just emits the typed
 * text) used for the Pokémon id/name filter, and reusable later for Home's
 * navbar search.
 */
@Component({
  selector: 'app-search-input',
  imports: [IconComponent],
  templateUrl: './search-input.html',
  styleUrl: './search-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchInputComponent {
  readonly placeholder = input('Buscar...');
  readonly queryChange = output<string>();

  protected handleInput(event: Event): void {
    this.queryChange.emit((event.target as HTMLInputElement).value);
  }
}
