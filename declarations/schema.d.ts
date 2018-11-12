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
    pokemon: IPokemon;
    allItem: Array<IItem | null> | null;
    item: IItem;
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
    imageUrl: string;
    moves: Array<string>;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

  /**
   * An object with a Globally Unique ID
   */
  type uniqueId = IPokemon | IItem;

  /**
   * An object with a Globally Unique ID
   */
  interface IUniqueId {

    /**
     * The ID of the object.
     */
    id: string;
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
    pokemonCreate: IPokemon;
    pokemonEdit: IPokemon;
    pokemonDelete: IPokemon;
    itemCreate: IItem;
    itemEdit: IItem;
    itemDelete: IItem;
  }

  interface IPokemonCreateOnRootMutationTypeArguments {
    input?: IPokemonCreateInput | null;
  }

  interface IPokemonEditOnRootMutationTypeArguments {
    input?: IPokemonEditInput | null;
  }

  interface IPokemonDeleteOnRootMutationTypeArguments {
    input?: string | null;
  }

  interface IItemCreateOnRootMutationTypeArguments {
    input?: IItemCreateInput | null;
  }

  interface IItemEditOnRootMutationTypeArguments {
    input?: IItemEditInput | null;
  }

  interface IItemDeleteOnRootMutationTypeArguments {
    input?: string | null;
  }

  interface IPokemonCreateInput {
    pokemonNumber: number;
    name: string;
    attack: number;
    defense: number;
    pokeType: string;
    imageUrl: string;
    moves: Array<string>;
  }

  interface IPokemonEditInput {
    id: string;
    pokemonNumber?: number | null;
    name?: string | null;
    attack?: number | null;
    defense?: number | null;
    pokeType?: string | null;
    imageUrl?: string | null;
    moves?: Array<string | null> | null;
  }

  interface IItemCreateInput {
    id: string;
    name: string;
    pokemonId: string;
    price: number;
    happiness: number;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
  }

  interface IItemEditInput {
    id: string;
    price?: number | null;
    happiness?: number | null;
    imageUrl?: string | null;
  }
}

