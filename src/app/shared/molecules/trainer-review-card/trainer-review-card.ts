import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TrainerStoreService } from '../../../core/services/trainer-store.service';
import { CardShellComponent } from '../../atoms/card-shell/card-shell';
import { IconComponent } from '../../atoms/icon/icon';

/**
 * Read-only trainer summary shown on the left column once the profile step
 * is done (pokemon-selection, and later home/edit flows). Same CardShell
 * atom as the editable photo-upload step, different projected content.
 */
@Component({
  selector: 'app-trainer-review-card',
  imports: [CardShellComponent, IconComponent],
  templateUrl: './trainer-review-card.html',
  styleUrl: './trainer-review-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainerReviewCardComponent {
  private readonly trainerStore = inject(TrainerStoreService);

  protected readonly profile = this.trainerStore.profile;
  protected readonly age = this.trainerStore.age;

  /** Only the DUI ever shows here — a minor's carnet number is never displayed on this card. */
  protected get dui(): string | null {
    const profile = this.profile();
    return profile?.documentKind === 'dui' ? profile.documentValue : null;
  }
}
