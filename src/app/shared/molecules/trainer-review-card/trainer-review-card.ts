import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { getDuiValue } from '../../../core/utils/document.util';
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

  protected get dui(): string | null {
    return getDuiValue(this.profile());
  }
}
