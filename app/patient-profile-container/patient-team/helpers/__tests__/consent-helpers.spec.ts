import { getConsentLevel, getConsentSettingsObject } from '../consent-helpers';

describe('Consent Helpers', () => {
  describe('getConsentLevel', () => {
    it('returns partial consent level', () => {
      const consentSettings = {
        isConsentedForFamilyPlanning: true,
        isConsentedForHiv: false,
        isConsentedForGeneticTesting: false,
        isConsentedForStd: null,
        isConsentedForSubstanceUse: true,
        isConsentedForMentalHealth: true,
      };

      expect(getConsentLevel(consentSettings)).toBe('partialConsent');
    });

    it('returns partial consent level for partial settings objects', () => {
      const consentSettings = {
        isConsentedForFamilyPlanning: true,
        isConsentedForHiv: true,
        isConsentedForGeneticTesting: true,
        isConsentedForStd: true,
      };

      expect(getConsentLevel(consentSettings)).toBe('partialConsent');
    });

    it('returns full consent level', () => {
      const consentSettings = {
        isConsentedForFamilyPlanning: true,
        isConsentedForHiv: true,
        isConsentedForGeneticTesting: true,
        isConsentedForStd: true,
        isConsentedForSubstanceUse: true,
        isConsentedForMentalHealth: true,
      };

      expect(getConsentLevel(consentSettings)).toBe('fullConsent');
    });

    it('returns no consent level for all false', () => {
      const consentSettings = {
        isConsentedForFamilyPlanning: false,
        isConsentedForHiv: false,
        isConsentedForGeneticTesting: false,
        isConsentedForStd: false,
        isConsentedForSubstanceUse: false,
        isConsentedForMentalHealth: false,
      };

      expect(getConsentLevel(consentSettings)).toBe('noConsent');
    });

    it('returns no consent level for all null', () => {
      const consentSettings = {
        isConsentedForFamilyPlanning: null,
        isConsentedForHiv: null,
        isConsentedForGeneticTesting: null,
        isConsentedForStd: null,
        isConsentedForSubstanceUse: null,
        isConsentedForMentalHealth: null,
      };

      expect(getConsentLevel(consentSettings)).toBe('noConsent');
    });
  });

  describe('getConsentSettingsObject', () => {
    it('returns subset object with just consent settings', () => {
      const supersetObject = {
        isConsentedForFamilyPlanning: true,
        isConsentedForHiv: false,
        isConsentedForGeneticTesting: false,
        isConsentedForStd: null,
        isConsentedForSubstanceUse: true,
        isConsentedForMentalHealth: true,
        random1: 'something',
        random2: true,
        random3: 23,
      };
      expect(getConsentSettingsObject(supersetObject)).toMatchObject({
        isConsentedForFamilyPlanning: true,
        isConsentedForHiv: false,
        isConsentedForGeneticTesting: false,
        isConsentedForStd: null,
        isConsentedForSubstanceUse: true,
        isConsentedForMentalHealth: true,
      });
    });

    it('returns subset object with just consent settings for partial object', () => {
      const supersetObject = {
        isConsentedForFamilyPlanning: true,
        isConsentedForHiv: false,
        isConsentedForGeneticTesting: false,
        isConsentedForStd: null,
        random1: 'something',
        random2: true,
        random3: 23,
      };
      expect(getConsentSettingsObject(supersetObject)).toMatchObject({
        isConsentedForFamilyPlanning: true,
        isConsentedForHiv: false,
        isConsentedForGeneticTesting: false,
        isConsentedForStd: null,
      });
    });
  });
});
