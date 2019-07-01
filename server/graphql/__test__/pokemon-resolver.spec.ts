
import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction } from 'objection';

// Mutations
import pokemonCreate from '../../../app/graphql/queries/pokemon-create-mutation.graphql';
import pokemonDelete from '../../../app/graphql/queries/pokemon-delete-mutation.graphql';
import pokemonEdit from '../../../app/graphql/queries/pokemon-edit-mutation.graphql';

// Queries
// import getPokemon from '../../../app/graphql/queries/get-pokemon-query.graphql';
import getPokemonsQuery from '../../../app/graphql/queries/pokemon-getall-query.graphql';

import { setupDb } from '../../lib/test-utils';

import uuid from 'uuid';
import Pokemon from '../../models/Pokemon';
import { PokeType } from '../../models/PokeType';

import schema from '../make-executable-schema';


describe('Pokemon', () => {

  const pokemonInput = {
    pokemonNumber: 123,
    name: 'test_' + uuid(),
    moves: ['Slash', 'Flame Wheel'],
    attack: 0,
    defense: 0,
    pokeType: PokeType.dragon,
    imageUrl: 'test.png'
  }


  const pokemonCreateMutation = print(pokemonCreate);
  const pokemonDeleteMutation = print(pokemonDelete);
  const pokemonEditMutation = print(pokemonEdit);

  // const getPokemonQuery = print(getConcern);
  // const getPokemonsQuery = print(getPokemons);


  // Recreate the DB
  let testDb = null as any;

  beforeAll(async () => {
    testDb = await setupDb();
  });

  afterAll(async () => {
    await testDb.destroy();
  });

  // For each test start a new transaction and roll it back.
  let trx = null as any;

  beforeEach(async () => {
    trx = await transaction.start(Pokemon.knex());
  });

  afterEach(async () => {
    await trx.rollback();
  });


  it('creates a pokemon', async () => {
    const result = await graphql(
      schema,
      pokemonCreateMutation,
      null,
      { testTransaction: trx },
      pokemonInput,
    );
    expect(cloneDeep(result.data!.pokemonCreate)).toMatchObject(pokemonInput);
  });


  it('edits a pokemon name', async () => {

    const pokemonList = await Pokemon.getAll(trx);
    const pokemon = pokemonList[0]

    // Create a random name
    const name = 'edited_name_' + uuid();

    const { data } = await graphql(
      schema,
      pokemonEditMutation,
      null,
      { testTransaction: trx },
      {
        id: pokemon.id,
        name,
      },
    );

    expect(data.pokemonEdit.name).toBe(name);
  });


  it('deletes a pokemon', async () => {

    const pokemon = await Pokemon.create(pokemonInput, trx);
    const result = await graphql(
      schema,
      pokemonDeleteMutation,
      null,
      { testTransaction: trx },
      {
        pokemonId: pokemon.id
      },
    );
    expect(cloneDeep(result.data!.pokemonDelete).deletedAt).not.toBeFalsy();
  });



  it('returns all pokemons', async () => {

    const getPokemons = print(getPokemonsQuery)

    const pokemon1 = await Pokemon.create({
      pokemonNumber: 100,
      name: 'test_' + uuid(),
      moves: ['Slash', 'Flame Wheel'],
      attack: 0,
      defense: 0,
      pokeType: PokeType.dragon,
      imageUrl: 'test.png'
    }, trx);

    const pokemon2 = await Pokemon.create({
      pokemonNumber: 101,
      name: 'test_' + uuid(),
      moves: ['Flame Wheel'],
      attack: 3,
      defense: 4,
      pokeType: PokeType.fairy,
      imageUrl: 'test.png'
    }, trx);

    let result = await graphql(schema, getPokemons, null, {
      testTransaction: trx,
    });

    result = cloneDeep(result.data!.pokemons).map((c: Pokemon) => c.name);

    expect(result).toContain(pokemon2.name);
    expect(result).toContain(pokemon1.name);
  });

});
