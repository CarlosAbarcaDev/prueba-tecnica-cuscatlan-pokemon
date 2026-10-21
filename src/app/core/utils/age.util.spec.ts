import { calculateAge } from './age.util';

function isoDateYearsAgo(years: number, dayOffset = 0): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  date.setDate(date.getDate() + dayOffset);
  return date.toISOString().slice(0, 10);
}

describe('calculateAge', () => {
  it('returns the full years elapsed when the birthday already happened this year', () => {
    expect(calculateAge(isoDateYearsAgo(20))).toBe(20);
  });

  it('does not count this year yet when the birthday has not happened', () => {
    expect(calculateAge(isoDateYearsAgo(20, 1))).toBe(19);
  });

  it('counts the birthday that already passed earlier this year', () => {
    expect(calculateAge(isoDateYearsAgo(20, -1))).toBe(20);
  });
});
