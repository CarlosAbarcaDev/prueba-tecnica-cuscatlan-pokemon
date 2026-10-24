import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  signal
} from '@angular/core';

import { PokemonSummary } from '../../../core/models/pokemon.model';
import { PokeApiService } from '../../../core/services/pokeapi.service';
import { IconComponent } from '../../atoms/icon/icon';

/**
 * One cell in the Pokémon selection grid. Every card in the grid is mounted
 * at once (the grid pages through rows with Swiper rather than virtualizing
 * them), so fetching a detail on init would fire all 151 requests at once —
 * instead, an IntersectionObserver fetches a card's own detail the first
 * time it actually scrolls/pages into view. A null sprite (still loading,
 * missing, or the request failed — see PokeApiService.getPokemonDetail)
 * always renders the same pokeball placeholder instead of a broken image.
 */
@Component({
  selector: 'app-pokemon-card',
  imports: [IconComponent],
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonCardComponent implements AfterViewInit {
  private readonly pokeApi = inject(PokeApiService);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  readonly summary = input.required<PokemonSummary>();
  readonly selected = input(false);
  readonly disabled = input(false);
  readonly toggled = output<number>();

  protected readonly spriteUrl = signal<string | null>(null);
  protected readonly types = signal<string[]>([]);

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.fetchDetail();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.fetchDetail();
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(this.elementRef.nativeElement);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  private fetchDetail(): void {
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
