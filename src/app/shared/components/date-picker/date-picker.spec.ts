import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerComponent } from './date-picker';

describe('DatePickerComponent', () => {
  let fixture: ComponentFixture<DatePickerComponent>;
  let component: DatePickerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DatePickerComponent] }).compileComponents();
    fixture = TestBed.createComponent(DatePickerComponent);
    fixture.componentRef.setInput('label', 'Fecha de nacimiento');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('formats an ISO date as DD/MonAbbrev/YYYY, matching the Figma display', () => {
    expect(component['formatDisplay']('2004-09-06')).toBe('06/Sept/2004');
  });

  it('starts closed and opens on trigger click', () => {
    expect(component['isOpen']).toBe(false);
    component['togglePanel']();
    expect(component['isOpen']).toBe(true);
  });

  it('emits the selected day as a local yyyy-MM-dd string and closes the panel', () => {
    let emitted: string | null = null;
    component.registerOnChange((value) => (emitted = value));
    component['togglePanel']();

    const sixth = component['days']().find((cell) => cell.inCurrentMonth && cell.day === 6)!;
    component['selectDay'](sixth, new Event('click'));

    const expected = `${sixth.date.getFullYear()}-${String(sixth.date.getMonth() + 1).padStart(2, '0')}-${String(
      sixth.date.getDate()
    ).padStart(2, '0')}`;
    expect(emitted).toBe(expected);
    expect(component['isOpen']).toBe(false);
  });

  it('jumps the visible month when a year is picked from the quick list', () => {
    component['selectYear'](2004, new Event('click'));
    expect(component['viewYear']()).toBe(2004);
    expect(component['panelMode']).toBe('days');
  });
});
