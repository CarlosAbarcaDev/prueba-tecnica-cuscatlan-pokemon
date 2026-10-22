import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';

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

  it('logout wipes the trainer data and navigates to /onboarding', () => {
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    (fixture.nativeElement.querySelector('.home__nav-user-toggle') as HTMLButtonElement).click();
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('.home__nav-user-menu button') as HTMLButtonElement).click();

    expect(trainerStore.profile()).toBeNull();
    expect(trainerStore.team()).toEqual([]);
    expect(navigateSpy).toHaveBeenCalledWith(['/onboarding']);
  });

  it('filters the team list by name once the search is opened', () => {
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('.home__nav-search-toggle') as HTMLButtonElement).click();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('app-search-input input') as HTMLInputElement;
    input.value = 'char';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('app-pokemon-stat-card');
    expect(cards.length).toBe(1);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Charmander');
  });

  it('filters the team list by the Spanish type label', () => {
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('.home__nav-search-toggle') as HTMLButtonElement).click();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('app-search-input input') as HTMLInputElement;
    input.value = 'agua';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('app-pokemon-stat-card');
    expect(cards.length).toBe(1);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Squirtle');
  });
});
