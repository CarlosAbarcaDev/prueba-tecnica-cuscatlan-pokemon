import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonCardComponent } from './pokemon-card';

describe('PokemonCardComponent', () => {
  let fixture: ComponentFixture<PokemonCardComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonCardComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonCardComponent);
    fixture.componentRef.setInput('summary', { id: 1, name: 'bulbasaur' });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('shows the placeholder pokeball while the detail is loading', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-icon')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
    httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/1').flush({
      id: 1,
      name: 'bulbasaur',
      types: [],
      stats: [],
      sprites: {}
    });
  });

  it('swaps to the real sprite once the detail resolves', () => {
    fixture.detectChanges();
    httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/1').flush({
      id: 1,
      name: 'bulbasaur',
      types: [{ slot: 1, type: { name: 'grass' } }],
      stats: [],
      sprites: { other: { home: { front_default: 'https://example.com/1.png' } } }
    });
    fixture.detectChanges();

    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(img.src).toBe('https://example.com/1.png');
  });

  it('keeps the placeholder when the detail request fails (service falls back, never errors)', () => {
    fixture.detectChanges();
    httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/1').flush('boom', {
      status: 500,
      statusText: 'Server Error'
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('img')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-icon')).toBeTruthy();
  });

  it('emits toggle with the pokemon id when clicked', () => {
    fixture.detectChanges();
    httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/1').flush({
      id: 1,
      name: 'bulbasaur',
      types: [],
      stats: [],
      sprites: {}
    });

    let emitted: number | undefined;
    fixture.componentInstance.toggled.subscribe((id) => (emitted = id));
    fixture.nativeElement.querySelector('button').click();

    expect(emitted).toBe(1);
  });

  it('does not emit toggle when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/1').flush({
      id: 1,
      name: 'bulbasaur',
      types: [],
      stats: [],
      sprites: {}
    });

    let emitted = false;
    fixture.componentInstance.toggled.subscribe(() => (emitted = true));
    fixture.nativeElement.querySelector('button').click();

    expect(emitted).toBe(false);
  });
});
