import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { FloatingInputComponent } from '../molecules/floating-input/floating-input';
import { DuiFormatDirective } from './dui-format.directive';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FloatingInputComponent, DuiFormatDirective],
  template: `<app-floating-input label="DUI" [appDuiFormat]="active" [formControl]="control" />`
})
class HostComponent {
  control = new FormControl('', { nonNullable: true });
  active = true;
}

describe('DuiFormatDirective', () => {
  function createFixture(active: boolean): ComponentFixture<HostComponent> {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.active = active;
    fixture.detectChanges();
    return fixture;
  }

  function typeInto(fixture: ComponentFixture<HostComponent>, value: string): void {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
  });

  it('auto-inserts the hyphen after the 8th digit', () => {
    const fixture = createFixture(true);
    typeInto(fixture, '043411305');
    expect(fixture.componentInstance.control.value).toBe('04341130-5');
  });

  it('strips non-digit characters as the user types', () => {
    const fixture = createFixture(true);
    typeInto(fixture, '0434a1130b5');
    expect(fixture.componentInstance.control.value).toBe('04341130-5');
  });

  it('leaves the value untouched when disabled via [appDuiFormat]="false"', () => {
    const fixture = createFixture(false);
    typeInto(fixture, '043411305');
    expect(fixture.componentInstance.control.value).toBe('043411305');
  });
});
