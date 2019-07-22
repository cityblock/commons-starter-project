declare module 'schema' {
  interface IGraphQLResponseRoot {
    data?: IRootQueryType | IRootMutationType;
    errors?: Array<IGraphQLResponseError>;
  }

  interface IGraphQLResponseError {
    /** Required for all errors */
    message: string;
    locations?: Array<IGraphQLResponseErrorLocation>;
    /** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
    [propName: string]: any;
  }

  interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }

  interface IRootQueryType {
    allPokemon: Array<IPokemon>;
    singlePokemon: IPokemon;
  }

  interface ISinglePokemonOnRootQueryTypeArguments {
    pokemonId?: string | null;
  }

  interface IPokemon {
    id: string;
    pokemonNumber: number;
    name: string;
    attack: number;
    defense: number;
    moves: Array<string>;
    pokeType: PokeType;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    item: Array<IItem | null>;
  }

  type uniqueId = IPokemon | IItem;

  interface IUniqueId {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

  const enum PokeType {
    normal = 'normal',
    grass = 'grass',
    fire = 'fire',
    water = 'water',
    electric = 'electric',
    psychic = 'psychic',
    ghost = 'ghost',
    dark = 'dark',
    fairy = 'fairy',
    rock = 'rock',
    ground = 'ground',
    steel = 'steel',
    flying = 'flying',
    fighting = 'fighting',
    bug = 'bug',
    ice = 'ice',
    dragon = 'dragon',
    poison = 'poison'
  }

  interface IItem {
    id: string;
    name: string;
    pokemonId: string;
    price: number;
    happiness: number;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

  interface IRootMutationType {
    createPokemon: IPokemon | null;
  }

  interface ICreatePokemonOnRootMutationTypeArguments {
    input?: IPokemonCreateInput | null;
  }

  interface IPokemonCreateInput {
    pokemonNumber: number;
    name: string;
    attack: number;
    defense: number;
    moves: Array<string>;
    pokeType: PokeType;
    imageUrl: string;
  }
}

