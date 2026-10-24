import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';

import { TrainerStoreService } from '../../../app/core/services/trainer-store.service';
import { profileRequiredGuard } from '../../../app/core/guards/profile-required.guard';

describe('profileRequiredGuard', () => {
  function runGuard() {
    return TestBed.runInInjectionContext(() =>
      profileRequiredGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('redirects to /onboarding when there is no saved profile', () => {
    const result = runGuard();
    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/onboarding');
  });

  it('allows navigation once a profile has been saved', () => {
    const trainerStore = TestBed.inject(TrainerStoreService);
    trainerStore.saveProfile({
      photoDataUrl: null,
      name: 'José Sosa',
      favoriteHobby: null,
      birthDate: '2000-01-01',
      documentKind: 'dui',
      documentValue: '04341130-5'
    });

    expect(runGuard()).toBe(true);
  });
});
