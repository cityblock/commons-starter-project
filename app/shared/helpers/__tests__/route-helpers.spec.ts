import { getActiveMapRoute, getMapTaskRoute } from '../route-helpers';

describe('Shared Route Helpers', () => {
  const patientId = 'danyTargaryen';
  const taskId = 'defeatCersei';

  describe('getActiveMapRoute', () => {
    it('returns route to patient MAP active tab', () => {
      expect(getActiveMapRoute(patientId)).toBe(`/patients/${patientId}/map/active`);
    });

    it('returns route to task in MAP', () => {
      expect(getMapTaskRoute(patientId, taskId)).toBe(
        `/patients/${patientId}/map/active/tasks/${taskId}`,
      );
    });
  });
});
