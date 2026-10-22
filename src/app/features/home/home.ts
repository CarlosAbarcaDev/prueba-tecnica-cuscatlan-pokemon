import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { TrainerStoreService } from '../../core/services/trainer-store.service';
import { translatePokemonType } from '../../core/utils/pokemon-type.util';
import { IconComponent } from '../../shared/atoms/icon/icon';
import { OutlineButtonComponent } from '../../shared/atoms/outline-button/outline-button';
import { PokemonStatCardComponent } from '../../shared/molecules/pokemon-stat-card/pokemon-stat-card';
import { SearchInputComponent } from '../../shared/molecules/search-input/search-input';
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
    SearchInputComponent,
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

  protected readonly userMenuOpen = signal(false);
  protected readonly isTeamSearchOpen = signal(false);
  private readonly teamQuery = signal('');

  protected readonly filteredTeam = computed(() => {
    const query = this.teamQuery().trim().toLowerCase();
    if (!query) {
      return this.team();
    }
    return this.team().filter((pokemon) => {
      const name = pokemon.name.toLowerCase();
      const types = pokemon.types.map((type) => translatePokemonType(type).toLowerCase());
      return name.includes(query) || types.some((typeLabel) => typeLabel.includes(query));
    });
  });

  protected editProfile(): void {
    void this.router.navigate(['/onboarding']);
  }

  protected editTeam(): void {
    void this.router.navigate(['/onboarding/team']);
  }

  protected toggleUserMenu(): void {
    this.userMenuOpen.update((open) => !open);
  }

  protected closeUserMenu(): void {
    this.userMenuOpen.set(false);
  }

  protected logout(): void {
    this.trainerStore.logout();
    void this.router.navigate(['/onboarding']);
  }

  protected openTeamSearch(): void {
    this.isTeamSearchOpen.set(true);
  }

  protected handleTeamSearch(query: string): void {
    this.teamQuery.set(query);
  }
}
