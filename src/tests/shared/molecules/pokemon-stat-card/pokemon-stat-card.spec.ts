import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonDetail } from '../../../core/models/pokemon.model';
import { PokemonStatCardComponent } from './pokemon-stat-card';

describe('PokemonStatCardComponent', () => {
  let fixture: ComponentFixture<PokemonStatCardComponent>;

  const bulbasaur: PokemonDetail = {
    id: 1,
    name: 'bulbasaur',
    spriteUrl: 'https://example.com/bulbasaur.png',
    types: ['grass', 'poison'],
    stats: [
      { name: 'HP', baseValue: 45, maxValue: 255 },
      { name: 'Ataque', baseValue: 49, maxValue: 190 }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PokemonStatCardComponent] }).compileComponents();
    fixture = TestBed.createComponent(PokemonStatCardComponent);
  });

  it('renders the Spanish type label, title-cased name and a sprite', () => {
    fixture.componentRef.setInput('pokemon', bulbasaur);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Bulbasaur');
    expect(element.textContent).toContain('Planta/Veneno');
    expect(element.querySelector('img')?.getAttribute('src')).toBe('https://example.com/bulbasaur.png');
  });

  it('falls back to the pokeball placeholder when there is no sprite', () => {
    fixture.componentRef.setInput('pokemon', { ...bulbasaur, spriteUrl: null });
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('img')).toBeNull();
    expect(element.querySelector('.pokemon-stat-card__placeholder')).toBeTruthy();
  });

  it('caps the stat bar width at 100% even if a base value exceeds its cap', () => {
    fixture.componentRef.setInput('pokemon', {
      ...bulbasaur,
      stats: [{ name: 'HP', baseValue: 300, maxValue: 255 }]
    });
    fixture.detectChanges();

    const fill = fixture.nativeElement.querySelector('.pokemon-stat-card__bar-fill') as HTMLElement;
    expect(fill.style.width).toBe('100%');
  });
});
