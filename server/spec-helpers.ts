import { Transaction } from 'objection';
import Item from './models/item';
import Pokemon from './models/pokemon';

export async function createMockPokemons(txn: Transaction) {
  const pokemon1 = await Pokemon.create(
    {
      name: 'Bulbasaur',
      pokemonNumber: 98,
      attack: 11,
      defense: 22,
      pokeType: 'grass',
      moves: JSON.stringify(['Tackle', 'Growl', 'Leech Seed']),
      imageUrl:
        'https://cdn.bulbagarden.net/upload/thumb/2/21/001Bulbasaur.png/1200px-001Bulbasaur.png',
    },
    txn,
  );

  const pokemon2 = await Pokemon.create(
    {
      name: 'Ivysaur',
      pokemonNumber: 99,
      attack: 33,
      defense: 44,
      pokeType: 'grass',
      moves: JSON.stringify(['Poisonpower', 'Vine Whip']),
      imageUrl: 'https://cdn.bulbagarden.net/upload/7/73/002Ivysaur.png',
    },
    txn,
  );

  const pokemon3 = await Pokemon.create(
    {
      name: 'Venusaur',
      pokemonNumber: 100,
      attack: 45,
      defense: 54,
      pokeType: 'grass',
      moves: JSON.stringify(['Venoshock', 'Solar Beam']),
      imageUrl:
        'https://cdn.bulbagarden.net/upload/thumb/a/ae/003Venusaur.png/500px-003Venusaur.png',
    },
    txn,
  );
  return [pokemon1, pokemon2, pokemon3];
}

export async function createMockPokemonAndItems(txn: Transaction) {
  const pokemon1 = await Pokemon.create(
    {
      name: 'Bulbasaur',
      pokemonNumber: 98,
      attack: 11,
      defense: 22,
      pokeType: 'grass',
      moves: JSON.stringify(['Tackle', 'Growl', 'Leech Seed']),
      imageUrl:
        'https://cdn.bulbagarden.net/upload/thumb/2/21/001Bulbasaur.png/1200px-001Bulbasaur.png',
    },
    txn,
  );

  const item1 = await Item.create(
    {
      name: 'Oran Berry',
      pokemonId: pokemon1.id,
      price: 34,
      happiness: 3,
      imageUrl: 'http://www.stickpng.com/assets/images/580b57fbd9996e24bc43bed6.png',
    },
    txn,
  );

  const item2 = await Item.create(
    {
      name: 'Air Balloon',
      pokemonId: pokemon1.id,
      price: 52,
      happiness: 56,
      imageUrl:
        'https://thumbs.dreamstime.com/b/red-green-blue-helium-balloons-set-isolated-transparent-background-balloon-birthday-baloon-flying-party-celebrations-98446709.jpg',
    },
    txn,
  );

  return { items: [item1, item2], ...pokemon1 };
}
