import { formatFilename } from '../helpers';

describe('PDF Handler Helpers', () => {
  describe('formatFileName', () => {
    it('returns formatted filename', () => {
      const filename = 'jonSnow';

      expect(formatFilename(filename)).toBe(`inline; filename="${filename}.pdf"`);
    });
  });
});
