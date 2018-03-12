import {
  getActiveMapRoute,
  getCBOReferralPdfRoute,
  getMapTaskRoute,
  getPatientRoute,
} from '../route-helpers';

describe('Shared Route Helpers', () => {
  const patientId = 'danyTargaryen';
  const taskId = 'defeatCersei';

  it('returns base route to patient profile', () => {
    expect(getPatientRoute(patientId)).toBe(`/patients/${patientId}`);
  });

  it('returns route to patient MAP active tab', () => {
    expect(getActiveMapRoute(patientId)).toBe(`/patients/${patientId}/map/active`);
  });

  it('returns route to task in MAP', () => {
    expect(getMapTaskRoute(patientId, taskId)).toBe(
      `/patients/${patientId}/map/active/tasks/${taskId}`,
    );
  });

  it('returns a route to CBO referral form', () => {
    const authToken = 'abc123';

    expect(getCBOReferralPdfRoute(taskId, authToken)).toBe(
      `/pdf/${taskId}/referral-form.pdf?token=${authToken}`,
    );
  });
});
