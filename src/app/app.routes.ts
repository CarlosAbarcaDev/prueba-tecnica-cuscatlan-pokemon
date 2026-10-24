import { Routes } from '@angular/router';

import { onboardingCompleteGuard } from './core/guards/onboarding-complete.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'onboarding', pathMatch: 'full' },
  {
    path: 'onboarding',
    loadChildren: () => import('./features/onboarding/onboarding.routes').then((m) => m.ONBOARDING_ROUTES)
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then((m) => m.HomeComponent),
    canActivate: [onboardingCompleteGuard]
  },
  // Any unknown URL, and any incomplete onboarding attempt to reach /home,
  // lands back on the profile step.
  { path: '**', redirectTo: 'onboarding' }
];
