import { updatePatientLeftNavSelected } from '../patient-left-nav-action';

describe('Patient Left Nav Action', () => {
  describe('updatePatientLeftNavSelected', () => {
    it('creates an action to update patient left nav state', () => {
      const action = updatePatientLeftNavSelected('message');

      expect(action.type).toBe('UPDATE_PATIENT_LEFT_NAV_SELECTED');
      expect(action.selected).toBe('message');
    });
  });
});
