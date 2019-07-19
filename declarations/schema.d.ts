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
    allPokemon: Array<IPokemon | null>;
    pokemon: IPokemon;
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
    pokeType: PokeType;
    moves: Array<string | null>;
    imageUrl: string;
    items: Array<IItem | null>;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

  type uniqueId = IPokemon | IItem;

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

  interface IItem {
    id: string;
    name: string;
    pokemonId: string;
    price: number;
    happiness: number;
    imageUrl: string;
    pokemon: IPokemon;
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
    input: IPokemonCreateInput;
  }

  interface IPokemonEditOnRootMutationTypeArguments {
    pokemonId: string;
    pokemon: IPokemonEditInput;
  }

  interface IPokemonDeleteOnRootMutationTypeArguments {
    pokemonId: string;
  }

  interface IItemCreateOnRootMutationTypeArguments {
    input: IItemCreateInput;
  }

  interface IItemEditOnRootMutationTypeArguments {
    itemId: string;
    item: IItemEditInput;
  }

  interface IItemDeleteOnRootMutationTypeArguments {
    pokemonId: string;
  }

  interface IPokemonCreateInput {
    pokemonNumber: number;
    name: string;
    attack: number;
    defense: number;
    pokeType: PokeType;
    moves: Array<string | null>;
    imageUrl: string;
  }

  interface IPokemonEditInput {
    pokemonNumber?: number | null;
    name?: string | null;
    attack?: number | null;
    defense?: number | null;
    pokeType?: PokeType | null;
    moves?: Array<string | null> | null;
    imageUrl?: string | null;
  }

  interface IItemCreateInput {
    name: string;
    pokemonId: string;
    price: number;
    happiness: number;
    imageUrl: number;
  }

  interface IItemEditInput {
    name?: string | null;
    pokemonId?: string | null;
    price?: number | null;
    happiness?: number | null;
    imageUrl?: number | null;
  }
}

