import { getActiveMapRoute } from '../route-helpers';

describe('Shared Route Helpers', () => {
  describe('getActiveMapRoute', () => {
    it('returns route to patient MAP active tab', () => {
      const patientId = 'danyTargaryen';

      expect(getActiveMapRoute(patientId)).toBe(`/patients/${patientId}/map/active`);
    });
  });
});
