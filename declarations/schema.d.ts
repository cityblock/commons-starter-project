declare module 'schema' {
  interface IGraphQLResponseRoot {
    data?: IRootQueryType | IRootMutationType;
    errors?: IGraphQLResponseError[];
  }

  interface IGraphQLResponseError {
    /** Required for all errors */
    message: string;
    locations?: IGraphQLResponseErrorLocation[];
    /** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
    [propName: string]: any;
  }

  interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }

  interface IRootQueryType {
    pokemon: IPokemon | null;
    pokemons: IPokemon[];
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
    moves: string[];
    imageUrl: string;
    item: IItem[];
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
    pokemonId: string;
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
    pokemonDelete: IPokemon;
    pokemonEdit: IPokemon | null;
    itemCreate: IItem | null;
    itemDelete: IItem;
    itemEdit: IItem | null;
  }

  interface IPokemonCreateOnRootMutationTypeArguments {
    input: IPokemonCreateInput;
  }

  interface IPokemonEditOnRootMutationTypeArguments {
    input: IPokemonEditInput;
  }

  interface IItemCreateOnRootMutationTypeArguments {
    input: IItemCreateInput;
  }

  interface IItemEditOnRootMutationTypeArguments {
    input: IItemEditInput;
  }

  interface IPokemonCreateInput {
    pokemonNumber: number;
    name: string;
    attack: number;
    defense: number;
    pokeType: string;
    moves: string[];
    imageUrl: string;
  }

  interface IPokemonEditInput {
    pokemonId: string;
    name?: string | null;
    attack?: number | null;
    defense?: number | null;
    pokeType?: string | null;
    moves?: string[] | null;
    imageUrl?: string | null;
  }

  interface IItemCreateInput {
    name: string;
    pokemonId: string;
    price: number;
    happiness: number;
    imageUrl: string;
  }

  interface IItemEditInput {
    itemId: string;
    pokemonId?: string | null;
    name?: string | null;
    price?: number | null;
    happiness?: number | null;
    imageUrl?: string | null;
  }
}

