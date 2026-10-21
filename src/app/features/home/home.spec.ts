import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PokemonDetail } from '../../core/models/pokemon.model';
import { TrainerStoreService } from '../../core/services/trainer-store.service';
import { HomeComponent } from './home';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let trainerStore: TrainerStoreService;

  const team: PokemonDetail[] = [
    {
      id: 1,
      name: 'bulbasaur',
      spriteUrl: null,
      types: ['grass'],
      stats: [{ name: 'HP', baseValue: 45, maxValue: 255 }]
    },
    { id: 4, name: 'charmander', spriteUrl: null, types: ['fire'], stats: [] },
    { id: 7, name: 'squirtle', spriteUrl: null, types: ['water'], stats: [] }
  ];

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    trainerStore = TestBed.inject(TrainerStoreService);
    trainerStore.saveProfile({
      photoDataUrl: null,
      name: 'José',
      favoriteHobby: 'Ver Series',
      birthDate: '2000-01-01',
      documentKind: 'dui',
      documentValue: '04341130-5'
    });
    trainerStore.saveTeam(team);

    fixture = TestBed.createComponent(HomeComponent);
  });

  afterEach(() => localStorage.clear());

  it('greets the trainer by name and lists every team member', () => {
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('¡Hola José!');
    expect(fixture.nativeElement.querySelectorAll('app-pokemon-stat-card').length).toBe(3);
  });
});
