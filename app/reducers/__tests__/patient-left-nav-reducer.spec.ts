import { IUpdatePatientLeftNavSelected } from '../../actions/patient-left-nav-action';
import { patientLeftNavReducer } from '../patient-left-nav-reducer';

describe('Patient Left Nav Reducer', () => {
  it('returns updated state with appropriate action', () => {
    const action = {
      type: 'UPDATE_PATIENT_LEFT_NAV_SELECTED',
      selected: 'message',
    } as IUpdatePatientLeftNavSelected;

    const newState = patientLeftNavReducer(null, action);
    expect(newState).toBe('message');
  });

  it('returns default state if action of wrong type', () => {
    const action = {
      type: 'WRONG_TYPE',
    } as any;

    const newState = patientLeftNavReducer(null, action);
    expect(newState).toBeNull();
  });
});
