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
    pokemonAll: Array<IPokemon>;
  }

  interface IPokemon {
    id: string;
    pokemonNumber: number;
    name: string | null;
    attack: number | null;
    defense: number | null;
    pokeType: PokeType | null;
    moves: Array<string | null> | null;
    imageUrl: string | null;
    createdAt: any;
    updatedAt: any;
    deletedAt: any | null;
  }

  type uniqueId = IPokemon;

  interface IUniqueId {
    id: string;
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

  interface IRootMutationType {
    pokemonCreate: IPokemon | null;
    pokemonEdit: IPokemon | null;
    pokemonDelete: IPokemon | null;
    pokemon: IPokemon | null;
  }

  interface IPokemonCreateOnRootMutationTypeArguments {
    input: IPokemonCreateInput;
  }

  interface IPokemonEditOnRootMutationTypeArguments {
    input: IPokemonEditInput;
  }

  interface IPokemonDeleteOnRootMutationTypeArguments {
    input: IPokemonDeleteInput;
  }

  interface IPokemonOnRootMutationTypeArguments {
    input?: IPokemonInput | null;
  }

  interface IPokemonCreateInput {
    pokemonNumber: number;
    name: string;
    attack: number;
    defense: number;
    pokeType: PokeType;
    moves: Array<string>;
    imageUrl: string;
  }

  interface IPokemonEditInput {
    pokemonId: string;
    name?: string | null;
    attack?: number | null;
    defense?: number | null;
    pokeType?: PokeType | null;
    moves?: Array<string> | null;
    imageUrl?: string | null;
  }

  interface IPokemonDeleteInput {
    pokemonNumber: number;
  }

  interface IPokemonInput {
    pokemonNumber: number;
  }
}

