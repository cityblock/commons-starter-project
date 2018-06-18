import { shallow } from 'enzyme';
import React from 'react';
import PatientIntakeChecklistItem from '../patient-intake-checklist-item';

describe('Patient Intake Checklist Item', () => {
  it('renders the correct classes when the item is incomplete', () => {
    const wrapper = shallow(
      <PatientIntakeChecklistItem
        isCompleted={false}
        labelId="fakeLabelId"
        subtextId="fakeSubtextId"
        buttonTextId="fakeButtonTextId"
        buttonLink="fakeButtonLink"
        onClick={() => true}
      />,
    );

    expect(wrapper.find('.completed').length).toBe(0);
  });

  it('renders the correct classes when the item is complete', () => {
    const wrapper = shallow(
      <PatientIntakeChecklistItem
        isCompleted={true}
        labelId="fakeLabelId"
        subtextId="fakeSubtextId"
        buttonTextId="fakeButtonTextId"
        buttonLink="fakeButtonLink"
        onClick={() => true}
      />,
    );

    expect(wrapper.find('.completed').length).toBe(1);
  });
});
