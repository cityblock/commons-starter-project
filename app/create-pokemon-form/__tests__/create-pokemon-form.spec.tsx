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

  it('renders an input for a name', () => {
    expect(wrapper.find('[name="name"]').length).toBe(1);
  });

  it('renders an input for a Pokemon Number', () => {
    expect(wrapper.find('[name="pokemonNumber"]').length).toBe(1);
  });

  it('renders an input for Attack', () => {
    expect(wrapper.find('[name="attack"]').length).toBe(1);
  });

  it('renders an input for Defense', () => {
    expect(wrapper.find('[name="defense"]').length).toBe(1);
  });

  it('renders an input for a Poketype', () => {
    expect(wrapper.find('[name="pokeType"]').length).toBe(1);
  });

  it('renders an input for Moves', () => {
    expect(wrapper.find('[name="moves"]').length).toBe(1);
  });

  it('renders an input for an Image URL', () => {
    expect(wrapper.find('[name="imageUrl"]').length).toBe(1);
  });

  it('has a button to submit the form', () => {
    expect(wrapper.find('button').length).toBe(1);
  });
});
