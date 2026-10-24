// Mirrors $breakpoint-mobile in _tokens.scss, used when the CSS custom
// property it's exposed through isn't available (e.g. a unit test that
// doesn't load the global stylesheet).
const FALLBACK_MOBILE_BREAKPOINT = '640px';

/**
 * Reads the mobile breakpoint from the `--breakpoint-mobile` custom property
 * that styles.scss derives from `$breakpoint-mobile`, so the value a
 * component reacts to in TypeScript can never drift from the one the CSS
 * grid actually breaks on.
 */
export function getMobileMediaQuery(): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-mobile').trim();
  return `(max-width: ${value || FALLBACK_MOBILE_BREAKPOINT})`;
}
