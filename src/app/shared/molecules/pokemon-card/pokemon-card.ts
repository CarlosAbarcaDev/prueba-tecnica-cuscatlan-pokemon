import { ChangeDetectionStrategy, Component, OnInit, inject, input, output, signal } from '@angular/core';

import { PokemonSummary } from '../../../core/models/pokemon.model';
import { PokeApiService } from '../../../core/services/pokeapi.service';
import { IconComponent } from '../../atoms/icon/icon';

/**
 * One cell in the Pokémon selection grid. Fetches its own detail (sprite)
 * on init rather than the page doing it — since Angular CDK's virtual
 * scroll only instantiates cards for rows currently in view (+ buffer),
 * this alone gives "fetch as it scrolls into view" with no extra plumbing.
 * A null sprite (still loading, missing, or the request failed — see
 * PokeApiService.getPokemonDetail) always renders the same pokeball
 * placeholder instead of a broken image.
 */
@Component({
  selector: 'app-pokemon-card',
  imports: [IconComponent],
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonCardComponent implements OnInit {
  private readonly pokeApi = inject(PokeApiService);

  readonly summary = input.required<PokemonSummary>();
  readonly selected = input(false);
  readonly disabled = input(false);
  readonly toggled = output<number>();

  protected readonly spriteUrl = signal<string | null>(null);
  protected readonly types = signal<string[]>([]);

  ngOnInit(): void {
    this.pokeApi.getPokemonDetail(this.summary().id).subscribe((detail) => {
      this.spriteUrl.set(detail.spriteUrl);
      this.types.set(detail.types);
    });
  }

  protected get displayId(): string {
    return `#${String(this.summary().id).padStart(3, '0')}`;
  }

  protected get displayName(): string {
    const name = this.summary().name;
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  protected handleClick(): void {
    if (!this.disabled()) {
      this.toggled.emit(this.summary().id);
    }
  }
}
