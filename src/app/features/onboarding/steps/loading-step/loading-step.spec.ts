import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingStepComponent } from './loading-step';

describe('LoadingStepComponent', () => {
  let fixture: ComponentFixture<LoadingStepComponent>;
  let router: { navigateByUrl: ReturnType<typeof vi.fn> };

  function create(data: Record<string, unknown>): void {
    router = { navigateByUrl: vi.fn() };

    TestBed.configureTestingModule({
      imports: [LoadingStepComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: { snapshot: { data } } }
      ]
    });

    fixture = TestBed.createComponent(LoadingStepComponent);
  }

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('shows the label from route data', () => {
    create({ label: 'Cargando perfil...', next: '/onboarding/team' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Cargando perfil...');
  });

  it('navigates to the configured "next" route after the delay', () => {
    create({ label: 'Cargando...', next: '/onboarding/team' });
    fixture.detectChanges();

    expect(router.navigateByUrl).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1200);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/onboarding/team');
  });
});
