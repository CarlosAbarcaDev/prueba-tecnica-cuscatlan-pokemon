import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingPokeballComponent } from '../../../../app/shared/molecules/loading-pokeball/loading-pokeball';

describe('LoadingPokeballComponent', () => {
  let fixture: ComponentFixture<LoadingPokeballComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [LoadingPokeballComponent] }).compileComponents();
    fixture = TestBed.createComponent(LoadingPokeballComponent);
  });

  it('defaults to the "Cargando..." label', () => {
    fixture.detectChanges();
    const text: HTMLElement = fixture.nativeElement.querySelector('.loading-pokeball__label');
    expect(text.textContent?.trim()).toBe('Cargando...');
  });

  it('renders a custom label, e.g. for the profile-loading screen', () => {
    fixture.componentRef.setInput('label', 'Cargando perfil...');
    fixture.detectChanges();
    const text: HTMLElement = fixture.nativeElement.querySelector('.loading-pokeball__label');
    expect(text.textContent?.trim()).toBe('Cargando perfil...');
  });
});
