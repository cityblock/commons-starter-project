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
    getAllPokemon: Array<IPokemon | null>;
    pokemonItems: IPokemon | null;
  }

  interface IPokemonItemsOnRootQueryTypeArguments {
    pokemonId: string;
  }

  interface IPokemon {
    id: string;
    pokemonNumber: number;
    name: string;
    attack: number;
    defense: number;
    pokeType: string;
    moves: any;
    imageUrl: string;
    createdAt: any;
    updatedAt: any;
    deletedAt: any | null;
    items: Array<IItem | null> | null;
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
    newPokemon: IPokemon | null;
    editedPokemon: IPokemon | null;
  }

  interface INewPokemonOnRootMutationTypeArguments {
    input: IPokemonCreateInput;
  }

  interface IEditedPokemonOnRootMutationTypeArguments {
    id: string;
    input: IPokemonEditInput;
  }

  interface IPokemonCreateInput {
    pokemonNumber: number;
    name: string;
    attack: number;
    defense: number;
    pokeType: string;
    moves: any;
    imageUrl: string;
  }

  interface IPokemonEditInput {
    pokemonNumber?: number | null;
    name?: string | null;
    attack?: number | null;
    defense?: number | null;
    pokeType?: string | null;
    moves?: any | null;
    imageUrl?: string | null;
  }
}

