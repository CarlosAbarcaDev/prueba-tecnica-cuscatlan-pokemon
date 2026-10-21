import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { TrainerStoreService } from '../services/trainer-store.service';

/**
 * Blocks /home until both the profile and the 3-member team are saved,
 * sending an incomplete visitor back to /onboarding instead.
 */
export const onboardingCompleteGuard: CanActivateFn = () => {
  const trainerStore = inject(TrainerStoreService);
  const router = inject(Router);

  if (trainerStore.isOnboardingComplete()) {
    return true;
  }

  return router.createUrlTree(['/onboarding']);
};
