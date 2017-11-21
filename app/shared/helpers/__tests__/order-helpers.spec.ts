import { insert, remove, reorder } from '../order-helpers';

describe('Order Helper Methods', () => {
  const initial = [1, 2, 3, 4, 5];
  const initialCopy = Array.from(initial);

  describe('Reorder', () => {
    const expected = [1, 4, 2, 3, 5];

    it('reorders elements in an array', () => {
      expect(reorder(initial, 3, 1)).toEqual(expected);
    });

    it('does not modify original array', () => {
      reorder(initial, 3, 1);
      expect(initial).toEqual(initialCopy);
    });
  });

  describe('Remove', () => {
    const expected = [1, 3, 4, 5];

    it('removes item at specified if valid index given', () => {
      expect(remove(initial, 1)).toEqual(expected);
    });

    it('does nothing if index invalid', () => {
      expect(remove(initial, -1)).toEqual(initial);
    });

    it('does not modify original array', () => {
      remove(initial, 1);
      expect(initial).toEqual(initialCopy);
    });
  });

  describe('Insert', () => {
    const expected = [1, 6, 2, 3, 4, 5];

    it('inserts item in desired location', () => {
      expect(insert(initial, 6, 1)).toEqual(expected);
    });

    it('does not modify original array', () => {
      insert(initial, 6, 1);
      expect(initial).toEqual(initialCopy);
    });
  });
});
