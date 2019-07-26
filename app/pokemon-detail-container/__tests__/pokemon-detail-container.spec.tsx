import { shallow } from 'enzyme';
import React from 'react';
import { PokeType } from '../../graphql/types';
import { PokemonDetailContainer } from '../pokemon-detail-container';

describe('pokemon detail component', () => {
  const item = {
    id: '0315cff6-9fc3-4882-ac0a-0835a211a844',
    pokemonId: '0315cff6-9fc3-4882-ac0a-0835a211a843',
    name: 'Air Balloon',
    price: 50,
    happiness: 4,
    imageUrl: 'https://aster.fyi',
    createdAt: '2019-07-26T18:19:23.468Z',
    updatedAt: '2019-07-26T18:19:23.468Z',
    deletedAt: null
  };

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
    items: [item]
  };

  const wrapper = shallow(<PokemonDetailContainer 
    pokemon={pokemon} 
    match={{ params: { pokemonId: pokemon.id } }} 
  />)

  it("renders the pokemon's details", () => {
    expect(wrapper.find('h1').text()).toBe(pokemon.name);
    expect(wrapper.find('p').at(0).text()).toMatch(pokemon.pokeType);
    expect(wrapper.find('p').at(1).text()).toMatch(`${pokemon.attack}`);
    expect(wrapper.find('p').at(2).text()).toMatch(`${pokemon.defense}`);
    expect(wrapper.find('ul').at(0).text()).toBe(pokemon.moves.join(''));
  });

  it("shows an image of the pokemon", () => {
    expect(wrapper.find('img').at(0).props().src).toBe(pokemon.imageUrl);
  });

  it("renders the pokemon's items", () => {
    const itemListItemWrapper = wrapper.find('ul').at(1).find('li');

    expect(itemListItemWrapper.find('p').at(0).text()).toMatch(item.name);
    expect(itemListItemWrapper.find('p').at(1).text()).toMatch(`${item.price}`);
    expect(itemListItemWrapper.find('p').at(2).text()).toMatch(`${item.happiness}`);
    expect(itemListItemWrapper.find('img').props().src).toBe(item.imageUrl);
  });
});
