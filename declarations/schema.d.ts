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
    pokemon: Array<IPokemon | null>;
    fullPokemon: IPokemon;
  }

  interface IFullPokemonOnRootQueryTypeArguments {
    pokemonId: string;
  }

  interface IPokemon {
    id: string;
    name: string;
    pokemonNumber: number;
    attack: number;
    defense: number;
    pokeType: PokeType;
    items: Array<IItem> | null;
    moves: Array<string | null>;
    imageUrl: string;
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
    deletedAt: string;
  }

  interface IRootMutationType {
    pokemonCreate: IPokemon;
    pokemonDelete: IPokemon;
    pokemonEdit: IPokemon;
  }

  interface IPokemonCreateOnRootMutationTypeArguments {
    input?: IPokemonCreateFields | null;
  }

  interface IPokemonDeleteOnRootMutationTypeArguments {
    input?: IPokemonDeleteInput | null;
  }

  interface IPokemonEditOnRootMutationTypeArguments {
    input?: IPokemonEditInput | null;
  }

  interface IPokemonCreateFields {
    name: string;
    pokemonNumber: number;
    attack: number;
    defense: number;
    pokeType: PokeType;
    moves: Array<string>;
    imageUrl: string;
  }

  interface IPokemonDeleteInput {
    pokemonId: string;
  }

  interface IPokemonEditInput {
    pokemonId: string;
    name?: string | null;
    pokemonNumber?: number | null;
    attack?: number | null;
    defense?: number | null;
    pokeType?: PokeType | null;
    moves?: Array<string> | null;
    imageUrl?: string | null;
  }
}

