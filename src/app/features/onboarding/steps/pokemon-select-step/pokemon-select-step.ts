import { ScrollingModule } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { chunk } from '../../../../core/utils/array.util';
import { PokemonSummary } from '../../../../core/models/pokemon.model';
import { PokeApiService } from '../../../../core/services/pokeapi.service';
import { TrainerStoreService } from '../../../../core/services/trainer-store.service';
import { OutlineButtonComponent } from '../../../../shared/atoms/outline-button/outline-button';
import { PrimaryButtonComponent } from '../../../../shared/atoms/primary-button/primary-button';
import { PokemonCardComponent } from '../../../../shared/molecules/pokemon-card/pokemon-card';
import { SearchInputComponent } from '../../../../shared/molecules/search-input/search-input';
import { SectionHeadingComponent } from '../../../../shared/molecules/section-heading/section-heading';
import { TrainerReviewCardComponent } from '../../../../shared/molecules/trainer-review-card/trainer-review-card';
import { ConfigScreenLayoutComponent } from '../../../../shared/templates/config-screen-layout/config-screen-layout';

const TEAM_SIZE = 3;
const ROW_SIZE = 3;
const ROW_SIZE_MOBILE = 2;
// Matches $breakpoint-mobile in _tokens.scss.
const MOBILE_MEDIA_QUERY = '(max-width: 640px)';

@Component({
  selector: 'app-pokemon-select-step',
  imports: [
    ScrollingModule,
    ConfigScreenLayoutComponent,
    TrainerReviewCardComponent,
    SectionHeadingComponent,
    SearchInputComponent,
    PokemonCardComponent,
    PrimaryButtonComponent,
    OutlineButtonComponent
  ],
  templateUrl: './pokemon-select-step.html',
  styleUrl: './pokemon-select-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonSelectStepComponent {
  private readonly pokeApi = inject(PokeApiService);
  private readonly trainerStore = inject(TrainerStoreService);
  private readonly router = inject(Router);

  private readonly allPokemon = signal<PokemonSummary[]>([]);
  protected readonly query = signal('');
  protected readonly listError = signal(false);
  // Reopening this step to edit an already-saved team (via Home's "Editar")
  // starts with its 3 members pre-selected instead of an empty grid; a
  // first-time run simply has no team yet, so this is `[]` as before.
  protected readonly selectedIds = signal<number[]>(this.trainerStore.team().map((pokemon) => pokemon.id));

  // The CSS grid drops from 3 to 2 columns at the mobile breakpoint, so the
  // virtual-scroll rows must match: chunking by a fixed 3 while the grid
  // renders 2 per line staggers every row after the first (2, then 1, then
  // 2 from the next row, and so on).
  private readonly mobileQuery = matchMedia(MOBILE_MEDIA_QUERY);
  private readonly isMobile = signal(this.mobileQuery.matches);

  protected readonly filteredRows = computed(() => {
    const filtered = this.pokeApi.filterByIdOrName(this.allPokemon(), this.query());
    const rowSize = this.isMobile() ? ROW_SIZE_MOBILE : ROW_SIZE;
    return chunk(filtered, rowSize);
  });

  protected readonly isTeamFull = computed(() => this.selectedIds().length === TEAM_SIZE);

  constructor() {
    this.loadGenerationOneList();

    const handleChange = (event: MediaQueryListEvent): void => this.isMobile.set(event.matches);
    this.mobileQuery.addEventListener('change', handleChange);
    inject(DestroyRef).onDestroy(() => this.mobileQuery.removeEventListener('change', handleChange));
  }

  protected retryList(): void {
    this.loadGenerationOneList();
  }

  private loadGenerationOneList(): void {
    this.listError.set(false);
    this.pokeApi.getGenerationOneList().subscribe({
      next: (list) => this.allPokemon.set(list),
      error: () => this.listError.set(true)
    });
  }

  protected isSelected(id: number): boolean {
    return this.selectedIds().includes(id);
  }

  protected isDisabled(id: number): boolean {
    return this.isTeamFull() && !this.isSelected(id);
  }

  protected handleSearch(query: string): void {
    this.query.set(query);
  }

  protected toggleSelection(id: number): void {
    const current = this.selectedIds();
    if (current.includes(id)) {
      this.selectedIds.set(current.filter((selectedId) => selectedId !== id));
    } else if (current.length < TEAM_SIZE) {
      this.selectedIds.set([...current, id]);
    }
  }

  /** Clears the in-progress selection so all 3 slots can be picked again from scratch. */
  protected clearTeam(): void {
    this.selectedIds.set([]);
  }

  protected save(): void {
    if (!this.isTeamFull()) {
      return;
    }

    const details$ = this.selectedIds().map((id) => this.pokeApi.getPokemonDetail(id));
    forkJoin(details$).subscribe((team) => {
      this.trainerStore.saveTeam(team);
      void this.router.navigateByUrl('/onboarding/team-loading');
    });
  }
}
