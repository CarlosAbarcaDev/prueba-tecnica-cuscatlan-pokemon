/** Shape of the raw PokeAPI responses this app touches. Internal to the data layer. */
export interface PokeApiListResponse {
  results: { name: string; url: string }[];
}

export interface PokeApiPokemonResponse {
  id: number;
  name: string;
  types: { slot: number; type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    other?: {
      home?: {
        front_default: string | null;
      };
    };
  };
}
