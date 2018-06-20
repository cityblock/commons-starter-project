import {
  formatAbbreviatedName,
  formatChannelDisplayName,
  formatChannelName,
  formatPatientName,
} from '../format-helpers';

describe('Server Format Helpers', () => {
  describe('formatAbbreviatedName', () => {
    it('returns formatted abbreviated name', () => {
      const formatted = formatAbbreviatedName('sansa', 'stark');

      expect(formatted).toBe('Sansa S.');
    });

    it('includes preferred name if specified', () => {
      const formatted = formatAbbreviatedName('sansa', 'stark', 'lady');

      expect(formatted).toBe('Sansa (Lady) S.');
    });
  });

  describe('formatChannelDisplayName', () => {
    it('returns formatted channel name', () => {
      expect(formatChannelDisplayName('Sansa', 'Stark', 11)).toBe('Sansa Stark 11');
    });
  });

  describe('formatChannelName', () => {
    it('returns formatted channel name', () => {
      expect(formatChannelName('Sansa Lady', 'Stark', 11)).toBe('sansa-lady-stark-11');
    });
  });

  describe('formatPatientName', () => {
    it('returns formatted patient name', () => {
      expect(formatPatientName('Sansa', 'Stark')).toBe('Sansa Stark');
    });
  });
});
