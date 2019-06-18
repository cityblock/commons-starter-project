import { transaction } from 'objection';
import uuid from 'uuid';
import Pokemon from '../Pokemon';



describe('Pokemon', () => {
  /*
  - getAll(txn): returns all Pokemon, ordered by pokemonNumber ascending
  - get(pokemonId: string, txn: Transaction) ­ returns a single Pokemon, and associated items
  - create(input: IPokemonCreateInput, txn: Transaction) ­ creates and returns a Pokemon
  - edit(pokemonId: string, pokemon: IPokemonEditInput, txn: Transaction) ­ edits an existing Pokemon
  - delete(pokemonId: string, txn: Transaction) ­ marks a Pokemon as deleted, but does not actually delete it from the database
  */

  it('getAll: Returns all pokemons ordered using promises', async () => {
    const trx = await transaction.start(Pokemon.knex()); // Create transaction
    Pokemon.getAll(trx)
      .then(pokemon => {
        expect(pokemon instanceof Pokemon);
        // expect(pokemon.length).toBe(52);
        return trx.commit();
      })
      .catch(err => {
        throw err;
      })
  });

  it('get: Returns one particular pokemon', async () => {
    const trx = await transaction.start(Pokemon.knex()); // Create transaction
    let beforePokemon = {}

    Pokemon.getAll(trx)
      .then(res => {
        beforePokemon = res[0];
        return beforePokemon.id;
      })
      .then(id => Pokemon.get(id, trx))
      .then(afterPokemon => {
        expect(beforePokemon).toStrictEqual(afterPokemon);
        return trx.commit()
      })
      .catch(err => {
        throw err;
      })
  });


  it('create: Can Insert a Pokemon', async () => {
    const trx = await transaction.start(Pokemon.knex());
    Pokemon.getAll(trx)
      .then(arr => {
        // grab the last of the list
        const testPokemon = arr.slice(-1)[0];

        // modify some properties to be able to insert
        testPokemon.id = uuid()
        testPokemon.pokemonNumber += 1
        testPokemon.name = 'test_' + uuid()
        testPokemon.moves = []

        // Create the new Pokemon
        return Pokemon.create(testPokemon, trx)
      })
      .then(pokemon => {
        expect(pokemon instanceof Pokemon);
        return trx.commit()
      }).catch(err => {
        throw err;
      })
  });

  it('edit: Can Edit a Pokemon', async () => {

    const trx = await transaction.start(Pokemon.knex()); // Create transaction
    const name = 'edited_name_' + uuid();

    Pokemon.getAll(trx)
      .then(res => res[0].id)
      .then(id => {
        return Pokemon.edit(id, { 'name': name }, trx)
      })
      .then(res => {
        expect(res).toBe(1);
        return trx.commit();
      })
      .catch(err => {
        throw err;
      })
  });


  it('delete: Can mark a Pokemon as deleted', async () => {
    let trx;
    let allPokemon;
    trx = await transaction.start(Pokemon.knex()); // Create transaction
    let beforePokemon;
    let totalPokemonAffected;

    try {
      allPokemon = await Pokemon.getAll(trx);
      beforePokemon = allPokemon[0];

      totalPokemonAffected = await Pokemon.delete(beforePokemon.id, trx)
    }
    catch (err) {
      trx.rollback();
    }
    finally {
      trx.commit();
    }

    expect(totalPokemonAffected).toBe(1);

  });


});
