declare module 'schema' {
  interface IGraphQLResponseRoot {
    data?: IRootQueryType;
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
    getAllPokemon: Array<IPokemon | null> | null;
  }

  interface IPokemon {
    id: string;
    pokemonNumber: number;
    name: string;
    attack: number;
    defense: number;
    pokeType: string;
    moves: Array<string | null>;
    imageUrl: string;
    createdAt: any;
    updatedAt: any;
    deletedAt: any | null;
  }

  type uniqueId = IPokemon | IItem;

  interface IUniqueId {
    id: string;
  }

  interface IItem {
    id: string;
    name: string;
    pokemonId: string;
    price: number;
    happiness: number;
    imageUrl: string;
    createdAt: any;
    updatedAt: any;
    deletedAt: any | null;
  }

  interface IPokemonCreateInput {
    id: string;
    pokemonNumber: number;
    name: string;
    attack: number;
    defense: number;
    pokeType: string;
    moves: Array<string | null>;
    imageUrl: string;
    createdAt: any;
    updatedAt: any;
    deletedAt?: any | null;
  }

  interface IPokemonEditInput {
    attack?: number | null;
    defense?: number | null;
    pokeType?: string | null;
    moves?: Array<string | null> | null;
    imageUrl?: string | null;
    updatedAt?: any | null;
    deletedAt?: any | null;
  }

  interface IPokemonDeleteInput {
    id: string;
  }

  interface IItemCreateInput {
    id: string;
    name: string;
    pokemonId: string;
    price: number;
    happiness: number;
    imageUrl: string;
    createdAt: any;
    updatedAt: any;
    deletedAt?: any | null;
  }

  interface IItemEditInput {
    price?: number | null;
    happiness?: number | null;
    imageUrl?: string | null;
    updatedAt?: any | null;
    deletedAt?: any | null;
  }

  interface IItemDeleteInput {
    id: string;
  }
}

