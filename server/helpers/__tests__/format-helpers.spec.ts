import { formatAbbreviatedName } from '../format-helpers';

describe('Server Format Helpers', () => {
  describe('formatAbbreviatedName', () => {
    it('returns formatted abbreviated name', () => {
      const formatted = formatAbbreviatedName('sansa', 'stark');

      expect(formatted).toBe('Sansa S.');
    });
  });
});
