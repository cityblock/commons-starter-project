import { shallow } from 'enzyme';
import * as React from 'react';
import { PatientFilterOptions } from '../../graphql/types';
import PatientPanelHeader from '../patient-panel-header';

describe('Patient Search Header', () => {
  const filters = {
    gender: 'female',
    zip: '11238',
  } as PatientFilterOptions;
  const totalResults = 11;

  const wrapper = shallow(<PatientPanelHeader filters={filters} totalResults={totalResults} />);

  it('renders a container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders patient panel title', () => {
    expect(wrapper.find('.title').length).toBe(1);
    expect(wrapper.find('.lightBlue').text()).toBe(totalResults.toString());
  });
});
