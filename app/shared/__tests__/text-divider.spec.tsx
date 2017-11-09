import { shallow } from 'enzyme';
import * as React from 'react';
import TextDivider from '../text-divider';

describe('Text Divider Component', () => {
  const label = 'sansaStark';
  const wrapper = shallow(<TextDivider label={label} />);

  it('renders label', () => {
    expect(wrapper.find('p').text()).toBe(label);
  });

  it('renders divider', () => {
    expect(wrapper.find('div').length).toBe(2);
  });
});
