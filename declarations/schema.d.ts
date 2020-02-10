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
    moves: Array<string>;
    imageUrl: string;
    createdAt: any;
    updatedAt: any;
    deletedAt: any | null;
    items: Array<IItem>;
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
    createdAt: any;
    updatedAt: any;
    deletedAt: any | null;
  }

  interface IRootMutationType {
    createPokemon: IPokemon;
    editPokemon: IPokemon;
    deletePokemon: IPokemon;
    createItem: IItem;
  }

  interface ICreatePokemonOnRootMutationTypeArguments {
    input: IPokemonCreateInput;
  }

  interface IEditPokemonOnRootMutationTypeArguments {
    input: IPokemonEditInput;
  }

  interface IDeletePokemonOnRootMutationTypeArguments {
    pokemonId: string;
  }

  interface ICreateItemOnRootMutationTypeArguments {
    input: IItemCreateInput;
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
    pokemonNumber?: number | null;
    name?: string | null;
    attack?: number | null;
    defense?: number | null;
    pokeType?: PokeType | null;
    moves?: Array<string> | null;
    imageUrl?: string | null;
  }

  interface IItemCreateInput {
    name: string;
    pokemonId: string;
    price: number;
    happiness: number;
    imageUrl: string;
  }
}

