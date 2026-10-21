import { calculateAge } from './age.util';

// Builds the string from local Y/M/D (not toISOString, which converts to
// UTC and can land on a different calendar day depending on the machine's
// timezone and time of day — exactly the bug calculateAge itself had to
// be fixed for).
function isoDateYearsAgo(years: number, dayOffset = 0): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  date.setDate(date.getDate() + dayOffset);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
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
