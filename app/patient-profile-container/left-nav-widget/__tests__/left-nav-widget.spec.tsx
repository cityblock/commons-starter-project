import { shallow } from 'enzyme';
import * as React from 'react';
import LeftNavActions from '../left-nav-actions';
import LeftNavWidget from '../left-nav-widget';

describe('Patient Left Navigation Widget', () => {
  const patientId = 'sansaStark';

  const wrapper = shallow(<LeftNavWidget patientId={patientId} />);

  it('renders left navigation actions', () => {
    expect(wrapper.find(LeftNavActions).length).toBe(1);
  });
});
