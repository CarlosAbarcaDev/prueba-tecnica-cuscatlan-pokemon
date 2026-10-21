import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { PokemonDetail, PokemonStat } from '../../../core/models/pokemon.model';
import { IconComponent } from '../../atoms/icon/icon';

/** Spanish display names for PokeAPI's English type slugs — the rest of the UI is Spanish throughout. */
const TYPE_LABELS_ES: Record<string, string> = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada'
};

/** Progress-bar accent color keyed by the same English type slugs, mirroring $color-type-* in _tokens.scss. */
const TYPE_COLORS: Record<string, string> = {
  normal: '#a8a878',
  fire: '#ffc600',
  water: '#2c85bc',
  electric: '#f8d030',
  grass: '#7ed876',
  ice: '#98d8d8',
  fighting: '#c03028',
  poison: '#a040a0',
  ground: '#e0c068',
  flying: '#a890f0',
  psychic: '#f85888',
  bug: '#a8b820',
  rock: '#b8a038',
  ghost: '#705898',
  dragon: '#7038f8',
  dark: '#705848',
  steel: '#b8b8d0',
  fairy: '#ee99ac'
};

const DEFAULT_TYPE_COLOR = '#a8a878';

/**
 * Full stat card for a team member shown on Home — sprite, name, type(s),
 * and a stat bar per entry in PokemonDetail.stats, colored by the Pokémon's
 * primary type. Distinct from PokemonCardComponent, which is the smaller
 * selection-grid badge used during onboarding.
 */
@Component({
  selector: 'app-pokemon-stat-card',
  imports: [IconComponent, TitleCasePipe],
  templateUrl: './pokemon-stat-card.html',
  styleUrl: './pokemon-stat-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonStatCardComponent {
  readonly pokemon = input.required<PokemonDetail>();

  protected readonly typesLabel = computed(() =>
    this.pokemon()
      .types.map((type) => TYPE_LABELS_ES[type] ?? type)
      .join('/')
  );

  protected readonly accentColor = computed(() => {
    const [primaryType] = this.pokemon().types;
    return TYPE_COLORS[primaryType] ?? DEFAULT_TYPE_COLOR;
  });

  protected statPercent(stat: PokemonStat): number {
    return Math.min(100, Math.round((stat.baseValue / stat.maxValue) * 100));
  }
}
