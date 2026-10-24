import { resolveDocumentStrategy } from './document-validation.strategy';

describe('resolveDocumentStrategy', () => {
  it('resolves to the DUI strategy for an adult', () => {
    const strategy = resolveDocumentStrategy(25);
    expect(strategy.kind).toBe('dui');
    expect(strategy.label).toBe('DUI');
    expect(strategy.required).toBe(true);
    expect(strategy.autoFormat).toBe(true);
  });

  it('resolves to the DUI strategy right at the 18-year boundary', () => {
    expect(resolveDocumentStrategy(18).kind).toBe('dui');
  });

  it('resolves to the carnet de minoridad strategy for a minor', () => {
    const strategy = resolveDocumentStrategy(17);
    expect(strategy.kind).toBe('minority-card');
    expect(strategy.label).toBe('Carnet de Minoridad');
    expect(strategy.required).toBe(false);
    expect(strategy.autoFormat).toBe(false);
    expect(strategy.validators).toEqual([]);
  });
});
