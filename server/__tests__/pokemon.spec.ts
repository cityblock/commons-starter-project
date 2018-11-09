import { transaction } from 'objection';
import { buildRandomItem } from '../item-mocks';
import Item, { IItemCreateFields } from '../models/item';
import Pokemon, { IPokemonCreateFields } from '../models/pokemon';
import { pokemonSample } from '../pokemon-mocks';

describe('Pokemon Model', () => {
  let txn = null as any;
  let samplePokemon: IPokemonCreateFields;
  [samplePokemon] = pokemonSample(0, 1);

  beforeEach(async () => {
    txn = await transaction.start(Pokemon.knex());
  });

  afterEach(() => {
    return txn.rollback();
  });

  describe('create', () => {
    it('creates a Pokemon instance', async () => {
      const newPoke = await Pokemon.create(samplePokemon, txn);
      Object.keys(samplePokemon).forEach((propName: string) => {
        expect(newPoke).toHaveProperty(propName);
        expect(newPoke[propName]).not.toBeFalsy();
      });
    });
  });
  describe('get', () => {
    it('retrieves a pokemon and associated items', async () => {
      let pokeItem = null as any;

      const newPoke: Pokemon = await Pokemon.create(samplePokemon, txn);
      const sampleItem: IItemCreateFields = buildRandomItem(newPoke.id);
      await Item.create(sampleItem, txn);
      const firstPoke: Pokemon = await Pokemon.get(newPoke.id, txn);
      const firstPokeItems: Item[] = firstPoke.item;
      [pokeItem] = firstPokeItems;

      expect(firstPoke.name).toBe(samplePokemon.name);
      expect(firstPokeItems.length).toBeGreaterThan(0);
      expect(pokeItem.pokemonId).toEqual(firstPoke.id);
    });
  });
  describe('getAll', () => {
    it('retrieves all pokemon', async () => {
      const sampleOf3Pokemon = pokemonSample(2, 5);
      const [firstOfSample] = sampleOf3Pokemon;
      await Pokemon.create(sampleOf3Pokemon[0], txn);
      await Pokemon.create(sampleOf3Pokemon[1], txn);
      await Pokemon.create(sampleOf3Pokemon[2], txn);
      const allPokemon: Pokemon[] = await Pokemon.getAll(txn);
      expect(allPokemon.length).toEqual(3);
      allPokemon.forEach(poke => {
        Object.keys(firstOfSample).forEach((propName: string) => {
          expect(poke).toHaveProperty(propName);
          expect(poke[propName]).not.toBeFalsy();
        });
      });
    });
  });
});