import { chunk } from '../../../app/core/utils/array.util';

describe('chunk', () => {
  it('splits a list into fixed-size groups', () => {
    expect(chunk([1, 2, 3, 4, 5, 6], 3)).toEqual([
      [1, 2, 3],
      [4, 5, 6]
    ]);
  });

  it('keeps a shorter final group instead of padding it', () => {
    expect(chunk([1, 2, 3, 4, 5], 3)).toEqual([
      [1, 2, 3],
      [4, 5]
    ]);
  });

  it('returns an empty array for an empty input', () => {
    expect(chunk([], 3)).toEqual([]);
  });
});
