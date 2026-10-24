import { FormControl } from '@angular/forms';

import { duiFormatValidator } from '../../../app/core/validators/dui.validator';

describe('duiFormatValidator', () => {
  it('accepts a well-formed DUI', () => {
    expect(duiFormatValidator(new FormControl('04341130-5'))).toBeNull();
  });

  it('rejects a DUI missing the hyphen', () => {
    expect(duiFormatValidator(new FormControl('043411305'))).toEqual({ duiFormat: true });
  });

  it('rejects a DUI with the wrong digit count', () => {
    expect(duiFormatValidator(new FormControl('4341130-5'))).toEqual({ duiFormat: true });
  });

  it('rejects non-numeric characters', () => {
    expect(duiFormatValidator(new FormControl('0434113O-5'))).toEqual({ duiFormat: true });
  });

  it('treats an empty value as valid, leaving required-ness to Validators.required', () => {
    expect(duiFormatValidator(new FormControl(''))).toBeNull();
  });
});
