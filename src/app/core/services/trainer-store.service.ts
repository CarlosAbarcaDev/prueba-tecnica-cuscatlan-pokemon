import { Injectable, computed, signal } from '@angular/core';

import { PokemonDetail } from '../models/pokemon.model';
import { EMPTY_TRAINER_PROFILE, TrainerProfile, TrainerState } from '../models/trainer.model';
import { calculateAge } from '../utils/age.util';

const STORAGE_KEY = 'pokemon-trainer-state';

function readFromStorage(): TrainerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { profile: null, team: [] };
    }
    return JSON.parse(raw) as TrainerState;
  } catch {
    return { profile: null, team: [] };
  }
}

/**
 * Signal-based single source of truth for the trainer profile and team.
 * Acts as the app's lightweight store: every feature reads/writes through
 * here instead of passing state between wizard steps directly.
 */
@Injectable({ providedIn: 'root' })
export class TrainerStoreService {
  private readonly state = signal<TrainerState>(readFromStorage());

  readonly profile = computed(() => this.state().profile);
  readonly team = computed(() => this.state().team);
  readonly isOnboardingComplete = computed(() => {
    const current = this.state();
    return current.profile !== null && current.team.length === 3;
  });

  readonly age = computed(() => {
    const birthDate = this.profile()?.birthDate;
    return birthDate ? calculateAge(birthDate) : null;
  });

  saveProfile(profile: TrainerProfile): void {
    this.update((current) => ({ ...current, profile }));
  }

  saveTeam(team: PokemonDetail[]): void {
    this.update((current) => ({ ...current, team }));
  }

  startNewTrainer(): void {
    this.update(() => ({ profile: { ...EMPTY_TRAINER_PROFILE }, team: [] }));
  }

  private update(updater: (current: TrainerState) => TrainerState): void {
    const next = updater(this.state());
    this.state.set(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
}
