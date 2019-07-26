import { render, shallow } from 'enzyme';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-test-renderer';
import { CreatePokemonForm, PokeType } from '../create-pokemon-form';

describe('create pokemon component', () => {
  let container;
  const wrapper = render(<CreatePokemonForm />);
  const testStateWrapper = shallow(<CreatePokemonForm />);
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it('renders a button to submit pokemon', () => {
    expect(wrapper.find(`input[type="submit"]`)).toHaveLength(1);
  });
  it('renders a dropdown to select pokemon type', () => {
    expect(wrapper.find(`select[eltname="pokeType"]`)).toHaveLength(0);
  });
  it('should render', () => {
    expect(testStateWrapper.exists()).toBeTruthy();
  });
  it('should render with initial state with useState', () => {
    act(() => {
      ReactDOM.render(<CreatePokemonForm />, container);
    });
    const pokemonNumber = container.querySelector(`input[name="pokemonNumber"]`).value;
    expect(pokemonNumber).toBe(`13`);
  });
});
