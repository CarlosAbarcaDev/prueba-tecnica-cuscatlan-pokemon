/** Age in full years as of today, from an ISO date string (yyyy-MM-dd). */
export function calculateAge(isoBirthDate: string): number {
  const birthDate = new Date(isoBirthDate);
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
