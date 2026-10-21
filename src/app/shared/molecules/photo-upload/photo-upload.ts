import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  inject,
  viewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { AlertService } from '../../../core/services/alert.service';
import { CardShellComponent } from '../../atoms/card-shell/card-shell';
import { IconComponent } from '../../atoms/icon/icon';

const ACCEPTED_EXTENSIONS = ['jpg', 'jpeg', 'png'];
const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

function noop(): void {
  /* intentionally empty default CVA callback */
}

/**
 * Trainer photo dropzone matching the Figma "Imágen perfil" card: yellow
 * rounded card, circular preview once a photo is picked, and a filename
 * pill with a remove button. Rejects anything but JPG/JPEG/PNG with a
 * SweetAlert2 error instead of silently failing.
 */
@Component({
  selector: 'app-photo-upload',
  imports: [CardShellComponent, IconComponent],
  templateUrl: './photo-upload.html',
  styleUrl: './photo-upload.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhotoUploadComponent),
      multi: true
    }
  ]
})
export class PhotoUploadComponent implements ControlValueAccessor {
  private readonly alert = inject(AlertService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  protected photoDataUrl: string | null = null;
  protected fileName: string | null = null;
  protected disabled = false;

  private onChange: (value: string | null) => void = noop;
  private onTouched: () => void = noop;

  writeValue(value: string | null): void {
    this.photoDataUrl = value;
    if (!value) {
      this.fileName = null;
    }
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected openFilePicker(): void {
    if (!this.disabled) {
      this.fileInput().nativeElement.click();
    }
  }

  protected handleFileSelected(event: Event): void {
    this.onTouched();
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) {
      return;
    }

    if (!this.isAcceptedFormat(file)) {
      this.alert.error(
        'Formato no soportado',
        'Solo se permiten imágenes JPG, JPEG o PNG.'
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.photoDataUrl = reader.result as string;
      this.fileName = file.name;
      this.onChange(this.photoDataUrl);
      // FileReader callbacks don't originate from this component's own
      // template bindings, so OnPush won't pick up the change on its own.
      this.cdr.markForCheck();
    };
    reader.readAsDataURL(file);
  }

  protected removePhoto(event: Event): void {
    event.stopPropagation();
    this.photoDataUrl = null;
    this.fileName = null;
    this.onChange(null);
  }

  private isAcceptedFormat(file: File): boolean {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    return ACCEPTED_EXTENSIONS.includes(extension) && ACCEPTED_MIME_TYPES.includes(file.type);
  }
}
