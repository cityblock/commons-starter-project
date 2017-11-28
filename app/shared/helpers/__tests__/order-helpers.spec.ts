import { getOrderDiffs, insert, remove, reorder } from '../order-helpers';

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

    it('returns empty array if removing last item', () => {
      expect(remove([1], 0)).toEqual([]);
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

  describe('getOrderDiffs', () => {
    const id1 = 'charmander';
    const id2 = 'charmeleon';
    const id3 = 'charizard';

    it('gets the diffs when reordering in one list', () => {
      const oldList = [
        { id: id1, order: 1 },
        { id: id2, order: 2 },
        { id: id3, order: 3 },
      ] as any;

      const newList = [
        { id: id1, order: 1 },
        { id: id3, order: 3 },
        { id: id2, order: 2 },
      ] as any;

      expect(getOrderDiffs(oldList, newList)).toEqual([
        { id: id3, order: 2 },
        { id: id2, order: 3 },
      ]);
    });

    it('gets the diffs when reordering in list with offset', () => {
      const oldList = [
        { id: id1, order: 1 },
        { id: id2, order: 2 },
        { id: id3, order: 3 },
      ] as any;

      const newList = [
        { id: id1, order: 1 },
        { id: id3, order: 3 },
        { id: id2, order: 2 },
      ] as any;

      expect(getOrderDiffs(oldList, newList, 4)).toEqual([
        { id: id1, order: 5 },
        { id: id3, order: 6 },
        { id: id2, order: 7 },
      ]);
    });

    it('adds change to startedAt if moving from active to inactive', () => {
      const oldList = [
        { id: id1, order: 1 },
        { id: id2, order: 2, startedAt: 11 },
        { id: id3, order: 3 },
      ] as any;

      const newList = [
        { id: id1, order: 1 },
        { id: id2, order: 2, startedAt: 11 },
        { id: id3, order: 3 },
      ] as any;

      expect(getOrderDiffs(oldList, newList, 0, id2)).toEqual([
        { id: id2, startedAt: null },
      ]);
    });

    it('adds change to startedAt if from inactive to active', () => {
      const oldList = [
        { id: id1, order: 1 },
        { id: id2, order: 2, startedAt: null },
        { id: id3, order: 3 },
      ] as any;

      const newList = [
        { id: id1, order: 1 },
        { id: id2, order: 2, startedAt: null },
        { id: id3, order: 3 },
      ] as any;

      const result = getOrderDiffs(oldList, newList, 0, id2);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe(id2);
      expect(result[0].startedAt).toBeTruthy();
    });

    it('reorders and changes startedAt', () => {
      const oldList = [
        { id: id1, order: 1 },
        { id: id2, order: 2, startedAt: 11 },
        { id: id3, order: 3 },
      ] as any;

      const newList = [
        { id: id1, order: 1 },
        { id: id3, order: 3 },
        { id: id2, order: 2, startedAt: 11 },
      ] as any;

      expect(getOrderDiffs(oldList, newList, 0, id2)).toEqual([
        { id: id3, order: 2 },
        { id: id2, order: 3, startedAt: null },
      ]);
    });

    it('returns empty arary if no changes made', () => {
      const oldList = [
        { id: id1, order: 1 },
        { id: id2, order: 2 },
        { id: id3, order: 3 },
      ] as any;

      const newList = [
        { id: id1, order: 1 },
        { id: id2, order: 2 },
        { id: id3, order: 3 },
      ] as any;

      expect(getOrderDiffs(oldList, newList)).toEqual([]);
    });
  });
});
