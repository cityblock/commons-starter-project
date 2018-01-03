import { calculateRisk } from '../helpers';

describe('Patient 360 Helpers', () => {
  describe('calculateRisk', () => {
    const mediumRiskThreshold = 4;
    const highRiskThreshold = 8;

    it('returns null if no risk score given', () => {
      expect(calculateRisk(null, mediumRiskThreshold, highRiskThreshold)).toBeNull();
    });

    it('returns null if total score is null (not answered)', () => {
      expect(
        calculateRisk(
          {
            totalScore: null,
            forceHighRisk: false,
          },
          mediumRiskThreshold,
          highRiskThreshold,
        ),
      ).toBeNull();
    });

    it('returns high if force high risk', () => {
      expect(
        calculateRisk(
          {
            totalScore: 0,
            forceHighRisk: true,
          },
          mediumRiskThreshold,
          highRiskThreshold,
        ),
      ).toBe('high');
    });

    it('returns high if above high risk threshold', () => {
      expect(
        calculateRisk(
          {
            totalScore: 10,
            forceHighRisk: false,
          },
          mediumRiskThreshold,
          highRiskThreshold,
        ),
      ).toBe('high');
    });

    it('returns medium if above medium risk threshold', () => {
      expect(
        calculateRisk(
          {
            totalScore: 4,
            forceHighRisk: false,
          },
          mediumRiskThreshold,
          highRiskThreshold,
        ),
      ).toBe('medium');
    });

    it('returns low if below medium risk threshold', () => {
      expect(
        calculateRisk(
          {
            totalScore: 0,
            forceHighRisk: false,
          },
          mediumRiskThreshold,
          highRiskThreshold,
        ),
      ).toBe('low');
    });
  });
});
