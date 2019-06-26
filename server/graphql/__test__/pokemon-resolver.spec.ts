
import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction } from 'objection';

// Mutations
import pokemonCreate from '../../../app/graphql/queries/pokemon-create-mutation.graphql';
import pokemonDelete from '../../../app/graphql/queries/pokemon-delete-mutation.graphql';
import pokemonEdit from '../../../app/graphql/queries/pokemon-edit-mutation.graphql';

// Queries
// import getPokemon from '../../../app/graphql/queries/get-pokemon-query.graphql';
// import getPokemons from '../../../app/graphql/queries/pokemon-getall-query.graphql';

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
    const id = pokemonList[0].id

    // Create a random name
    const name = 'edited_name_' + uuid();


    const { data } = await graphql(
      schema,
      pokemonEditMutation,
      null,
      { testTransaction: trx },
      {
        pokemonId: id,
        name,
      },
    );

    expect(cloneDeep(data.pokemonEdit)).toMatchObject({ name, });
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



});










/*


describe('Pokemon', async () => {
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
  const getPokemonsQuery = print(getPokemons);


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

  beforeEach(async () => {
    trx = await transaction.start(Pokemon.knex());
  });

  afterEach(async () => {
    await trx.rollback();
  });

  /*
    describe('pokemon get all', () => {
      it('returns concerns', async () => {
        const pokemon1 = await Pokemon.create({
          pokemonNumber: 100,
          name: 'test_' + uuid(),
          moves: ['Slash', 'Flame Wheel'],
          attack: 0,
          defense: 0,
          pokeType: PokeType.dragon,
          imageUrl: 'test.png'
        }, txn);

        const pokemon2 = await Pokemon.create({
          pokemonNumber: 101,
          name: 'test_' + uuid(),
          moves: ['Flame Wheel'],
          attack: 3,
          defense: 4,
          pokeType: PokeType.fairy,
          imageUrl: 'test.png'
        }, txn);

        const result = await graphql(schema, getPokemonsQuery, null, {
          testTransaction: txn,
        });
        const pokemonAll = cloneDeep(result.data!.pokemon).map((c: Pokemon) => c.name);
        expect(pokemonAll).toContain(pokemon2.name);
        expect(pokemonAll).toContain(pokemon1.name);
      });
    });
  */

/*

  it('creates a pokemon', async () => {
    const result = await graphql(
      schema,
      pokemonCreateMutation,
      null,
      { testTransaction: txn },
      pokemonInput,
    );
    expect(cloneDeep(result.data!.pokemonCreate)).toMatchObject(pokemonInput);
  });

*/
/*

  describe('pokemon edit', () => {

    it('edits a pokemon name', async () => {

      const pokemonList = await Pokemon.getAll(txn);
      const id = pokemonList[0].id

      // Create a random name
      const name = 'edited_name_' + uuid();


      const { data } = await graphql(
        schema,
        pokemonEditMutation,
        null,
        { testTransaction: txn },
        {
          pokemonId: id,
          name,
        },
      );

      expect(cloneDeep(data.pokemonEdit)).toMatchObject({ name, });
    });
*/
/*
it('edits a concern by adding a resource url', async () => {
  const { data } = await graphql(
    schema,
    concernEditMutation,
    null,
    { permissions, userId: user.id, marketId: user.homeMarketId, testTransaction: txn },
    {
      title: 'Medical',
      concernId: concern.id,
      resourceUrl: mockResourceUrl,
    },
  );
  expect(cloneDeep(data.concernEdit)).toMatchObject({
    title: 'Medical',
    resourceUrl: mockResourceUrl,
  });
});
it('edits a concern by removing a resource url', async () => {
  const { data } = await graphql(
    schema,
    concernEditMutation,
    null,
    { permissions, userId: user.id, marketId: user.homeMarketId, testTransaction: txn },
    {
      concernId: concern.id,
      title: 'Medical',
      resourceUrl: null,
    },
  );
  expect(data.concernEdit.resourceUrl).toBeNull();
});

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


/*
describe('concerns', () => {
  it('returns concerns', async () => {
    const { user } = await setup(txn);
    const concern1 = await Concern.create({ title: 'housing' }, txn);
    const concern2 = await Concern.create({ title: 'medical' }, txn);

    const result = await graphql(schema, getConcernsQuery, null, {
      permissions,
      userId: user.id,
      marketId: user.homeMarketId,
      testTransaction: txn,
    });
    const concernTitles = cloneDeep(result.data!.concerns).map((c: Concern) => c.title);
    expect(concernTitles).toContain(concern2.title);
    expect(concernTitles).toContain(concern1.title);
  });

  it('returns concerns in a custom order', async () => {
    const { user } = await setup(txn);
    const concern1 = await Concern.create({ title: 'abc' }, txn);
    const concern2 = await Concern.create({ title: 'def' }, txn);

    const result = await graphql(
      schema,
      getConcernsQuery,
      null,
      {
        userId: user.id,
        marketId: user.homeMarketId,
        permissions,
        testTransaction: txn,
      },
      {
        orderBy: 'titleAsc',
      },
    );
    expect(cloneDeep(result.data!.concerns)).toMatchObject([
      {
        title: concern1.title,
      },
      {
        title: concern2.title,
      },
    ]);
  });
});

describe('concern add diagnosis code', () => {
  it('adds a diagnosis code to a concern', async () => {
    const { user } = await setup(txn);
    await DiagnosisCode.create(
      {
        codesetName: 'ICD-10',
        code: 'A00',
        label: 'Cholera',
        version: '2018',
      },
      txn,
    );
    const concern = await Concern.create({ title: 'Housing' }, txn);
    expect(concern.diagnosisCodes.length).toEqual(0);

    const result = await graphql(
      schema,
      concernAddDiagnosisCodeMutation,
      null,
      { userId: user.id, marketId: user.homeMarketId, permissions, testTransaction: txn },
      {
        codesetName: 'ICD-10',
        code: 'A00',
        version: '2018',
        concernId: concern.id,
      },
    );
    expect(cloneDeep(result.data!.concernAddDiagnosisCode)).toMatchObject({
      title: concern.title,
      diagnosisCodes: [
        {
          codesetName: 'ICD-10',
          code: 'A00',
          label: 'Cholera',
          version: '2018',
        },
      ],
    });
  });
});

describe('concern remove diagnosis code', () => {
  it('removes a diagnosis code from a concern', async () => {
    const { user } = await setup(txn);
    const diagnosisCode = await DiagnosisCode.create(
      {
        codesetName: 'ICD-10',
        code: 'A00',
        label: 'Cholera',
        version: '2018',
      },
      txn,
    );
    const concern = await Concern.create({ title: 'Housing' }, txn);
    await Concern.addDiagnosisCode(
      concern.id,
      {
        codesetName: 'ICD-10',
        code: 'A00',
        version: '2018',
      },
      txn,
    );
    const refetchedConcern = await Concern.get(concern.id, txn);
    expect(refetchedConcern.diagnosisCodes.length).toEqual(1);

    const result = await graphql(
      schema,
      concernRemoveDiagnosisCodeMutation,
      null,
      { userId: user.id, marketId: user.homeMarketId, permissions, testTransaction: txn },
      {
        concernId: concern.id,
        diagnosisCodeId: diagnosisCode.id,
      },
    );
    expect(cloneDeep(result.data!.concernRemoveDiagnosisCode)).toMatchObject({
      title: concern.title,
      diagnosisCodes: [],
    });
  });
});

});
*/