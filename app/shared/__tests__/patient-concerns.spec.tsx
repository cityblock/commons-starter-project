import { shallow } from 'enzyme';
import React from 'react';
import DnDPatientConcern from '../../patient-profile-container/drag-and-drop/drag-and-drop-patient-concern';
import { PatientConcerns } from '../concerns/patient-concerns';
import EmptyPlaceholder from '../library/empty-placeholder/empty-placeholder';
import { currentUser } from '../util/test-data';

describe('Patient Care Plan Concerns Component', () => {
  const onClick = (() => true) as any;
  const selectedPatientConcernId = 'umbreon';

  it('renders no concerns if no next up concerns present', () => {
    const wrapper = shallow(
      <PatientConcerns
        onClick={onClick}
        concerns={[]}
        selectedTaskId=""
        glassBreakId={null}
        selectedGoalId=""
        selectedPatientConcernId={selectedPatientConcernId}
        inactive={true}
        currentUser={currentUser}
        loading={false}
        error={null}
      />,
    );

    expect(wrapper.find(EmptyPlaceholder).length).toBe(1);
    expect(wrapper.find(EmptyPlaceholder).props().headerMessageId).toBe(
      'patientMap.emptyNextUpHeader',
    );
    expect(wrapper.find(EmptyPlaceholder).props().detailMessageId).toBe(
      'patientMap.emptyNextUpDetail',
    );

    expect(wrapper.find(DnDPatientConcern).length).toBe(0);
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
        concerns={concerns}
        glassBreakId={null}
        selectedTaskId=""
        selectedGoalId=""
        selectedPatientConcernId={selectedPatientConcernId}
        currentUser={currentUser}
        loading={false}
        error={null}
      />,
    );

    it('renders correct number of patient concerns', () => {
      expect(wrapper.find(DnDPatientConcern).length).toBe(2);
    });

    it('passes correct props to selected concern', () => {
      const renderedConcern1Props = wrapper
        .find(DnDPatientConcern)
        .at(0)
        .props();

      expect(renderedConcern1Props.selected).toBeTruthy();
      expect(renderedConcern1Props.optionsOpen).toBeFalsy();
      expect(renderedConcern1Props.patientConcern).toBe(concern1);
      expect(renderedConcern1Props.index).toBe(0);
    });

    it('passes correct props to selected concern', () => {
      const renderedConcern1Props = wrapper
        .find(DnDPatientConcern)
        .at(1)
        .props();

      expect(renderedConcern1Props.selected).toBeFalsy();
      expect(renderedConcern1Props.optionsOpen).toBeFalsy();
      expect(renderedConcern1Props.patientConcern).toBe(concern2);
      expect(renderedConcern1Props.index).toBe(1);
    });
  });
});
