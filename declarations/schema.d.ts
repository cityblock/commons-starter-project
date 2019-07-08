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
    pokemons: Array<IPokemon>;
    pokemon: IPokemon | null;
  }

  interface IPokemonOnRootQueryTypeArguments {
    pokemonId: string;
  }

  interface IPokemon {
    id: string;
    pokemonNumber: number;
    name: string | null;
    attack: number | null;
    defense: number | null;
    pokeType: string | null;
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

  interface IRootMutationType {
    pokemonCreate: IPokemon | null;
    pokemonEdit: IPokemon | null;
    pokemonDelete: IPokemon | null;
  }

  interface IPokemonCreateOnRootMutationTypeArguments {
    input: IPokemonCreateInput;
  }

  interface IPokemonEditOnRootMutationTypeArguments {
    input: IPokemonEditInput;
  }

  interface IPokemonDeleteOnRootMutationTypeArguments {
    input?: IPokemonDeleteInput | null;
  }

  interface IPokemonCreateInput {
    pokemonNumber: number;
    name: string;
    attack: number;
    defense: number;
    pokeType: string;
    moves: Array<string>;
    imageUrl: string;
  }

  interface IPokemonEditInput {
    id: string;
    name?: string | null;
    attack?: number | null;
    defense?: number | null;
    pokeType?: string | null;
    moves?: Array<string | null> | null;
    imageUrl?: string | null;
  }

  interface IPokemonDeleteInput {
    pokemonId: string;
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

  interface IPokemonInput {
    pokemonNumber: number;
  }
}

