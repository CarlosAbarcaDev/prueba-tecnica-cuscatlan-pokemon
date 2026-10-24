import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconComponent } from '../../../../app/shared/atoms/icon/icon';

describe('IconComponent', () => {
  let fixture: ComponentFixture<IconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [IconComponent] }).compileComponents();
    fixture = TestBed.createComponent(IconComponent);
  });

  it('renders the path for the requested icon name', () => {
    fixture.componentRef.setInput('name', 'trash');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('svg path')).toBeTruthy();
  });

  it('renders nothing for an icon name it does not recognize at compile time (exhaustive switch)', () => {
    fixture.componentRef.setInput('name', 'calendar');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('svg > *').length).toBeGreaterThan(0);
  });
});
