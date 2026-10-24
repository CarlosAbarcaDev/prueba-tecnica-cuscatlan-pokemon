import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { getDuiValue } from '../../../core/utils/document.util';
import { TrainerStoreService } from '../../../core/services/trainer-store.service';
import { CardShellComponent } from '../../atoms/card-shell/card-shell';
import { IconComponent } from '../../atoms/icon/icon';

/**
 * Trainer summary card shown on Home — same CardShell atom and photo/facts
 * layout as TrainerReviewCardComponent, plus the "Entrenador" title and
 * decorative badge that only Home's design includes.
 */
@Component({
  selector: 'app-trainer-card',
  imports: [CardShellComponent, IconComponent],
  templateUrl: './trainer-card.html',
  styleUrl: './trainer-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainerCardComponent {
  private readonly trainerStore = inject(TrainerStoreService);

  protected readonly profile = this.trainerStore.profile;
  protected readonly age = this.trainerStore.age;

  protected get dui(): string | null {
    return getDuiValue(this.profile());
  }
}
