import { shallow } from 'enzyme';
import React from 'react';
import { CreatePokemonForm } from '../create-pokemon-form';

describe('Create Pokemon Form', () => {
  const wrapper = shallow(
    <CreatePokemonForm loading={false} error={null} createPokemon={jest.fn()} />,
  );

  it('has 7 input fields', () => {
    expect(wrapper.find('input').length).toBe(7);
  });

  it('first input is for "name"', () => {
    expect(
      wrapper
        .find('input')
        .at(0)
        .prop('name'),
    ).toBe('name');
  });

  it('second input is for "pokemonNumber"', () => {
    expect(
      wrapper
        .find('input')
        .at(1)
        .prop('name'),
    ).toBe('pokemonNumber');
  });

  it('third input if for "attack"', () => {
    expect(
      wrapper
        .find('input')
        .at(2)
        .prop('name'),
    ).toBe('attack');
  });

  it('fourth input is for "defense"', () => {
    expect(
      wrapper
        .find('input')
        .at(3)
        .prop('name'),
    ).toBe('defense');
  });

  it('fifth input is for "pokeType"', () => {
    expect(
      wrapper
        .find('input')
        .at(4)
        .prop('name'),
    ).toBe('pokeType');
  });

  it('sixth input is for "moves"', () => {
    expect(
      wrapper
        .find('input')
        .at(5)
        .prop('name'),
    ).toBe('moves');
  });

  it('seventh input is for "imageUrl"', () => {
    expect(
      wrapper
        .find('input')
        .at(6)
        .prop('name'),
    ).toBe('imageUrl');
  });

  it('has a button to submit the form', () => {
    expect(wrapper.find('button').length).toBe(1);
  });

  it('renders updates the for the name input', () => {
    wrapper.setState({ name: 'Alicia' });
    expect(
      wrapper
        .find('input')
        .at(0)
        .prop('value'),
    ).toBe('Alicia');
  });
});
