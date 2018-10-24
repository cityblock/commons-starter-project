import { shallow } from 'enzyme';
import React from 'react';
import { PokemonList } from '../pokemon-list';

describe('pokemon list component', () => {
  const wrapper = shallow(
    <PokemonList
      loading={false}
      error={null}
      pokemonList={[
        {
          id: 'hiImAnId',
          pokemonNumber: 1,
          name: 'Beyonce',
          imageUrl: 'hiImAnImage',
        },
        {
          id: 'hiImAnId2',
          pokemonNumber: 4,
          name: 'Solange',
          imageUrl: 'hiImAnImage2',
        },
      ]}
    />,
  );

  it('renders a paragraph for each pokemon', () => {
    expect(wrapper.find('p').length).toBe(2);

    expect(
      wrapper
        .find('p')
        .at(0)
        .text(),
    ).toBe('Beyonce');

    expect(
      wrapper
        .find('p')
        .at(1)
        .text(),
    ).toBe('Solange');
  });

  it('renders an image for each pokemon', () => {
    expect(wrapper.find('img').length).toBe(2);
  });

  it('renders loading if loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper.find('h1').text()).toBe('Loading...');
  });
});
