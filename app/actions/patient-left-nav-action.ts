import { IState as PatientLeftNavReducerState } from '../reducers/patient-left-nav-reducer';

export interface IUpdatePatientLeftNavSelected {
  type: 'UPDATE_PATIENT_LEFT_NAV_SELECTED';
  selected: PatientLeftNavReducerState;
}

export const updatePatientLeftNavSelected = (
  selected: PatientLeftNavReducerState,
): IUpdatePatientLeftNavSelected => ({
  type: 'UPDATE_PATIENT_LEFT_NAV_SELECTED',
  selected,
});
