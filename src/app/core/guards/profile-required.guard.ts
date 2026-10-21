import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { TrainerStoreService } from '../services/trainer-store.service';

/**
 * Blocks any route from being entered before the trainer profile exists,
 * sending the visitor back to /onboarding instead. Meant for every route
 * other than the profile step itself (team selection, home).
 */
export const profileRequiredGuard: CanActivateFn = () => {
  const trainerStore = inject(TrainerStoreService);
  const router = inject(Router);

  if (trainerStore.profile() !== null) {
    return true;
  }

  return router.createUrlTree(['/onboarding']);
};
