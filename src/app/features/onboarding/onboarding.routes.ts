import { Routes } from '@angular/router';

export const ONBOARDING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./steps/profile-step/profile-step').then((m) => m.ProfileStepComponent)
  }
  // 'team' (pokemon selection) is registered here in module 6, with
  // canActivate: [profileRequiredGuard] since it needs a saved profile.
];
