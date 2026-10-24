/** Raw entry from GET /pokemon?limit=151 */
export interface PokemonListEntry {
  name: string;
  url: string;
}

export interface PokemonStat {
  name: string;
  baseValue: number;
  maxValue: number;
}

/** Normalized Pokémon data used across the app, derived from the PokeAPI detail response. */
export interface PokemonDetail {
  id: number;
  name: string;
  spriteUrl: string | null;
  types: string[];
  stats: PokemonStat[];
}

/** Lightweight row used by the selection grid before the full detail is fetched. */
export interface PokemonSummary {
  id: number;
  name: string;
}
