/**
 * `new Date('yyyy-MM-dd')` parses as UTC midnight, which shifts to the
 * previous local day once read back in a negative-UTC-offset timezone
 * (e.g. El Salvador, UTC-6) — exactly where this app is meant to run.
 * Parse the parts ourselves and build a local Date instead.
 */
function parseIsoDateLocal(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** Age in full years as of today, from an ISO date string (yyyy-MM-dd). */
export function calculateAge(isoBirthDate: string): number {
  const birthDate = parseIsoDateLocal(isoBirthDate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }
  return age;
}
