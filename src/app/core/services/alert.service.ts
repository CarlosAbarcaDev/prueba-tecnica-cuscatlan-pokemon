import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

/**
 * Thin wrapper around SweetAlert2 so every feature shows errors the same
 * way (brand colors, consistent copy style) instead of calling Swal.fire
 * directly all over the codebase.
 */
@Injectable({ providedIn: 'root' })
export class AlertService {
  error(title: string, text?: string): void {
    void Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: '#01426a',
      confirmButtonText: 'Entendido'
    });
  }
}
