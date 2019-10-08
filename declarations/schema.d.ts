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
    allPokemon: Array<IPokemon | null> | null;
    pokemon: IPokemon | null;
    allItem: Array<IItem | null> | null;
    item: IItem | null;
  }

  interface IPokemonOnRootQueryTypeArguments {
    id: string;
  }

  interface IItemOnRootQueryTypeArguments {
    id: string;
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

  interface IRootMutationType {
    pokemonCreate: IPokemon | null;
    pokemonEdit: IPokemon | null;
    pokemonDelete: IPokemon | null;
    itemCreate: IItem | null;
    itemEdit: IItem | null;
    itemDelete: IItem | null;
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

  interface IItemCreateOnRootMutationTypeArguments {
    input: IItemCreateInput;
  }

  interface IItemEditOnRootMutationTypeArguments {
    input: IItemEditInput;
  }

  interface IItemDeleteOnRootMutationTypeArguments {
    input: IItemDeleteInput;
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

