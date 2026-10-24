import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';

import { PokemonDetail } from '../../../app/core/models/pokemon.model';
import { TrainerStoreService } from '../../../app/core/services/trainer-store.service';
import { onboardingCompleteGuard } from '../../../app/core/guards/onboarding-complete.guard';

describe('onboardingCompleteGuard', () => {
  function runGuard() {
    return TestBed.runInInjectionContext(() =>
      onboardingCompleteGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
  }

  const team: PokemonDetail[] = [
    { id: 1, name: 'bulbasaur', spriteUrl: null, types: ['grass'], stats: [] },
    { id: 4, name: 'charmander', spriteUrl: null, types: ['fire'], stats: [] },
    { id: 7, name: 'squirtle', spriteUrl: null, types: ['water'], stats: [] }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  afterEach(() => localStorage.clear());

  it('redirects to /onboarding when there is no saved profile', () => {
    const result = runGuard();
    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/onboarding');
  });

  it('redirects to /onboarding when the profile exists but the team is incomplete', () => {
    const trainerStore = TestBed.inject(TrainerStoreService);
    trainerStore.saveProfile({
      photoDataUrl: null,
      name: 'José Sosa',
      favoriteHobby: null,
      birthDate: '2000-01-01',
      documentKind: 'dui',
      documentValue: '04341130-5'
    });

    const result = runGuard();
    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/onboarding');
  });

  it('allows navigation once both the profile and a 3-member team are saved', () => {
    const trainerStore = TestBed.inject(TrainerStoreService);
    trainerStore.saveProfile({
      photoDataUrl: null,
      name: 'José Sosa',
      favoriteHobby: null,
      birthDate: '2000-01-01',
      documentKind: 'dui',
      documentValue: '04341130-5'
    });
    trainerStore.saveTeam(team);

    expect(runGuard()).toBe(true);
  });
});
