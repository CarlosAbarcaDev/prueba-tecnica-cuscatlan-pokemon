import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, shareReplay, throwError } from 'rxjs';

import { PokeApiListResponse, PokeApiPokemonResponse } from '../models/pokeapi-response.model';
import { PokemonDetail, PokemonStat, PokemonSummary } from '../models/pokemon.model';

const BASE_URL = 'https://pokeapi.co/api/v2';
const GENERATION_ONE_LIMIT = 151;

/** Base stat caps used to render each stat bar as a percentage of its max. */
const STAT_MAX_VALUES: Record<string, number> = {
  hp: 255,
  attack: 190,
  defense: 230,
  'special-attack': 194,
  'special-defense': 230,
  speed: 180
};

const STAT_DISPLAY_NAMES: Record<string, string> = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'Ataque Especial',
  'special-defense': 'Defensa Especial',
  speed: 'Velocidad'
};

/**
 * Repository-style gateway to PokeAPI. Keeps an in-memory cache of fetched
 * details and of the generation-1 list so repeated navigation (e.g. editing
 * the team) never re-requests data already seen in this session.
 */
@Injectable({ providedIn: 'root' })
export class PokeApiService {
  private readonly http = inject(HttpClient);

  private generationOneCache$: Observable<PokemonSummary[]> | null = null;
  private readonly detailCache = new Map<number, Observable<PokemonDetail>>();

  getGenerationOneList(): Observable<PokemonSummary[]> {
    if (!this.generationOneCache$) {
      this.generationOneCache$ = this.http
        .get<PokeApiListResponse>(`${BASE_URL}/pokemon?limit=${GENERATION_ONE_LIMIT}`)
        .pipe(
          map((response) => response.results.map((entry) => this.toSummary(entry))),
          // Unlike getPokemonDetail, there is no sensible placeholder for the
          // whole list — the error is left to propagate so the caller can
          // show a "Reintentar" state. The cache is cleared on failure so
          // that retry issues a fresh request instead of replaying the same
          // cached error forever.
          catchError((error) => {
            this.generationOneCache$ = null;
            return throwError(() => error);
          }),
          shareReplay({ bufferSize: 1, refCount: false })
        );
    }
    return this.generationOneCache$;
  }

  getPokemonDetail(id: number): Observable<PokemonDetail> {
    const cached = this.detailCache.get(id);
    if (cached) {
      return cached;
    }

    const request$ = this.http.get<PokeApiPokemonResponse>(`${BASE_URL}/pokemon/${id}`).pipe(
      map((response) => this.toDetail(response)),
      // A failed request still resolves to a usable (if empty) detail so a
      // single flaky Pokémon never breaks the whole grid — the card just
      // falls back to its placeholder sprite. The cache entry is dropped on
      // failure (like getGenerationOneList) so a later call retries instead
      // of replaying this blank fallback forever.
      catchError(() => {
        this.detailCache.delete(id);
        return of(this.toFallbackDetail(id));
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );

    this.detailCache.set(id, request$);
    return request$;
  }

  /** Cheap client-side filter over the already-fetched generation list. */
  filterByIdOrName(list: PokemonSummary[], query: string): PokemonSummary[] {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return list;
    }
    return list.filter(
      (pokemon) => pokemon.name.includes(normalized) || String(pokemon.id) === normalized
    );
  }

  private toSummary(entry: { name: string; url: string }): PokemonSummary {
    return { id: this.extractIdFromUrl(entry.url), name: entry.name };
  }

  private toDetail(response: PokeApiPokemonResponse): PokemonDetail {
    return {
      id: response.id,
      name: response.name,
      spriteUrl: response.sprites.other?.home?.front_default ?? null,
      types: response.types.sort((a, b) => a.slot - b.slot).map((entry) => entry.type.name),
      stats: response.stats.map((entry) => this.toStat(entry))
    };
  }

  private toStat(entry: { base_stat: number; stat: { name: string } }): PokemonStat {
    return {
      name: STAT_DISPLAY_NAMES[entry.stat.name] ?? entry.stat.name,
      baseValue: entry.base_stat,
      maxValue: STAT_MAX_VALUES[entry.stat.name] ?? entry.base_stat
    };
  }

  /** Used when a detail request fails: no sprite, no types/stats, but still a valid shape. */
  private toFallbackDetail(id: number): PokemonDetail {
    return { id, name: '', spriteUrl: null, types: [], stats: [] };
  }

  private extractIdFromUrl(url: string): number {
    const segments = url.split('/').filter(Boolean);
    return Number(segments[segments.length - 1]);
  }
}
