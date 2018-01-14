import { shallow } from 'enzyme';
import * as React from 'react';
import MainContainer from '../main-container';

it('renders main container correctly', () => {
  const wrapper = shallow(<MainContainer />);
  expect(wrapper.find('.body').length).toBe(1);
});
