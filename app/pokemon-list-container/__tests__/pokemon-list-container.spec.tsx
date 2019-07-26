import { shallow } from 'enzyme';
import React from 'react';
import { Link } from 'react-router-dom';
import { PokeType } from '../../graphql/types';
import { PokemonListContainer } from '../pokemon-list-container';
 
describe('pokemon list component', () => {
  const pokemon = {
    id: '0315cff6-9fc3-4882-ac0a-0835a211a843',
    pokemonNumber: 13,
    name: 'Aster',
    attack: 100,
    defense: 100,
    pokeType: 'ghost' as PokeType,
    moves: ['sleep', 'dab'],
    imageUrl: 'https://aster.fyi',
    createdAt: '2019-07-26T18:19:23.468Z',
    updatedAt: '2019-07-26T18:19:23.468Z',
    deletedAt: null,
    items: [{
      id: '0315cff6-9fc3-4882-ac0a-0835a211a844',
      pokemonId: '0315cff6-9fc3-4882-ac0a-0835a211a843',
      name: 'Air Balloon',
      price: 50,
      happiness: 4,
      imageUrl: 'https://aster.fyi',
      createdAt: '2019-07-26T18:19:23.468Z',
      updatedAt: '2019-07-26T18:19:23.468Z',
      deletedAt: null
    }]
  };

  const wrapper = shallow(<PokemonListContainer allPokemon={[pokemon]} />);

  it('renders a list with the pokemon in it', () => {
    const pokemonListItem = wrapper.find('li').at(1);

    expect(pokemonListItem.find(Link).props().to).toMatch(pokemon.id);
    expect(pokemonListItem.find('img').props().src).toBe(pokemon.imageUrl);
    expect(pokemonListItem.find('span').at(1).text()).toBe(pokemon.name);
  });

  it('renders a link to the create form', () => {
    const createPokemonListItem = wrapper.find('li').at(0);

    expect(createPokemonListItem.find(Link).props().to).toBe('/')
    expect(createPokemonListItem.find('span').text()).toBe('Create Pokemon')
  });
});
