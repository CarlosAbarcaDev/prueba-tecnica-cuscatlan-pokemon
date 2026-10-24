import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { TEAM_SIZE } from '../../../../core/constants/team.constant';
import { calculateAge } from '../../../../core/utils/age.util';
import { DocumentKind, TrainerProfile } from '../../../../core/models/trainer.model';
import { TrainerStoreService } from '../../../../core/services/trainer-store.service';
import { DocumentStrategy, resolveDocumentStrategy } from '../../../../core/strategies/document-validation.strategy';
import { DuiFormatDirective } from '../../../../shared/directives/dui-format.directive';
import { PrimaryButtonComponent } from '../../../../shared/atoms/primary-button/primary-button';
import { DatePickerComponent } from '../../../../shared/molecules/date-picker/date-picker';
import { FloatingInputComponent } from '../../../../shared/molecules/floating-input/floating-input';
import { HobbySelectComponent } from '../../../../shared/molecules/hobby-select/hobby-select';
import { PhotoUploadComponent } from '../../../../shared/molecules/photo-upload/photo-upload';
import { SectionHeadingComponent } from '../../../../shared/molecules/section-heading/section-heading';
import { ConfigScreenLayoutComponent } from '../../../../shared/templates/config-screen-layout/config-screen-layout';

interface ProfileForm {
  photoDataUrl: FormControl<string | null>;
  name: FormControl<string>;
  hobby: FormControl<string | null>;
  birthDate: FormControl<string>;
  documentValue: FormControl<string>;
}

@Component({
  selector: 'app-profile-step',
  imports: [
    ReactiveFormsModule,
    ConfigScreenLayoutComponent,
    SectionHeadingComponent,
    DatePickerComponent,
    FloatingInputComponent,
    HobbySelectComponent,
    PhotoUploadComponent,
    PrimaryButtonComponent,
    DuiFormatDirective
  ],
  templateUrl: './profile-step.html',
  styleUrl: './profile-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileStepComponent {
  private readonly trainerStore = inject(TrainerStoreService);
  private readonly router = inject(Router);

  private readonly previousDocumentKind = signal<DocumentKind | null>(null);

  protected readonly form = new FormGroup<ProfileForm>({
    photoDataUrl: new FormControl<string | null>(null, { validators: Validators.required }),
    name: new FormControl('', { nonNullable: true, validators: Validators.required }),
    hobby: new FormControl<string | null>(null),
    birthDate: new FormControl('', { nonNullable: true, validators: Validators.required }),
    documentValue: new FormControl({ value: '', disabled: true }, { nonNullable: true })
  });

  private readonly birthDateValue = signal('');

  protected readonly age = computed(() => {
    const birthDate = this.birthDateValue();
    return birthDate ? calculateAge(birthDate) : null;
  });

  protected readonly documentStrategy = computed<DocumentStrategy | null>(() => {
    const age = this.age();
    return age === null ? null : resolveDocumentStrategy(age);
  });

  /** True once there is a saved profile to prefill from — i.e. "Editar perfil" opened this step, not first-time onboarding. */
  protected readonly isEditing = computed(() => this.trainerStore.profile() !== null);

  constructor() {
    this.form.controls.birthDate.valueChanges.subscribe((value) => this.birthDateValue.set(value));

    this.form.controls.birthDate.valueChanges.subscribe(() => {
      const strategy = this.documentStrategy();
      const documentValue = this.form.controls.documentValue;

      if (!strategy) {
        documentValue.disable();
        return;
      }

      if (this.previousDocumentKind() !== strategy.kind) {
        documentValue.setValue('');
        this.previousDocumentKind.set(strategy.kind);
      }

      documentValue.setValidators(strategy.validators);
      documentValue.updateValueAndValidity();
      documentValue.enable();
    });

    this.prefillFromExistingProfile();
  }

  /** Lets "Editar perfil" reopen this step with its saved data instead of a blank form. */
  private prefillFromExistingProfile(): void {
    const existing = this.trainerStore.profile();
    if (!existing) {
      return;
    }

    // Set before patching birthDate so the strategy-switch subscriber above
    // sees a matching kind and does not clear the document value it is
    // about to receive below.
    this.previousDocumentKind.set(existing.documentKind);

    this.form.patchValue({
      photoDataUrl: existing.photoDataUrl,
      name: existing.name,
      hobby: existing.favoriteHobby,
      birthDate: existing.birthDate ?? ''
    });

    if (existing.documentValue) {
      this.form.controls.documentValue.setValue(existing.documentValue);
    }
  }

  protected submit(): void {
    const strategy = this.documentStrategy();
    if (this.form.invalid || !strategy) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const profile: TrainerProfile = {
      photoDataUrl: raw.photoDataUrl,
      name: raw.name,
      favoriteHobby: raw.hobby,
      birthDate: raw.birthDate,
      documentKind: strategy.kind,
      documentValue: raw.documentValue || null
    };

    this.trainerStore.saveProfile(profile);

    // Editing an already-onboarded trainer only touches these fields — the
    // team stays as-is, so skip straight back to Home instead of forcing a
    // re-selection of all 3 Pokémon.
    const hasExistingTeam = this.trainerStore.team().length === TEAM_SIZE;
    void this.router.navigate([hasExistingTeam ? '/home' : '/onboarding/loading']);
  }
}
