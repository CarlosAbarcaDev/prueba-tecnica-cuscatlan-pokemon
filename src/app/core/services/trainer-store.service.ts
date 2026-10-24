import { Injectable, computed, signal } from '@angular/core';

import { TEAM_SIZE } from '../constants/team.constant';
import { PokemonDetail } from '../models/pokemon.model';
import { TrainerProfile, TrainerState } from '../models/trainer.model';
import { calculateAge } from '../utils/age.util';

const STORAGE_KEY = 'pokemon-trainer-state';

function isTrainerState(value: unknown): value is TrainerState {
  return (
    typeof value === 'object' &&
    value !== null &&
    'profile' in value &&
    'team' in value &&
    Array.isArray((value as TrainerState).team)
  );
}

function readFromStorage(): TrainerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { profile: null, team: [] };
    }
    const parsed: unknown = JSON.parse(raw);
    return isTrainerState(parsed) ? parsed : { profile: null, team: [] };
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
    return current.profile !== null && current.team.length === TEAM_SIZE;
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

  /** Wipes the saved profile and team entirely — used by Home's "Logout" so the next visitor starts a fresh onboarding. */
  logout(): void {
    this.update(() => ({ profile: null, team: [] }));
  }

  private update(updater: (current: TrainerState) => TrainerState): void {
    const next = updater(this.state());
    this.state.set(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
}
