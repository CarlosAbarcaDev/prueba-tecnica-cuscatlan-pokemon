import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
    void this.router.navigate(['/onboarding/loading']);
  }
}
