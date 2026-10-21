import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { TrainerStoreService } from '../../core/services/trainer-store.service';
import { IconComponent } from '../../shared/atoms/icon/icon';
import { OutlineButtonComponent } from '../../shared/atoms/outline-button/outline-button';
import { PokemonStatCardComponent } from '../../shared/molecules/pokemon-stat-card/pokemon-stat-card';
import { SectionHeadingComponent } from '../../shared/molecules/section-heading/section-heading';
import { AppHeaderComponent } from '../../shared/organisms/app-header/app-header';
import { TrainerCardComponent } from '../../shared/organisms/trainer-card/trainer-card';

@Component({
  selector: 'app-home',
  imports: [
    AppHeaderComponent,
    TrainerCardComponent,
    PokemonStatCardComponent,
    SectionHeadingComponent,
    OutlineButtonComponent,
    IconComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private readonly trainerStore = inject(TrainerStoreService);
  private readonly router = inject(Router);

  protected readonly profile = this.trainerStore.profile;
  protected readonly team = this.trainerStore.team;

  protected editProfile(): void {
    void this.router.navigate(['/onboarding']);
  }

  protected editTeam(): void {
    void this.router.navigate(['/onboarding/team']);
  }
}
