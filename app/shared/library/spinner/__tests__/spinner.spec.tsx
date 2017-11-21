import { shallow } from 'enzyme';
import * as React from 'react';
import Spinner from '../spinner';

describe('Library Spinner Component', () => {
  it('renders spinner with default styles', () => {
    const wrapper = shallow(<Spinner />);

    expect(wrapper.find('div').length).toBe(2);
    expect(
      wrapper
        .find('div')
        .at(1)
        .props().className,
    ).toBe('loadingSpinner');
  });

  it('renders spinner with custom styles', () => {
    const className = 'custom';
    const wrapper = shallow(<Spinner className={className} />);

    expect(wrapper.find('div').length).toBe(2);
    expect(
      wrapper
        .find('div')
        .at(1)
        .props().className,
    ).toBe(`loadingSpinner ${className}`);
  });
});
