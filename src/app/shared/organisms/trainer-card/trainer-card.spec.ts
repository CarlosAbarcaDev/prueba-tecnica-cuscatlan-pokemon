import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerStoreService } from '../../../core/services/trainer-store.service';
import { TrainerCardComponent } from './trainer-card';

describe('TrainerCardComponent', () => {
  let fixture: ComponentFixture<TrainerCardComponent>;
  let trainerStore: TrainerStoreService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [TrainerCardComponent] }).compileComponents();
    trainerStore = TestBed.inject(TrainerStoreService);
    fixture = TestBed.createComponent(TrainerCardComponent);
  });

  afterEach(() => localStorage.clear());

  it('shows the DUI for an adult trainer', () => {
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

  it('never shows a document row for a minor', () => {
    trainerStore.saveProfile({
      photoDataUrl: null,
      name: 'Ana',
      favoriteHobby: null,
      birthDate: '2015-01-01',
      documentKind: 'minority-card',
      documentValue: '12345'
    });
    fixture.detectChanges();

    const rows = (fixture.nativeElement as HTMLElement).querySelectorAll('.trainer-card__row');
    expect(rows.length).toBe(2);
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('12345');
  });
});
