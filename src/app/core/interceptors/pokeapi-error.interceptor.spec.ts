import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { pokeApiErrorInterceptor } from './pokeapi-error.interceptor';

describe('pokeApiErrorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([pokeApiErrorInterceptor])), provideHttpClientTesting()]
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('retries a PokeAPI 500 before giving up, then surfaces the final error', () => {
    vi.useFakeTimers();
    try {
      let result: { error?: unknown; value?: unknown } = {};
      http.get('https://pokeapi.co/api/v2/pokemon/1').subscribe({
        next: (value) => (result = { value }),
        error: (error) => (result = { error })
      });

      // Initial attempt + 2 retries = 3 requests total; the retry delay
      // runs on a real timer, so fake time has to be advanced between them.
      for (let i = 0; i < 3; i++) {
        httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/1').flush('boom', { status: 500, statusText: 'Server Error' });
        vi.advanceTimersByTime(500);
      }

      expect(result.error).toBeTruthy();
      expect(result.value).toBeUndefined();
    } finally {
      vi.useRealTimers();
    }
  });

  it('recovers if a retry succeeds', () => {
    vi.useFakeTimers();
    try {
      let result: { error?: unknown; value?: unknown } = {};
      http.get('https://pokeapi.co/api/v2/pokemon/1').subscribe({
        next: (value) => (result = { value }),
        error: (error) => (result = { error })
      });

      httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/1').flush('boom', { status: 500, statusText: 'Server Error' });
      vi.advanceTimersByTime(500);
      httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/1').flush({ ok: true });

      expect(result.value).toEqual({ ok: true });
      expect(result.error).toBeUndefined();
    } finally {
      vi.useRealTimers();
    }
  });

  it('never retries a 4xx', () => {
    let result: { error?: unknown; value?: unknown } = {};
    http.get('https://pokeapi.co/api/v2/pokemon/999999').subscribe({
      next: (value) => (result = { value }),
      error: (error) => (result = { error })
    });

    httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/999999').flush('not found', { status: 404, statusText: 'Not Found' });
    httpMock.expectNone('https://pokeapi.co/api/v2/pokemon/999999');

    expect(result.error).toBeTruthy();
  });

  it('leaves requests to other hosts untouched', () => {
    let result: { error?: unknown; value?: unknown } = {};
    http.get('https://example.com/other').subscribe({
      next: (value) => (result = { value }),
      error: (error) => (result = { error })
    });

    httpMock.expectOne('https://example.com/other').flush('boom', { status: 500, statusText: 'Server Error' });
    httpMock.expectNone('https://example.com/other');

    expect(result.error).toBeTruthy();
  });
});
