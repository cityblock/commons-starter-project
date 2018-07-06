import React from 'react';
import { shallow } from 'enzyme';
import { MainContainer } from '../main-container';

describe('Main Container', () => {
  const wrapper = shallow(
    <MainContainer
      loading={false}
      error={null}
      puppies={[
        {
          id: '1',
          name: 'Sweet Pea',
        },
        {
          id: '2',
          name: 'Spud',
        },
      ]}
    />,
  );

  it('renders a paragraph for each puppy', () => {
    expect(wrapper.find('p').length).toBe(2);

    expect(
      wrapper
        .find('p')
        .at(0)
        .text(),
    ).toBe('Sweet Pea');
    expect(
      wrapper
        .find('p')
        .at(1)
        .text(),
    ).toBe('Spud');
  });

  it('renders loading if loading', () => {
    wrapper.setProps({ loading: true });

    expect(wrapper.find('h1').text()).toBe('Loading...');
  });
});
