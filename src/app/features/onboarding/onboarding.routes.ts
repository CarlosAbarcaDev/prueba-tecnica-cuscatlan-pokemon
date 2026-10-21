import { Routes } from '@angular/router';

import { profileRequiredGuard } from '../../core/guards/profile-required.guard';

export const ONBOARDING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./steps/profile-step/profile-step').then((m) => m.ProfileStepComponent)
  },
  {
    path: 'loading',
    loadComponent: () => import('./steps/loading-step/loading-step').then((m) => m.LoadingStepComponent),
    canActivate: [profileRequiredGuard],
    data: { label: 'Cargando...', next: '/onboarding/team' }
  },
  {
    path: 'team',
    loadComponent: () =>
      import('./steps/pokemon-select-step/pokemon-select-step').then((m) => m.PokemonSelectStepComponent),
    canActivate: [profileRequiredGuard]
  },
  {
    path: 'team-loading',
    loadComponent: () => import('./steps/loading-step/loading-step').then((m) => m.LoadingStepComponent),
    canActivate: [profileRequiredGuard],
    data: { label: 'Cargando perfil...', next: '/home' }
    // '/home' doesn't exist until module 7 — the app-wide wildcard route
    // sends it back to /onboarding in the meantime.
  }
];
