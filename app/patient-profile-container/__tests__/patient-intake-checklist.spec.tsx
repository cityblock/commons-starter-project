import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import {
  completeComputedPatientStatus,
  incompleteComputedPatientStatus,
} from '../../shared/util/test-data';
import { PatientIntakeChecklist } from '../patient-intake-checklist';
import PatientIntakeChecklistItem, { IProps } from '../patient-intake-checklist-item';

describe('Patient Intake Checklist', () => {
  describe('an incomplete computed patient status', () => {
    const wrapper = shallow(
      <PatientIntakeChecklist
        patientId="patientId"
        computedPatientStatus={incompleteComputedPatientStatus}
      />,
    );

    it('renders the checklist', () => {
      expect((wrapper.find(PatientIntakeChecklistItem) as ShallowWrapper<IProps>).length).toBe(6);
      expect(wrapper.find('.checklist.hidden').length).toBe(0);
    });
  });

  describe('a complete computed patient status', () => {
    const wrapper = shallow(
      <PatientIntakeChecklist
        patientId="patientId"
        computedPatientStatus={completeComputedPatientStatus}
      />,
    );

    it('does not display the checklist', () => {
      expect(wrapper.find('.checklist.hidden').length).toBe(1);
    });
  });
});