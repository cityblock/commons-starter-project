import { shallow } from 'enzyme';
import * as React from 'react';
import TextDivider from '../../../shared/library/text-divider/text-divider';
import { patient } from '../../../shared/util/test-data';
import PatientCalendar from '../patient-calendar';

describe('Render Skinny Patient Calendar', () => {
  const wrapper = shallow(<PatientCalendar patientId={patient.id} />);

  it('renders the calendar list', () => {
    const events = wrapper.find('.eventContainer');
    expect(events).toHaveLength(4);

    const dividers = wrapper.find(TextDivider);
    expect(dividers).toHaveLength(3);
  });
});
