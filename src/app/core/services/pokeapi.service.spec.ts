import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PokeApiService } from './pokeapi.service';

describe('PokeApiService', () => {
  let service: PokeApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(PokeApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('maps the generation-1 list response to id/name summaries', () => {
    let result: { id: number; name: string }[] = [];
    service.getGenerationOneList().subscribe((list) => (result = list));

    httpMock.expectOne('https://pokeapi.co/api/v2/pokemon?limit=151').flush({
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' }
      ]
    });

    expect(result).toEqual([
      { id: 1, name: 'bulbasaur' },
      { id: 2, name: 'ivysaur' }
    ]);
  });

  it('maps a successful detail response, picking the home sprite', () => {
    let result: unknown;
    service.getPokemonDetail(1).subscribe((detail) => (result = detail));

    httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/1').flush({
      id: 1,
      name: 'bulbasaur',
      types: [{ slot: 1, type: { name: 'grass' } }],
      stats: [{ base_stat: 45, stat: { name: 'hp' } }],
      sprites: { other: { home: { front_default: 'https://example.com/1.png' } } }
    });

    expect(result).toEqual({
      id: 1,
      name: 'bulbasaur',
      spriteUrl: 'https://example.com/1.png',
      types: ['grass'],
      stats: [{ name: 'HP', baseValue: 45, maxValue: 255 }]
    });
  });

  it('falls back to a placeholder-friendly detail when the request fails', () => {
    let result: { spriteUrl: string | null; types: string[]; stats: unknown[] } | undefined;
    service.getPokemonDetail(999).subscribe((detail) => (result = detail));

    httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/999').flush('boom', {
      status: 500,
      statusText: 'Server Error'
    });

    expect(result?.spriteUrl).toBeNull();
    expect(result?.types).toEqual([]);
    expect(result?.stats).toEqual([]);
  });

  it('caches a detail request so a repeat subscription does not hit the network again', () => {
    service.getPokemonDetail(1).subscribe();
    httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/1').flush({
      id: 1,
      name: 'bulbasaur',
      types: [],
      stats: [],
      sprites: {}
    });

    service.getPokemonDetail(1).subscribe();
    httpMock.expectNone('https://pokeapi.co/api/v2/pokemon/1');
  });
});
