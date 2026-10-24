import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingPokeballComponent } from '../../../../shared/molecules/loading-pokeball/loading-pokeball';
import { AppHeaderComponent } from '../../../../shared/organisms/app-header/app-header';

const REDIRECT_DELAY_MS = 1200;

export interface LoadingStepData {
  label: string;
  next: string;
}

/**
 * Generic "Loading" screen driven entirely by route data, reused for both
 * interstitials in the onboarding flow (after the profile form and after
 * the Pokémon selection) instead of duplicating a component for each.
 * There is nothing real to wait for (everything is saved to localStorage
 * synchronously), so it just holds the animation for a moment before
 * navigating to whatever `next` the route configured.
 */
@Component({
  selector: 'app-loading-step',
  imports: [LoadingPokeballComponent, AppHeaderComponent],
  templateUrl: './loading-step.html',
  styleUrl: './loading-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingStepComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly label = (this.route.snapshot.data as Partial<LoadingStepData>).label ?? 'Cargando...';

  ngOnInit(): void {
    const next = (this.route.snapshot.data as Partial<LoadingStepData>).next;
    if (next) {
      setTimeout(() => void this.router.navigateByUrl(next), REDIRECT_DELAY_MS);
    }
  }
}
