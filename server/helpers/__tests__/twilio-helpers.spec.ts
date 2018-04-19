import { formatPhoneNumberForTwilio, validatePhoneNumberForTwilio } from '../twilio-helpers';

describe('Server Twilio Helpers', () => {
  describe('formatPhoneNumberForTwilio', () => {
    it('returns empty string if no phone number provided', () => {
      expect(formatPhoneNumberForTwilio('')).toBe('');
    });

    it('returns number with country code if none provided', () => {
      expect(formatPhoneNumberForTwilio('(123) 234-5678')).toBe('+11232345678');
    });

    it('returns number without country code if one provided', () => {
      expect(formatPhoneNumberForTwilio('+21234567890')).toBe('+21234567890');
    });

    it('adds plus sign if none provided', () => {
      expect(formatPhoneNumberForTwilio('21234567890')).toBe('+21234567890');
    });
  });

  describe('validatePhoneNumberForTwilio', () => {
    it('does not reject if valid format', async () => {
      const result = await validatePhoneNumberForTwilio('+11234567890');

      expect(result).toBeFalsy();
    });

    it('rejects if invalid format', async () => {
      await expect(validatePhoneNumberForTwilio('(123)234-5678')).rejects.toMatch(
        'Phone number must be in +12345678901 format',
      );
    });
  });
});
