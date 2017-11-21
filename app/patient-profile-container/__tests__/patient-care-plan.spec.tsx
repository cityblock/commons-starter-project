import { shallow } from 'enzyme';
import * as React from 'react';
import PatientConcerns from '../../shared/concerns';
import Spinner from '../../shared/library/spinner/spinner';
import TextDivider from '../../shared/library/text-divider/text-divider';
import PatientCarePlan from '../patient-care-plan';

describe('Patient Care Plan Component', () => {
  const patientId = 'aryaStark';
  const routeBase = `/patients/${patientId}/map`;

  it('renders spinner if loading', () => {
    const wrapperLoading = shallow(
      <PatientCarePlan
        patientId={patientId}
        loading={true}
        routeBase={routeBase}
        selectedTaskId=""
        activeConcerns={[]}
        inactiveConcerns={[]}
      />,
    );

    expect(wrapperLoading.find(Spinner).length).toBe(1);
    expect(wrapperLoading.find(PatientConcerns).length).toBe(0);
  });

  const selectedTaskId = 'growlithe';
  const activeConcerns = ['activeConcern1', 'activeConcern2'] as any;
  const inactiveConcerns = ['inactiveConcern1', 'inactiveConcern2'] as any;

  const wrapper = shallow(
    <PatientCarePlan
      patientId={patientId}
      routeBase={routeBase}
      selectedTaskId={selectedTaskId}
      activeConcerns={activeConcerns}
      inactiveConcerns={inactiveConcerns}
    />,
  );

  const patientConcerns = wrapper.find(PatientConcerns);

  it('renders active and inactive concerns', () => {
    expect(patientConcerns.length).toBe(2);

    expect(patientConcerns.at(0).props().concerns).toEqual(activeConcerns);
    expect(patientConcerns.at(0).props().inactive).toBeFalsy();
    expect(patientConcerns.at(1).props().concerns).toEqual(inactiveConcerns);
    expect(patientConcerns.at(1).props().inactive).toBeTruthy();
  });

  it('renders text divider for next up concerns', () => {
    expect(wrapper.find(TextDivider).length).toBe(1);
    expect(wrapper.find(TextDivider).props().messageId).toBe('patientMap.nextUp');
  });

  it('passes selected task id as a prop', () => {
    expect(patientConcerns.at(0).props().selectedTaskId).toBe(selectedTaskId);
    expect(patientConcerns.at(1).props().selectedTaskId).toBe(selectedTaskId);
  });

  it('handles changes in ids of selected concern', () => {
    const selectedPatientConcernId = 'sylveon';

    expect(patientConcerns.at(0).props().selectedPatientConcernId).toBe('');
    expect(patientConcerns.at(1).props().selectedPatientConcernId).toBe('');

    wrapper.setState({ selectedPatientConcernId });
    const patientConcerns2 = wrapper.find(PatientConcerns);

    expect(patientConcerns2.at(0).props().selectedPatientConcernId).toBe(selectedPatientConcernId);
    expect(patientConcerns2.at(1).props().selectedPatientConcernId).toBe(selectedPatientConcernId);
  });

  it('handles changes in ids of toggled dropdown options menu', () => {
    const optionsDropdownConcernId = 'lycanroc';

    expect(patientConcerns.at(0).props().optionsDropdownConcernId).toBe('');
    expect(patientConcerns.at(1).props().optionsDropdownConcernId).toBe('');

    wrapper.setState({ optionsDropdownConcernId });
    const patientConcerns2 = wrapper.find(PatientConcerns);

    expect(patientConcerns2.at(0).props().optionsDropdownConcernId).toBe(optionsDropdownConcernId);
    expect(patientConcerns2.at(1).props().optionsDropdownConcernId).toBe(optionsDropdownConcernId);
  });
});
