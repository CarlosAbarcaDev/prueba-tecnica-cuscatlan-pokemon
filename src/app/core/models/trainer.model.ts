import { PokemonDetail } from './pokemon.model';

export type DocumentKind = 'dui' | 'minority-card';

export interface TrainerProfile {
  photoDataUrl: string | null;
  name: string;
  favoriteHobby: string | null;
  birthDate: string | null; // ISO date (yyyy-MM-dd)
  documentKind: DocumentKind | null;
  documentValue: string | null;
}

export interface TrainerState {
  profile: TrainerProfile | null;
  team: PokemonDetail[];
}

export const EMPTY_TRAINER_PROFILE: TrainerProfile = {
  photoDataUrl: null,
  name: '',
  favoriteHobby: null,
  birthDate: null,
  documentKind: null,
  documentValue: null
};
