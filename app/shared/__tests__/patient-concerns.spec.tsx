import { shallow } from 'enzyme';
import * as React from 'react';
import PatientConcern from '../concerns/concern';
import PatientConcerns from '../concerns/patient-concerns';
import EmptyPlaceholder from '../library/empty-placeholder/empty-placeholder';

describe('Patient Care Plan Concerns Component', () => {
  const onClick = (() => true) as any;
  const onOptionsToggle = (() => () => true) as any;
  const selectedPatientConcernId = 'umbreon';
  const optionsDropdownConcernId = 'glaceon';

  it('renders no concerns if no next up concerns present', () => {
    const wrapper = shallow(
      <PatientConcerns
        onClick={onClick}
        onOptionsToggle={onOptionsToggle}
        concerns={[]}
        selectedTaskId=""
        selectedPatientConcernId={selectedPatientConcernId}
        optionsDropdownConcernId={optionsDropdownConcernId}
        inactive={true}
      />,
    );

    expect(wrapper.find(EmptyPlaceholder).length).toBe(1);
    expect(wrapper.find(EmptyPlaceholder).props().headerMessageId).toBe(
      'patientMap.emptyNextUpHeader',
    );
    expect(wrapper.find(EmptyPlaceholder).props().detailMessageId).toBe(
      'patientMap.emptyNextUpDetail',
    );

    expect(wrapper.find(PatientConcern).length).toBe(0);
  });

  describe('Concerns present', () => {
    const concern1 = {
      id: 'umbreon',
    };
    const concern2 = {
      id: 'glaceon',
    };

    const concerns = [concern1, concern2] as any;

    const wrapper = shallow(
      <PatientConcerns
        onClick={onClick}
        onOptionsToggle={onOptionsToggle}
        concerns={concerns}
        selectedTaskId=""
        selectedPatientConcernId={selectedPatientConcernId}
        optionsDropdownConcernId={optionsDropdownConcernId}
      />,
    );

    it('renders correct number of patient concerns', () => {
      expect(wrapper.find(PatientConcern).length).toBe(2);
    });

    it('passes correct props to selected concern', () => {
      const renderedConcern1Props = wrapper
        .find(PatientConcern)
        .at(0)
        .props();

      expect(renderedConcern1Props.selected).toBeTruthy();
      expect(renderedConcern1Props.optionsOpen).toBeFalsy();
      expect(renderedConcern1Props.onClick).toBe(onClick);
      expect(renderedConcern1Props.onOptionsToggle).toBe(onOptionsToggle);
      expect(renderedConcern1Props.patientConcern).toBe(concern1);
    });

    it('passes correct props to concern with options open', () => {
      const renderedConcern1Props = wrapper
        .find(PatientConcern)
        .at(1)
        .props();

      expect(renderedConcern1Props.selected).toBeFalsy();
      expect(renderedConcern1Props.optionsOpen).toBeTruthy();
      expect(renderedConcern1Props.onClick).toBe(onClick);
      expect(renderedConcern1Props.onOptionsToggle).toBe(onOptionsToggle);
      expect(renderedConcern1Props.patientConcern).toBe(concern2);
    });
  });
});
