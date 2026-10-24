import { TestBed } from '@angular/core/testing';

import { PokemonDetail } from '../models/pokemon.model';
import { TrainerStoreService } from './trainer-store.service';

describe('TrainerStoreService', () => {
  let service: TrainerStoreService;

  const team: PokemonDetail[] = [
    { id: 1, name: 'bulbasaur', spriteUrl: null, types: ['grass'], stats: [] },
    { id: 4, name: 'charmander', spriteUrl: null, types: ['fire'], stats: [] },
    { id: 7, name: 'squirtle', spriteUrl: null, types: ['water'], stats: [] }
  ];

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainerStoreService);
  });

  afterEach(() => localStorage.clear());

  it('wipes the profile and team on logout, and persists the wipe', () => {
    service.saveProfile({
      photoDataUrl: null,
      name: 'José Sosa',
      favoriteHobby: null,
      birthDate: '2000-01-01',
      documentKind: 'dui',
      documentValue: '04341130-5'
    });
    service.saveTeam(team);
    expect(service.isOnboardingComplete()).toBe(true);

    service.logout();

    expect(service.profile()).toBeNull();
    expect(service.team()).toEqual([]);
    expect(service.isOnboardingComplete()).toBe(false);
    expect(JSON.parse(localStorage.getItem('pokemon-trainer-state')!)).toEqual({ profile: null, team: [] });
  });
});
