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
    queryAllPokemon: Array<IPokemon | null> | null;
    queryOnePokemon: IPokemon | null;
    queryOneItem: IItem | null;
  }

  interface IQueryOnePokemonOnRootQueryTypeArguments {
    id: string;
  }

  interface IQueryOneItemOnRootQueryTypeArguments {
    id: string;
  }

  interface IPokemon {
    id: string;
    pokemonNumber: number | null;
    name: string | null;
    attack: number | null;
    defense: number | null;
    pokeType: PokeType | null;
    moves: Array<string | null>;
    imageUrl: string | null;
    items: Array<IItem | null>;
    createdAt: any | null;
    updatedAt: any | null;
    deletedAt: any | null;
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
    name: string | null;
    pokemonId: string | null;
    price: number | null;
    happiness: number | null;
    imageUrl: string | null;
    pokemon: IPokemon | null;
    createdAt: any | null;
    updatedAt: any | null;
    deletedAt: any | null;
  }

  interface IRootMutationType {
    mutatePokemonCreate: IPokemon | null;
    mutatePokemonEdit: IPokemon | null;
    mutatePokemonDelete: IPokemon | null;
    mutateItemCreate: IItem | null;
    mutateItemEdit: IItem | null;
    mutateItemDelete: IItem | null;
  }

  interface IMutatePokemonCreateOnRootMutationTypeArguments {
    input?: IPokemonFields | null;
  }

  interface IMutatePokemonEditOnRootMutationTypeArguments {
    id: string;
    input?: IPokemonFields | null;
  }

  interface IMutatePokemonDeleteOnRootMutationTypeArguments {
    id: string;
  }

  interface IMutateItemCreateOnRootMutationTypeArguments {
    input?: IItemFields | null;
  }

  interface IMutateItemEditOnRootMutationTypeArguments {
    id: string;
    input?: IItemFields | null;
  }

  interface IMutateItemDeleteOnRootMutationTypeArguments {
    id: string;
  }

  interface IPokemonFields {
    pokemonNumber: number;
    name?: string | null;
    attack?: number | null;
    defense?: number | null;
    pokeType?: PokeType | null;
    moves?: Array<string | null> | null;
    imageUrl?: string | null;
  }

  interface IItemFields {
    name?: string | null;
    pokemonId?: string | null;
    price?: number | null;
    happiness?: number | null;
    imageUrl?: string | null;
  }
}

