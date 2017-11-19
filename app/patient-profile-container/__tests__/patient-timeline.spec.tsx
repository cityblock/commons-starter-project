import { shallow } from 'enzyme';
import * as React from 'react';
import { patient } from '../../shared/util/test-data';
import { PatientTimeline as Component } from '../patient-timeline';

const match = { params: { patientId: patient.id } };

it('renders timeline', () => {
  const component = shallow(<Component match={match} />);
  const instance = component.instance() as Component;
  const result = instance.render();
  expect(result).toMatchSnapshot();
});
