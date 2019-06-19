import { transaction } from 'objection';
import uuid from 'uuid';
import Pokemon from '../Pokemon';
import { PokeType } from '../PokeType';



describe('Pokemon', () => {
  /*
  - getAll(txn): returns all Pokemon, ordered by pokemonNumber ascending
  - get(pokemonId: string, txn: Transaction) ­ returns a single Pokemon, and associated items
  - create(input: IPokemonCreateInput, txn: Transaction) ­ creates and returns a Pokemon
  - edit(pokemonId: string, pokemon: IPokemonEditInput, txn: Transaction) ­ edits an existing Pokemon
  - delete(pokemonId: string, txn: Transaction) ­ marks a Pokemon as deleted, but does not actually delete it from the database
  */

  let trx = null as any;

  beforeEach(async () => {
    trx = await transaction.start(Pokemon.knex());
  });

  afterEach(async () => {
    await trx.rollback();
  });


  it('getAll: Returns all pokemons ordered using promises', async () => {
    const pokemon = await Pokemon.getAll(trx);
    expect(pokemon).toBeInstanceOf(Array);
  });


  it('get: Returns one particular pokemon', async () => {
    const pokemonList = await Pokemon.getAll(trx);
    const id = pokemonList[0].id
    const pokemon = await Pokemon.get(id, trx)

    expect(pokemon).toBeInstanceOf(Pokemon);
  });


  it('create: Can Insert a Pokemon', async () => {

    // Insert
    const newPokemon = await Pokemon.create({
      pokemonNumber: 100,
      name: 'test_' + uuid(),
      moves: ['Slash', 'Flame Wheel'],
      attack: 0,
      defense: 0,
      pokeType: PokeType.dragon,
      imageUrl: ''
    }, trx)

    // Test
    expect(newPokemon).toBeInstanceOf(Pokemon);
  });


  it('edit: Can Edit a Pokemon', async () => {

    // Get the first from the list
    const pokemonList = await Pokemon.getAll(trx);
    const id = pokemonList[0].id

    // Create a random name
    const name = 'edited_name_' + uuid();

    // Modify the name
    const editedPokemon = await Pokemon.edit(id, { 'name': name }, trx)

    // Test
    expect(editedPokemon).toBeInstanceOf(Pokemon);
    expect(editedPokemon.name).toBe(name);
  });


  it('delete: Can mark a Pokemon as deleted', async () => {

    // Get the first from the list
    const pokemonList = await Pokemon.getAll(trx);
    const id = pokemonList[0].id

    // Delete Pokemon
    const deletedPokemon = await Pokemon.delete(id, trx);

    // Test
    expect(deletedPokemon).toBeInstanceOf(Pokemon);
    expect(deletedPokemon).not.toBeNull();

  });

});
