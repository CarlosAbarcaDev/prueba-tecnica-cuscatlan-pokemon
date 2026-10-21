import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'onboarding', pathMatch: 'full' },
  {
    path: 'onboarding',
    loadChildren: () => import('./features/onboarding/onboarding.routes').then((m) => m.ONBOARDING_ROUTES)
  }
  // 'home' is registered here in module 7.
];
