import { shallow } from 'enzyme';
import { transaction } from 'objection';
import React from 'react';
import { setupDb } from '../../../server/lib/test-utils';
import Pokemon from '../../../server/models/Pokemon';
import { PokeList } from '../poke-list-container';

describe('poke-detail-container', () => {
  // Recreate the DB
  let testDb = null as any;

  beforeAll(async () => {
    testDb = setupDb();
  });

  afterAll(async () => {
    testDb.destroy();
  });

  // For each test start a new transaction and roll it back.
  let trx = null as any;
  let pokemonList = null as any;
  let component = null as any;

  beforeEach(async () => {
    trx = await transaction.start(Pokemon.knex());
    pokemonList = await Pokemon.getAll(trx);
    component = shallow(<PokeList pokemons={pokemonList} />);
  });

  afterEach(async () => {
    await trx.rollback();
  });

  /*
  { id: 'Sylveon',
        className: 'pokeImg',
        src:
         'https://cdn.bulbagarden.net/upload/thumb/e/e8/700Sylveon.png/500px-700Sylveon.png',
        style: { width: '10%' },
        alt: 'Sylveon' }
  */

  it('PokeListDetail: Generates components with images and alt', () => {
    component.find('.pokeImg').forEach((x: any) => {
      const pokeProps: any = x.props();
      expect(pokeProps).toHaveProperty('id');
      expect(pokeProps).toHaveProperty('alt');
      expect(pokeProps).toHaveProperty('className');
      expect(pokeProps).toHaveProperty('src');
    });
  });
});
