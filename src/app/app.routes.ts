import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'onboarding', pathMatch: 'full' },
  {
    path: 'onboarding',
    loadChildren: () => import('./features/onboarding/onboarding.routes').then((m) => m.ONBOARDING_ROUTES)
  },
  // 'home' is registered here in module 7, guarded with profileRequiredGuard.
  // Until then (and for any unknown URL), there is nowhere else to go but
  // the profile step — nobody without a saved profile can reach any other
  // screen.
  { path: '**', redirectTo: 'onboarding' }
];
