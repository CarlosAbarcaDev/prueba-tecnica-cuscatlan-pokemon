import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { retry, throwError, timer } from 'rxjs';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 500;

/**
 * Retries a flaky PokeAPI request (network drop, 5xx) a couple of times
 * before letting the final error through for callers to handle — e.g.
 * PokeApiService falling back to a placeholder detail, or the
 * pokemon-select-step showing a "Reintentar" state for the generation list.
 * A 4xx is never retried since repeating the same request would not help.
 */
export const pokeApiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(POKEAPI_BASE_URL)) {
    return next(req);
  }

  return next(req).pipe(
    retry({
      count: MAX_RETRIES,
      delay: (error: HttpErrorResponse) =>
        error.status === 0 || error.status >= 500 ? timer(RETRY_DELAY_MS) : throwError(() => error)
    })
  );
};
