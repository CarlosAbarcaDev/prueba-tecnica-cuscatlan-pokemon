import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerStoreService } from '../../../core/services/trainer-store.service';
import { TrainerReviewCardComponent } from './trainer-review-card';

describe('TrainerReviewCardComponent', () => {
  let fixture: ComponentFixture<TrainerReviewCardComponent>;
  let trainerStore: TrainerStoreService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [TrainerReviewCardComponent] }).compileComponents();
    trainerStore = TestBed.inject(TrainerStoreService);
    fixture = TestBed.createComponent(TrainerReviewCardComponent);
  });

  afterEach(() => localStorage.clear());

  it('shows the document row (labeled DUI) when the profile has one', () => {
    trainerStore.saveProfile({
      photoDataUrl: null,
      name: 'José Sosa',
      favoriteHobby: 'Ver Series',
      birthDate: '2000-01-01',
      documentKind: 'dui',
      documentValue: '04341130-5'
    });
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('DUI:');
    expect(text).toContain('04341130-5');
  });

  it('hides the document row entirely when the value is null/empty (minor with no carnet)', () => {
    trainerStore.saveProfile({
      photoDataUrl: null,
      name: 'Ana',
      favoriteHobby: null,
      birthDate: '2015-01-01',
      documentKind: 'minority-card',
      documentValue: null
    });
    fixture.detectChanges();

    const rows = (fixture.nativeElement as HTMLElement).querySelectorAll('.trainer-review-card__row');
    expect(rows.length).toBe(2); // Pasatiempo + Edad only, no document row
  });
});
