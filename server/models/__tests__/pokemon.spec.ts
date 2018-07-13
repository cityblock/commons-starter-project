import { transaction } from 'objection';
import Pokemon from '../pokemon';

describe('Pokemon Model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(Pokemon.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('create', () => {
    it('creates a pokemon', async () => {
      const pokemon = await Pokemon.create(
        {
          pokemonNumber: 1111,
          name: 'Newbie',
          attack: 9,
          defense: 20,
          pokeType: 'bug',
          moves: ['sit still', 'eat pizza'],
          imageUrl: 'fakeimageURL',
        },
        txn,
      );

      expect(pokemon.name).toBe('Newbie');
    });

    // it('throws an error for incorrect input', async () => {
    //   expect(() => {
    //     Pokemon.create(
    //       {
    //         pokemonNumber: 1111,
    //         name: 'Newbie',
    //       },
    //       txn,
    //     );
    //   }).toThrow(ValidationError);
      // const pokemon = await Pokemon.create(
      //   {
      //     pokemonNumber: 1111,
      //     name: 'Newbie',
      //   },
      //   txn,
      // );

      // expect(pokemon).toThrow(ValidationError);
    });
  });

  // describe('getAll', () => {
  //   it('retrieves all pokemon', async () => {
  //     // create multiple pokemon
  //     // call getAll
  //   })
  // })
});
