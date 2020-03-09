import { JsonSchema, Model, QueryBuilder, RelationMappings, Transaction } from 'objection';

// enum PokemonType {
//   normal = 'normal',
//   grass = 'grass',
//   fire = 'fire',
//   water = 'water',
//   electric = 'electric',
//   psychic = 'psychic',
//   ghost = 'ghost',
//   dark = 'dark',
//   fairy = 'fairy',
//   rock = 'rock',
//   ground = 'ground',
//   steel = 'steel',
//   flying = 'flying',
//   fighting = 'fighting',
//   bug = 'bug',
//   ice = 'ice',
//   dragon = 'dragon',
//   poison = 'poison'
// }

export interface ITest {
  id: string;
}
export interface IPokemonCreateFields {
  pokemonId: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: string;
  moves: string[];
  imageUrl: string;
}

export default class Pokemon extends Model {
  // static modelPaths = [__dirname]
  static pickJsonSchemaProperties = true;
  static tableName = 'pokemon';

  // tslint:disable-next-line: member-ordering
  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      pokemonNumber: { type: 'number' },
      name: { type: 'string' },
      attack: { type: 'number' },
      defense: { type: 'number' },
      pokeType: { type: 'string' },
      moves: { type: 'array', items: { type: 'string' } },
      imageUrl: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
      deletedAt: { type: ['string', 'null'] },
    },
    required: ['pokemonNumber', 'name', 'attack', 'defense', 'pokeType', 'moves', 'imageUrl'],
  };

  // tslint:disable-next-line: member-ordering
  static async create(pokemon: IPokemonCreateFields, txn: Transaction) {
    return this.query(txn).insertAndFetch(pokemon);
  }

  static async getAll(txn: Transaction) {
    return this.query(txn).orderBy('pokemonNumber');
  }

  id!: string;
  pokemonNumber!: number;
  name!: string;
  attack!: number;
  defense!: number;
  pokeType!: string;
  moves!: string[];
  imageUrl!: string;
  createdAt!: string;
  updatedAt!: string;
  deletedAt!: string | null;

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  $beforeDelete() {
    this.deletedAt = new Date().toISOString();
  }
}
