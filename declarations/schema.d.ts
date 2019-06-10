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
    pokemon: IPokemon | null;
    pokemonGetAll: Array<IPokemon> | null;
    item: IItem | null;
  }

  interface IPokemonOnRootQueryTypeArguments {
    pokemonId: string;
  }

  interface IItemOnRootQueryTypeArguments {
    itemId: string;
  }

  interface IPokemon {
    id: string;
    pokemonNumber: number;
    name: string;
    attack: number;
    defense: number;
    pokeType: string;
    moves: Array<string>;
    imageUrl: string;
    item: Array<IItem>;
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
    pokemon: IPokemon;
    name: string;
    price: number;
    happiness: number;
    imageUrl: string;
    createdAt: any;
    updatedAt: any;
    deletedAt: any | null;
  }

  interface IRootMutationType {
    pokemonCreate: IPokemon | null;
  }

  interface IPokemonCreateOnRootMutationTypeArguments {
    input: IPokemonCreateInput;
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
}

